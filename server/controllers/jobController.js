import Resume from "../models/Resume.js";
import { matchJobDescription } from "../services/jobMatcherService.js";
import { analyzeResume } from "../services/geminiService.js";

export const matchResumeWithJob = async (req, res, next) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Resume ID and Job Description are required.",
      });
    }

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

    // Local ATS Matching
    const matchResult = matchJobDescription(
      resume.parsedResume,
      jobDescription
    );

    // AI Suggestions
    const aiResult = await analyzeResume(
      resume.parsedResume,
      {
        overallScore: matchResult.score,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
        suggestions: [
          "Customize your resume according to the job description.",
          "Add missing keywords naturally.",
          "Highlight relevant projects and achievements.",
        ],
      }
    );

    return res.status(200).json({
      success: true,
      message: "Job matching completed successfully.",
      data: {
        resumeId: resume._id,
        resumeName: resume.originalName,

        matchScore: matchResult.score,

        matchedSkills: matchResult.matchedSkills,

        missingSkills: matchResult.missingSkills,

        totalKeywords: matchResult.totalKeywords,

        aiFeedback: aiResult.overallFeedback,

        strengths: aiResult.strengths,

        weaknesses: aiResult.weaknesses,

        improvements: aiResult.improvements,

        recommendedProjects:
          aiResult.recommendedProjects,

        recommendedCertifications:
          aiResult.recommendedCertifications,

        recommendedTechnologies:
          aiResult.recommendedTechnologies,

        interviewQuestions:
          aiResult.interviewQuestions,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};