import express from "express";

import protect from "../middleware/authMiddleware.js";
import { getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

// ======================================
// Dashboard Routes
// Base URL: /api/dashboard
// ======================================

// Dashboard Analytics
router.get(
  "/",
  protect,
  getDashboard
);

// Health Check
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Dashboard API is running.",
  });
});

export default router;