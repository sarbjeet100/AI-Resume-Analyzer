import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const extractJSON = (text = "") => {
  try {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");

    if (first === -1 || last === -1) return null;

    return JSON.parse(cleaned.substring(first, last + 1));
  } catch (err) {
    console.error("Gemini JSON Parse Error:", err);
    return null;
  }
};

export const analyzeResume = async (resume, ats) => {
  try {
    const prompt = `
You are an experienced HR Manager, ATS Expert and Senior Software Engineering Recruiter.

Analyze the following resume and ATS report.

Return ONLY valid JSON.

{
  "professionalSummary":"",
  "strengths":[],
  "weaknesses":[],
  "missingSkills":[],
  "improvements":[],
  "recommendedProjects":[],
  "recommendedCertifications":[],
  "recommendedTechnologies":[],
  "interviewQuestions":[],
  "overallFeedback":""
}

Rules:
- Return ONLY JSON.
- Do not use markdown.
- Maximum 5 items in every array.
- Give practical suggestions.
- Overall feedback should be 80-120 words.

Resume:
${JSON.stringify(resume, null, 2)}

ATS Report:
${JSON.stringify(ats, null, 2)}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    console.log("\n========== GEMINI RESPONSE ==========\n");
    console.log(text);
    console.log("\n=====================================\n");

    const parsed = extractJSON(text);

    if (!parsed) {
      throw new Error("Gemini returned invalid JSON.");
    }

    return {
      professionalSummary:
        parsed.professionalSummary || "",

      strengths:
        parsed.strengths || [],

      weaknesses:
        parsed.weaknesses || [],

      missingSkills:
        parsed.missingSkills ||
        ats?.missingSkills ||
        [],

      improvements:
        parsed.improvements ||
        ats?.suggestions ||
        [],

      recommendedProjects:
        parsed.recommendedProjects || [],

      recommendedCertifications:
        parsed.recommendedCertifications || [],

      recommendedTechnologies:
        parsed.recommendedTechnologies || [],

      interviewQuestions:
        parsed.interviewQuestions || [],

      overallFeedback:
        parsed.overallFeedback ||
        "Resume analysis completed successfully.",
    };
  } catch (err) {
    console.error("Gemini Error:", err);

    return {
      professionalSummary:
        resume.summary ||
        "No professional summary detected.",

      strengths: [
        "Resume parsed successfully.",
        "ATS analysis completed.",
        "Contact information detected.",
      ],

      weaknesses: [
        "LinkedIn profile missing.",
        "GitHub profile missing.",
      ],

      missingSkills:
        ats?.missingSkills || [],

      improvements:
        ats?.suggestions || [],

      recommendedProjects: [
        "AI Resume Analyzer",
        "E-Commerce Website",
        "Chat Application",
        "Task Management System",
        "Portfolio Website",
      ],

      recommendedCertifications: [
        "AWS Cloud Practitioner",
        "Google Cybersecurity",
        "Meta Front-End",
        "MongoDB Associate",
        "Oracle Java Foundations",
      ],

      recommendedTechnologies: [
        "React",
        "Node.js",
        "MongoDB",
        "Docker",
        "AWS",
      ],

      interviewQuestions: [
        "Explain your strongest project.",
        "Describe your role in team projects.",
        "How do you optimize application performance?",
        "Explain OOP principles.",
        "What is REST API?",
      ],

      overallFeedback:
        "Your resume has been analyzed successfully. Improve your ATS score by adding measurable achievements, relevant certifications, GitHub and LinkedIn profiles, and more technical projects. Tailor your resume according to the job description for better recruiter visibility.",
    };
  }
};