const normalize = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[\n\r\t]/g, " ")
    .replace(/[^\w+#.\- ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const tokenize = (text = "") => {
  return [
    ...new Set(
      normalize(text)
        .split(" ")
        .filter((word) => word.length > 2)
    ),
  ];
};

const STOP_WORDS = [
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "your",
  "have",
  "will",
  "must",
  "should",
  "years",
  "year",
  "good",
  "team",
  "work",
  "using",
  "knowledge",
  "experience",
  "developer",
  "engineer",
  "looking",
  "ability",
  "strong",
  "excellent",
  "required",
  "preferred",
  "candidate",
  "role",
  "position",
  "job",
  "company",
  "responsible",
  "responsibilities",
];

const filterKeywords = (keywords) => {
  return [
    ...new Set(
      keywords.filter(
        (word) =>
          !STOP_WORDS.includes(word) &&
          word.length > 2 &&
          !/^\d+$/.test(word)
      )
    ),
  ];
};

const similarity = (a, b) => {
  a = a.toLowerCase();
  b = b.toLowerCase();

  if (a === b) return true;

  if (a.includes(b) || b.includes(a)) return true;

  return false;
};

const calculateSkillScore = (
  resumeSkills,
  jdKeywords
) => {
  const matched = [];
  const missing = [];

  jdKeywords.forEach((keyword) => {
    const found = resumeSkills.some((skill) =>
      similarity(skill, keyword)
    );

    if (found) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  const score =
    jdKeywords.length === 0
      ? 0
      : Math.round(
          (matched.length / jdKeywords.length) *
            100
        );

  return {
    score,
    matched,
    missing,
  };
};

export const matchJobDescription = (
  parsedResume,
  jobDescription
) => {
  const jdKeywords = filterKeywords(
    tokenize(jobDescription)
  );

  const resumeSkills = [
    ...(parsedResume.skills || []),

    ...(parsedResume.projects || []).join(" ").split(" "),

    ...(parsedResume.experience || [])
      .join(" ")
      .split(" "),

    ...(parsedResume.education || [])
      .join(" ")
      .split(" "),
  ].map((item) => item.toLowerCase());

  const result = calculateSkillScore(
    resumeSkills,
    jdKeywords
  );

  let score = result.score;

  if (
    parsedResume.projects &&
    parsedResume.projects.length > 0
  ) {
    score += 5;
  }

  if (
    parsedResume.experience &&
    parsedResume.experience.length > 0
  ) {
    score += 10;
  }

  if (
    parsedResume.education &&
    parsedResume.education.length > 0
  ) {
    score += 5;
  }

  score = Math.min(100, score);

  const recommendations = [];

  if (result.missing.length) {
    recommendations.push(
      `Add these keywords: ${result.missing
        .slice(0, 8)
        .join(", ")}`
    );
  }

  if (
    (parsedResume.projects || []).length < 2
  ) {
    recommendations.push(
      "Include at least two industry-level projects."
    );
  }

  if (
    (parsedResume.experience || []).length === 0
  ) {
    recommendations.push(
      "Add internship or work experience."
    );
  }

  if (
    (parsedResume.certifications || [])
      .length === 0
  ) {
    recommendations.push(
      "Include relevant certifications."
    );
  }

  if (
    (parsedResume.skills || []).length < 10
  ) {
    recommendations.push(
      "Increase the number of technical skills."
    );
  }

  return {
    score,

    matchedSkills: result.matched.sort(),

    missingSkills: result.missing.sort(),

    totalKeywords: jdKeywords.length,

    matchedKeywords: result.matched.length,

    recommendations,
  };
};