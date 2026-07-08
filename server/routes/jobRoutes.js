import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  matchResumeWithJob,
} from "../controllers/jobController.js";

const router = express.Router();

// =====================================================
// Job Matching Routes
// Base URL : /api/job
// =====================================================

// Match Resume with Job Description
router.post(
  "/match",
  protect,
  matchResumeWithJob
);

// Health Check
router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Job Matching API is running.",
  });
});

export default router;