// ================================
// Common Regular Expressions
// AI Resume Analyzer
// ================================

// Email
export const EMAIL_REGEX =
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

// Phone (supports international + India)
export const PHONE_REGEX =
  /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4,6}/g;

// LinkedIn
export const LINKEDIN_REGEX =
  /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9-_%]+/gi;

// GitHub
export const GITHUB_REGEX =
  /(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9-_%]+/gi;

// Portfolio Website
export const WEBSITE_REGEX =
  /(?:https?:\/\/)?(?:www\.)?[A-Za-z0-9-]+\.[A-Za-z]{2,}(?:\/[^\s]*)?/gi;

// ================================
// Resume Sections
// ================================

export const SECTION_HEADERS = [
  "summary",
  "objective",
  "profile",

  "education",

  "experience",
  "work experience",
  "employment",

  "projects",

  "skills",
  "technical skills",
  "core skills",

  "certifications",
  "certificates",

  "achievements",

  "languages",

  "internships",

  "interests",

  "hobbies",

  "publications",
];

// ================================
// Technical Skills Database
// ================================

export const TECH_SKILLS = [
  // Languages
  "c",
  "c++",
  "java",
  "python",
  "javascript",
  "typescript",
  "go",
  "rust",
  "php",
  "kotlin",
  "swift",

  // Frontend
  "html",
  "css",
  "sass",
  "tailwind",
  "bootstrap",
  "react",
  "next.js",
  "redux",
  "vite",
  "angular",
  "vue",

  // Backend
  "node",
  "express",
  "nestjs",
  "spring",
  "django",
  "flask",

  // Database
  "mongodb",
  "mysql",
  "postgresql",
  "sqlite",
  "firebase",
  "redis",

  // Cloud
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",

  // Tools
  "git",
  "github",
  "gitlab",
  "postman",
  "figma",
  "linux",

  // AI
  "openai",
  "gemini",
  "langchain",
  "huggingface",
  "tensorflow",
  "pytorch",

  // DSA
  "data structures",
  "algorithms",
  "oop",
  "operating systems",
  "computer networks",
  "dbms",
];

// ================================
// Action Verbs
// ================================

export const ACTION_VERBS = [
  "developed",
  "built",
  "created",
  "implemented",
  "designed",
  "optimized",
  "improved",
  "managed",
  "led",
  "deployed",
  "integrated",
  "automated",
  "achieved",
  "reduced",
  "increased",
  "engineered",
  "delivered",
  "configured",
  "maintained",
  "analyzed",
];

// ================================
// Degree Keywords
// ================================

export const EDUCATION_KEYWORDS = [
  "b.tech",
  "btech",
  "b.e",
  "be",
  "bca",
  "mca",
  "m.tech",
  "mtech",
  "b.sc",
  "msc",
  "bachelor",
  "master",
  "phd",
  "diploma",
];

// ================================
// Experience Keywords
// ================================

export const EXPERIENCE_KEYWORDS = [
  "intern",
  "internship",
  "software engineer",
  "developer",
  "frontend",
  "backend",
  "full stack",
  "web developer",
  "experience",
];

// ================================
// Project Keywords
// ================================

export const PROJECT_KEYWORDS = [
  "project",
  "github",
  "application",
  "website",
  "system",
  "dashboard",
  "api",
];