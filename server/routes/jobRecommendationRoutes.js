import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getJobRecommendations,
} from "../controllers/jobRecommendationController.js";

const router = express.Router();

/**
 * GET /api/job-recommendation/:resumeId
 */
router.get(
  "/:resumeId",
  protect,
  getJobRecommendations
);

export default router;