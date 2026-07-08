import {
  EMAIL_REGEX,
  PHONE_REGEX,
  LINKEDIN_REGEX,
  GITHUB_REGEX,
  WEBSITE_REGEX,
  TECH_SKILLS,
} from "../utils/regex.js";

const normalize = (text = "") => {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\u00A0/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const getFirstMatch = (regex, text) => {
  const matches = text.match(regex);
  return matches ? matches[0].trim() : "";
};

const extractName = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines.slice(0, 12)) {
    if (
      line.includes("@") ||
      line.includes("http") ||
      /\d/.test(line) ||
      line.length < 3 ||
      line.length > 40
    ) {
      continue;
    }

    const words = line.split(/\s+/);

    if (words.length >= 2 && words.length <= 4) {
      return line;
    }
  }

  return "";
};

const extractSkills = (text) => {
  const lower = text.toLowerCase();

  return [
    ...new Set(
      TECH_SKILLS.filter((skill) =>
        lower.includes(skill.toLowerCase())
      )
    ),
  ].sort();
};

const extractSummary = (text) => {
  const upper = text.toUpperCase();

  const headings = [
    "TECHNICAL",
    "EDUCATION",
    "SKILLS",
    "PROJECT",
    "EXPERIENCE",
    "CERTIFICATION",
    "ACHIEVEMENT",
    "LANGUAGE",
    "INTEREST",
    "HOBBIES",
  ];

  let start = -1;

  if (upper.includes("PROFESSIONAL SUMMARY"))
    start = upper.indexOf("PROFESSIONAL SUMMARY");
  else if (upper.includes("SUMMARY"))
    start = upper.indexOf("SUMMARY");
  else if (upper.includes("OBJECTIVE"))
    start = upper.indexOf("OBJECTIVE");

  if (start === -1) return "";

  let summary = text.substring(start);

  let end = summary.length;

  headings.forEach((heading) => {
    const index = summary.toUpperCase().indexOf(heading);

    if (index > 20 && index < end) {
      end = index;
    }
  });

  summary = summary.substring(0, end);

  summary = summary
    .replace(/PROFESSIONAL SUMMARY/i, "")
    .replace(/SUMMARY/i, "")
    .replace(/OBJECTIVE/i, "")
    .trim();

  return summary;
};

const extractBlock = (text, headers) => {
  const upper = text.toUpperCase();

  let start = -1;

  for (const header of headers) {
    const index = upper.indexOf(header.toUpperCase());

    if (index !== -1) {
      start = index;
      break;
    }
  }

  if (start === -1) return [];

  const allHeaders = [
    "SUMMARY",
    "OBJECTIVE",
    "TECHNICAL",
    "SKILLS",
    "PROJECT",
    "EXPERIENCE",
    "EDUCATION",
    "CERTIFICATION",
    "ACHIEVEMENT",
    "LANGUAGE",
    "INTEREST",
    "HOBBIES",
    "PERSONAL",
    "PROFILE",
  ];

  let block = text.substring(start);

  let end = block.length;

  allHeaders.forEach((header) => {
    const idx = block
      .toUpperCase()
      .indexOf(header);

    if (idx > 20 && idx < end) {
      end = idx;
    }
  });

  block = block.substring(0, end);

  return block
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) =>
        line &&
        line.length > 2 &&
        !headers.some((h) =>
          line.toUpperCase().includes(h.toUpperCase())
        )
    );
};

const extractLanguages = (text) => {
  const languages = [
    "English",
    "Hindi",
    "Punjabi",
    "French",
    "German",
    "Spanish",
    "Japanese",
    "Chinese",
  ];

  const lower = text.toLowerCase();

  return languages.filter((lang) =>
    lower.includes(lang.toLowerCase())
  );
};

export const parseResume = (rawText = "") => {
  const text = normalize(rawText);

  return {
    name: extractName(text),

    email: getFirstMatch(
      EMAIL_REGEX,
      text
    ),

    phone: getFirstMatch(
      PHONE_REGEX,
      text
    ),

    linkedin: getFirstMatch(
      LINKEDIN_REGEX,
      text
    ),

    github: getFirstMatch(
      GITHUB_REGEX,
      text
    ),

    portfolio: getFirstMatch(
      WEBSITE_REGEX,
      text
    ),

    summary: extractSummary(text),

    skills: extractSkills(text),

    education: extractBlock(text, [
      "EDUCATION",
    ]),

    experience: extractBlock(text, [
      "EXPERIENCE",
      "INTERNSHIP",
      "WORK EXPERIENCE",
    ]),

    projects: extractBlock(text, [
      "PROJECT",
      "PROJECTS",
    ]),

    certifications: extractBlock(text, [
      "CERTIFICATION",
      "CERTIFICATIONS",
      "COURSES",
    ]),

    achievements: extractBlock(text, [
      "ACHIEVEMENT",
      "ACHIEVEMENTS",
    ]),

    internships: extractBlock(text, [
      "INTERNSHIP",
      "INTERNSHIPS",
    ]),

    languages: extractLanguages(text),

    rawText: text,
  };
};