import Resume from "../models/Resume.js";

// ======================================================
// Dashboard Analytics
// GET /api/dashboard
// ======================================================

export const getDashboard = async (req, res, next) => {
  try {
    const resumes = await Resume.find({
      user: req.user.id,
    })
      .select("-extractedText")
      .sort({
        createdAt: -1,
      });

    const totalResumes = resumes.length;

    let totalScore = 0;
    let highestATS = 0;
    let lowestATS = totalResumes ? 100 : 0;

    let completed = 0;
    let processing = 0;
    let failed = 0;

    let totalProcessingTime = 0;

    let bestResume = null;

    const recentUploads = resumes
      .slice(0, 6)
      .map((resume) => ({
        id: resume._id,
        fileName: resume.originalName,
        atsScore: resume.ats?.overallScore || 0,
        status: resume.status,
        uploadedAt: resume.createdAt,
        processingTime:
          resume.processingTime || 0,
      }));

    resumes.forEach((resume) => {
      const score =
        resume.ats?.overallScore || 0;

      totalScore += score;

      totalProcessingTime +=
        resume.processingTime || 0;

      if (score > highestATS) {
        highestATS = score;

        bestResume = {
          id: resume._id,
          fileName: resume.originalName,
          score,
        };
      }

      if (score < lowestATS) {
        lowestATS = score;
      }

      switch (resume.status) {
        case "completed":
          completed++;
          break;

        case "processing":
          processing++;
          break;

        case "failed":
          failed++;
          break;

        default:
          break;
      }
    });

    const averageATS =
      totalResumes > 0
        ? Number(
            (
              totalScore / totalResumes
            ).toFixed(1)
          )
        : 0;

    const averageProcessingTime =
      totalResumes > 0
        ? Math.round(
            totalProcessingTime /
              totalResumes
          )
        : 0;

    return res.status(200).json({
      success: true,

      data: {
        totalResumes,

        averageATS,

        highestATS,

        lowestATS,

        completed,

        processing,

        failed,

        averageProcessingTime,

        bestResume,

        recentUploads,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};