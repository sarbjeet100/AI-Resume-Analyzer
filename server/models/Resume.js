import mongoose from "mongoose";

// ===============================================
// Parsed Resume Schema
// ===============================================

const parsedResumeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    github: {
      type: String,
      default: "",
      trim: true,
    },

    portfolio: {
      type: String,
      default: "",
      trim: true,
    },

    summary: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    education: {
      type: [String],
      default: [],
    },

    experience: {
      type: [String],
      default: [],
    },

    projects: {
      type: [String],
      default: [],
    },

    certifications: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },

    achievements: {
      type: [String],
      default: [],
    },

    internships: {
      type: [String],
      default: [],
    },

    rawText: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

// ===============================================
// ATS Schema
// ===============================================

const atsSchema = new mongoose.Schema(
  {
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    breakdown: {
      contact: {
        type: Number,
        default: 0,
      },

      summary: {
        type: Number,
        default: 0,
      },

      skills: {
        type: Number,
        default: 0,
      },

      experience: {
        type: Number,
        default: 0,
      },

      education: {
        type: Number,
        default: 0,
      },

      projects: {
        type: Number,
        default: 0,
      },

      certifications: {
        type: Number,
        default: 0,
      },

      formatting: {
        type: Number,
        default: 0,
      },
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);

// ===============================================
// AI Analysis Schema
// ===============================================

const aiAnalysisSchema = new mongoose.Schema(
  {
    professionalSummary: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    recommendedProjects: {
      type: [String],
      default: [],
    },

    recommendedCertifications: {
      type: [String],
      default: [],
    },

    recommendedTechnologies: {
      type: [String],
      default: [],
    },

    interviewQuestions: {
      type: [String],
      default: [],
    },

    overallFeedback: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

// ===============================================
// Job Recommendation Schema
// ===============================================

const jobRecommendationSchema = new mongoose.Schema(
  {
    recommendedJobs: [
      {
        title: {
          type: String,
          default: "",
        },

        match: {
          type: Number,
          default: 0,
        },

        salary: {
          type: String,
          default: "",
        },

        experience: {
          type: String,
          default: "",
        },

        requiredSkills: {
          type: [String],
          default: [],
        },

        missingSkills: {
          type: [String],
          default: [],
        },

        companies: {
          type: [String],
          default: [],
        },

        reason: {
          type: String,
          default: "",
        },
      },
    ],

    careerRoadmap: {
      type: [String],
      default: [],
    },

    overallAdvice: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

// ===============================================
// Resume Schema
// ===============================================

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    fileName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },

    parsedResume: {
      type: parsedResumeSchema,
      default: () => ({}),
    },

    ats: {
      type: atsSchema,
      default: () => ({}),
    },

    aiAnalysis: {
      type: aiAnalysisSchema,
      default: () => ({}),
    },

    // ==========================================
    // NEW - Job Recommendations
    // ==========================================

    jobRecommendations: {
      type: jobRecommendationSchema,
      default: () => ({}),
    },

    processingTime: {
      type: Number,
      default: 0,
    },

    version: {
      type: Number,
      default: 3,
    },

    status: {
      type: String,
      enum: [
        "uploaded",
        "processing",
        "completed",
        "failed",
      ],
      default: "uploaded",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ===============================================
// Indexes
// ===============================================

resumeSchema.index({
  user: 1,
  createdAt: -1,
});

resumeSchema.index({
  "ats.overallScore": -1,
});

resumeSchema.index({
  status: 1,
});

resumeSchema.index({
  originalName: "text",
});

// ===============================================

const Resume = mongoose.model(
  "Resume",
  resumeSchema
);

export default Resume;