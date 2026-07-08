const SECTION_WEIGHTS = {
  contact: 10,
  summary: 10,
  skills: 20,
  experience: 25,
  education: 15,
  projects: 10,
  certifications: 5,
  formatting: 5,
};

const ACTION_VERBS = [
  "developed",
  "built",
  "designed",
  "implemented",
  "created",
  "optimized",
  "managed",
  "led",
  "improved",
  "deployed",
  "integrated",
  "automated",
  "engineered",
  "achieved",
  "delivered",
  "reduced",
  "increased",
  "designed",
  "maintained",
  "configured",
  "tested",
  "analyzed",
  "collaborated",
];

const countActionVerbs = (text = "") => {
  const lower = text.toLowerCase();

  return ACTION_VERBS.reduce((count, verb) => {
    return count + (lower.includes(verb) ? 1 : 0);
  }, 0);
};

const calculateContactScore = (resume) => {
  let score = 0;

  if (resume.name) score += 1;
  if (resume.email) score += 3;
  if (resume.phone) score += 2;
  if (resume.linkedin) score += 2;
  if (resume.github || resume.portfolio) score += 2;

  return Math.min(score, SECTION_WEIGHTS.contact);
};

const calculateSummaryScore = (resume) => {
  if (!resume.summary) return 0;

  const words = resume.summary.split(/\s+/).length;

  if (words >= 40) return 10;
  if (words >= 25) return 8;
  if (words >= 15) return 6;

  return 3;
};

const calculateSkillScore = (resume) => {
  const total = resume.skills?.length || 0;

  if (total >= 18) return 20;
  if (total >= 15) return 18;
  if (total >= 12) return 16;
  if (total >= 10) return 14;
  if (total >= 8) return 12;
  if (total >= 6) return 10;
  if (total >= 4) return 7;

  return 4;
};

const calculateExperienceScore = (resume) => {
  const total = resume.experience?.length || 0;

  if (total >= 6) return 25;
  if (total >= 4) return 22;
  if (total >= 3) return 18;
  if (total >= 2) return 14;
  if (total >= 1) return 10;

  return 0;
};

const calculateEducationScore = (resume) => {
  const total = resume.education?.length || 0;

  if (total >= 3) return 15;
  if (total >= 2) return 13;
  if (total >= 1) return 10;

  return 0;
};

const calculateProjectScore = (resume) => {
  const total = resume.projects?.length || 0;

  if (total >= 5) return 10;
  if (total >= 3) return 9;
  if (total >= 2) return 8;
  if (total >= 1) return 5;

  return 0;
};

const calculateCertificationScore = (resume) => {
  const total = resume.certifications?.length || 0;

  if (total >= 5) return 5;
  if (total >= 3) return 4;
  if (total >= 1) return 3;

  return 0;
};

const calculateFormattingScore = (resume) => {
  let score = 0;

  const text = resume.rawText || "";

  const words = text.split(/\s+/).length;

  if (words >= 300 && words <= 800)
    score += 2;

  if (countActionVerbs(text) >= 6)
    score += 2;

  if (
    resume.summary &&
    resume.skills?.length &&
    resume.education?.length
  )
    score += 1;

  return Math.min(score, 5);
};

export const calculateATSScore = (resume) => {
  const breakdown = {
    contact: calculateContactScore(resume),

    summary: calculateSummaryScore(resume),

    skills: calculateSkillScore(resume),

    experience: calculateExperienceScore(resume),

    education: calculateEducationScore(resume),

    projects: calculateProjectScore(resume),

    certifications:
      calculateCertificationScore(resume),

    formatting: calculateFormattingScore(resume),
  };

  const overallScore = Math.min(
    100,
    Object.values(breakdown).reduce(
      (sum, value) => sum + value,
      0
    )
  );

  const suggestions = [];

  if (!resume.email)
    suggestions.push(
      "Add a professional email address."
    );

  if (!resume.phone)
    suggestions.push(
      "Include your phone number."
    );

  if (!resume.linkedin)
    suggestions.push(
      "Add your LinkedIn profile."
    );

  if (!resume.github)
    suggestions.push(
      "Add your GitHub profile."
    );

  if (!resume.portfolio)
    suggestions.push(
      "Include your portfolio website."
    );

  if ((resume.skills?.length || 0) < 10)
    suggestions.push(
      "Increase the number of technical skills."
    );

  if ((resume.projects?.length || 0) < 2)
    suggestions.push(
      "Include at least two industry-level projects."
    );

  if ((resume.experience?.length || 0) === 0)
    suggestions.push(
      "Mention internships or work experience."
    );

  if ((resume.certifications?.length || 0) === 0)
    suggestions.push(
      "Earn and include relevant certifications."
    );

  if (!resume.summary)
    suggestions.push(
      "Add a professional summary."
    );

  if (
    countActionVerbs(resume.rawText || "") < 6
  )
    suggestions.push(
      "Use stronger action verbs such as Developed, Engineered, Implemented and Optimized."
    );

  return {
    overallScore,

    breakdown,

    matchedSkills: resume.skills || [],

    missingSkills: [],

    suggestions,
  };
};