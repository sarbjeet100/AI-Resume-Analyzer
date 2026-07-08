import { TECH_SKILLS } from "../utils/regex.js";

/**
 * Normalize text
 */
const normalize = (text = "") => {
  return text
    .toLowerCase()
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Extract technical skills from resume
 */
export const extractSkills = (text = "") => {
  const resume = normalize(text);

  const matchedSkills = [];

  for (const skill of TECH_SKILLS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(`\\b${escaped}\\b`, "i");

    if (regex.test(resume)) {
      matchedSkills.push(skill);
    }
  }

  return [...new Set(matchedSkills)].sort();
};

/**
 * Categorize skills
 */
export const categorizeSkills = (skills = []) => {
  const categories = {
    languages: [],
    frontend: [],
    backend: [],
    database: [],
    cloud: [],
    ai: [],
    tools: [],
    core: [],
    others: [],
  };

  const map = {
    // Languages
    c: "languages",
    "c++": "languages",
    java: "languages",
    python: "languages",
    javascript: "languages",
    typescript: "languages",
    php: "languages",
    go: "languages",
    rust: "languages",
    kotlin: "languages",
    swift: "languages",

    // Frontend
    html: "frontend",
    css: "frontend",
    react: "frontend",
    "next.js": "frontend",
    angular: "frontend",
    vue: "frontend",
    tailwind: "frontend",
    bootstrap: "frontend",
    vite: "frontend",

    // Backend
    node: "backend",
    express: "backend",
    nestjs: "backend",
    spring: "backend",
    django: "backend",
    flask: "backend",

    // Database
    mongodb: "database",
    mysql: "database",
    postgresql: "database",
    sqlite: "database",
    firebase: "database",
    redis: "database",

    // Cloud
    aws: "cloud",
    azure: "cloud",
    gcp: "cloud",
    docker: "cloud",
    kubernetes: "cloud",

    // AI
    openai: "ai",
    gemini: "ai",
    langchain: "ai",
    huggingface: "ai",
    tensorflow: "ai",
    pytorch: "ai",

    // Tools
    git: "tools",
    github: "tools",
    gitlab: "tools",
    postman: "tools",
    figma: "tools",
    linux: "tools",

    // Core CS
    "data structures": "core",
    algorithms: "core",
    oop: "core",
    dbms: "core",
    "operating systems": "core",
    "computer networks": "core",
  };

  for (const skill of skills) {
    const category = map[skill] || "others";
    categories[category].push(skill);
  }

  return categories;
};

/**
 * Skill statistics
 */
export const calculateSkillStats = (skills = []) => {
  const categorized = categorizeSkills(skills);

  return {
    totalSkills: skills.length,
    categorized,
    categoryCount: {
      languages: categorized.languages.length,
      frontend: categorized.frontend.length,
      backend: categorized.backend.length,
      database: categorized.database.length,
      cloud: categorized.cloud.length,
      ai: categorized.ai.length,
      tools: categorized.tools.length,
      core: categorized.core.length,
      others: categorized.others.length,
    },
  };
};