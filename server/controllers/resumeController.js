import fs from "fs";
import Resume from "../models/Resume.js";

import { extractTextFromPDF } from "../services/pdfService.js";
import { parseResume } from "../services/parserService.js";
import { calculateATSScore } from "../services/atsService.js";
import { analyzeResume } from "../services/geminiService.js";
import { generateJobRecommendations } from "../services/jobRecommendationService.js";

// ======================================================
// Upload Resume
// ======================================================

export const uploadResume = async (req, res, next) => {
  const startTime = Date.now();

  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume.",
      });
    }

    // ==========================================
    // Extract Text
    // ==========================================

    const extractedText = await extractTextFromPDF(
      req.file.path
    );

    if (
      !extractedText ||
      extractedText.trim().length < 30
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to extract readable text from this PDF.",
      });
    }

    console.log("\n========== EXTRACTED TEXT ==========\n");
    console.log(extractedText.substring(0, 1500));
    console.log("\n====================================\n");

    // ==========================================
    // Parse Resume
    // ==========================================

    const parsedResume = parseResume(extractedText);

    console.log("\n========== PARSED RESUME ==========\n");
    console.log(
      JSON.stringify(parsedResume, null, 2)
    );
    console.log("\n===================================\n");

    // ==========================================
    // ATS
    // ==========================================

    const ats = calculateATSScore(parsedResume);

    console.log("\n========== ATS ==========\n");
    console.log(JSON.stringify(ats, null, 2));
    console.log("\n=========================\n");

    // ==========================================
    // AI Analysis
    // ==========================================

    let aiAnalysis;

    try {
      aiAnalysis = await analyzeResume(
        parsedResume,
        ats
      );
    } catch (err) {
      console.error(
        "Gemini Analysis Failed:",
        err.message
      );

      aiAnalysis = {
        professionalSummary:
          parsedResume.summary ||
          "Professional summary unavailable.",

        strengths: [
          "Resume parsed successfully.",
          "ATS analysis completed.",
        ],

        weaknesses: [],

        missingSkills:
          ats.missingSkills || [],

        improvements:
          ats.suggestions || [],

        recommendedProjects: [
          "AI Resume Analyzer",
          "Portfolio Website",
          "E-Commerce Website",
        ],

        recommendedCertifications: [
          "AWS Cloud Practitioner",
          "Google Cybersecurity",
          "Meta Frontend Developer",
        ],

        recommendedTechnologies: [
          "React",
          "Node.js",
          "MongoDB",
          "Docker",
        ],

        interviewQuestions: [
          "Explain your strongest project.",
          "What is REST API?",
          "Explain OOP concepts.",
        ],

        overallFeedback:
          "Resume uploaded successfully. Improve the ATS suggestions to increase recruiter visibility.",
      };
    }

    // ==========================================
    // Job Recommendations
    // ==========================================

    let jobRecommendations;

    try {
      jobRecommendations =
        await generateJobRecommendations(
          parsedResume,
          ats
        );
    } catch (err) {
      console.error(
        "Job Recommendation Failed:",
        err.message
      );

      jobRecommendations = {
        recommendedJobs: [],
        careerRoadmap: [],
        overallAdvice:
          "Job recommendations are currently unavailable.",
      };
    }

    // ==========================================
    // Save Resume
    // ==========================================

    const processingTime =
      Date.now() - startTime;

    const resume = await Resume.create({
      user: req.user.id,

      originalName: req.file.originalname,

      fileName: req.file.filename,

      filePath: req.file.path,

      fileSize: req.file.size,

      mimeType: req.file.mimetype,

      extractedText,

      parsedResume,

      ats,

      aiAnalysis,

      jobRecommendations,

      processingTime,

      status: "completed",
    });

    return res.status(201).json({
      success: true,

      message:
        "Resume analyzed successfully.",

      data: {
        id: resume._id,

        fileName: resume.originalName,

        atsScore: ats.overallScore,

        processingTime,

        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// ======================================================
// Get All Resumes
// ======================================================

export const getMyResumes = async (
  req,
  res,
  next
) => {
  try {
    const resumes = await Resume.find({
      user: req.user.id,
    })
      .select("-extractedText")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// Get Resume By ID
// ======================================================

export const getResumeById = async (
  req,
  res,
  next
) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// Delete Resume
// ======================================================

export const deleteResume = async (
  req,
  res,
  next
) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    if (
      resume.filePath &&
      fs.existsSync(resume.filePath)
    ) {
      fs.unlinkSync(resume.filePath);
    }

    await resume.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Resume deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};