import Resume from "../models/Resume.js";
import { generateJobRecommendations } from "../services/jobRecommendationService.js";

// ======================================================
// Generate Job Recommendations
// POST /api/job-recommendation/:resumeId
// ======================================================

export const getJobRecommendations = async (
  req,
  res,
  next
) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    let recommendations = resume.jobRecommendations;

    if (
      !recommendations ||
      recommendations.recommendedJobs?.length === 0
    ) {
      recommendations =
        await generateJobRecommendations(
          resume.parsedResume,
          resume.ats
        );

      resume.jobRecommendations = recommendations;

      await resume.save();
    }

    return res.status(200).json({
      success: true,
      message:
        "Job recommendations generated successfully.",
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};