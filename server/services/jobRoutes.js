import express from "express";

import protect from "../middleware/authMiddleware.js";

import { matchResumeWithJob } from "../controllers/jobController.js";

const router = express.Router();

router.post("/match", protect, matchResumeWithJob);

export default router;