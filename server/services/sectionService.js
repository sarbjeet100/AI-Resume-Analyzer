import { SECTION_HEADERS } from "../utils/regex.js";

/**
 * Normalize resume text
 */
const normalizeText = (text = "") => {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

/**
 * Find section header
 */
const isSectionHeader = (line) => {
  const value = line.trim().toLowerCase();

  return SECTION_HEADERS.some((header) => {
    return (
      value === header ||
      value.startsWith(header + ":") ||
      value.startsWith(header + " ")
    );
  });
};

/**
 * Extract sections from resume
 */
export const extractSections = (text = "") => {
  const lines = normalizeText(text)
    .split("\n")
    .map((line) => line.trim());

  const sections = {};

  let currentSection = "general";

  sections[currentSection] = [];

  for (const line of lines) {
    if (!line) continue;

    if (isSectionHeader(line)) {
      currentSection = line
        .toLowerCase()
        .replace(":", "")
        .trim();

      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }

      continue;
    }

    sections[currentSection].push(line);
  }

  return sections;
};

/**
 * Resume completeness score
 */
export const calculateSectionScore = (sections) => {
  let score = 0;

  const requiredSections = [
    "summary",
    "skills",
    "education",
    "experience",
    "projects",
  ];

  for (const section of requiredSections) {
    if (
      sections[section] &&
      sections[section].length > 0
    ) {
      score += 20;
    }
  }

  return score;
}

/**
 * Missing Sections
 */
export const getMissingSections = (sections) => {
  const requiredSections = [
    "summary",
    "skills",
    "education",
    "experience",
    "projects",
  ];

  return requiredSections.filter((section) => {
    return (
      !sections[section] ||
      sections[section].length === 0
    );
  });
}

/**
 * Full Section Analysis
 */
export const analyzeSections = (text = "") => {
  const sections = extractSections(text);

  return {
    sections,

    sectionScore: calculateSectionScore(
      sections
    ),

    missingSections: getMissingSections(
      sections
    ),

    totalSections: Object.keys(sections).length,
  };
};