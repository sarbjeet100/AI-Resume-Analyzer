import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`
========================================================
🚀 AI Resume Analyzer Server Started Successfully
🌍 Environment : ${process.env.NODE_ENV || "development"}
📡 Server      : http://localhost:${PORT}
========================================================
`);
    });
  } catch (error) {
    console.error(
      "❌ Failed to start server:"
    );
    console.error(error);
    process.exit(1);
  }
};

startServer();