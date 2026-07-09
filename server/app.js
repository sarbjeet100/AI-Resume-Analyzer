import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import jobRecommendationRoutes from "./routes/jobRecommendationRoutes.js";

const app = express();

// ==========================================
// Security
// ==========================================

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const allowedOrigins = [
  "http://localhost:5173",
  "https://airesumeanalyzer-beryl.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      const clientUrl = process.env.CLIENT_URL;
      const origins = [...allowedOrigins];
      if (clientUrl) {
        origins.push(clientUrl.replace(/\/$/, "")); // remove trailing slash if any
      }

      if (origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ==========================================
// Middlewares
// ==========================================

app.use(morgan("dev"));

app.use(
  express.json({
    limit: "20mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb",
  })
);
app.use(
  "/api/job-recommendation",
  jobRecommendationRoutes
);

app.use(cookieParser());

// ==========================================
// Static Files
// ==========================================

app.use(
  "/uploads",
  express.static("uploads")
);

// ==========================================
// Root Route
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    project: "AI Resume Analyzer",
    version: "3.0.0",
    environment:
      process.env.NODE_ENV ||
      "development",
    status: "Running",
    timestamp: new Date(),
  });
});

// ==========================================
// Health Check
// ==========================================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "Healthy",
    uptime: process.uptime(),
  });
});

// ==========================================
// API Routes
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/job", jobRoutes);

// ==========================================
// 404
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// ==========================================
// Global Error Handler
// ==========================================

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID.",
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    message:
      err.message ||
      "Internal Server Error",
  });
});

export default app;