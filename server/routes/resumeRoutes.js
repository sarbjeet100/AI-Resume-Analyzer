import express from "express";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
} from "../controllers/resumeController.js";

const router = express.Router();

// =====================================================
// Resume Routes
// Base URL : /api/resume
// =====================================================

// Upload Resume
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

// Get All User Resumes
router.get(
  "/",
  protect,
  getMyResumes
);

// Get Resume By ID
router.get(
  "/:id",
  protect,
  getResumeById
);

// Delete Resume
router.delete(
  "/:id",
  protect,
  deleteResume
);

export default router;