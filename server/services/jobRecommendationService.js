import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const extractJSON = (text) => {
  try {
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");

    if (first === -1 || last === -1) {
      return null;
    }

    return JSON.parse(
      text.substring(first, last + 1)
    );
  } catch {
    return null;
  }
};

export const generateJobRecommendations = async (
  parsedResume,
  ats
) => {
  try {
    const prompt = `
You are a Senior Technical Recruiter, Career Coach and Hiring Manager.

Analyze the candidate's resume and ATS report.

Recommend the TOP 6 software jobs that best match the candidate.

The jobs should be realistic according to:
- Skills
- Projects
- Experience
- ATS Score
- Education

For every job include:

- Job Title
- Match Percentage (0-100)
- Expected Salary (India)
- Required Experience
- Required Skills
- Missing Skills
- Top Companies Hiring
- Reason why this job suits the candidate

Also generate:

- 8 Step Career Roadmap
- Overall Career Advice

Return ONLY VALID JSON.

{
  "recommendedJobs":[
    {
      "title":"",
      "match":0,
      "salary":"",
      "experience":"",
      "requiredSkills":[],
      "missingSkills":[],
      "companies":[],
      "reason":""
    }
  ],

  "careerRoadmap":[
    ""
  ],

  "overallAdvice":""
}

Resume:

${JSON.stringify(parsedResume, null, 2)}

ATS:

${JSON.stringify(ats, null, 2)}
`;

    const result =
      await model.generateContent(prompt);

    const text = result.response.text();

    console.log(
      "\n========== JOB RECOMMENDATION ==========\n"
    );
    console.log(text);
    console.log(
      "\n========================================\n"
    );

    const parsed = extractJSON(text);

    if (!parsed) {
      throw new Error(
        "Invalid Gemini JSON Response"
      );
    }

    return parsed;
  } catch (error) {
    console.error(
      "Job Recommendation Error:",
      error.message
    );

    return {
      recommendedJobs: [
        {
          title: "Frontend Developer",

          match: 90,

          salary: "₹5 - ₹10 LPA",

          experience: "0-2 Years",

          requiredSkills: [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
          ],

          missingSkills: [
            "TypeScript",
            "Redux",
          ],

          companies: [
            "Infosys",
            "TCS",
            "Accenture",
            "Cognizant",
          ],

          reason:
            "Your frontend skills strongly match this role.",
        },

        {
          title: "Full Stack Developer",

          match: 86,

          salary: "₹6 - ₹12 LPA",

          experience: "1-3 Years",

          requiredSkills: [
            "React",
            "Node.js",
            "Express",
            "MongoDB",
          ],

          missingSkills: [
            "Docker",
            "AWS",
          ],

          companies: [
            "Zoho",
            "Razorpay",
            "PhonePe",
            "Paytm",
          ],

          reason:
            "You already possess most MERN stack skills.",
        },

        {
          title: "Backend Developer",

          match: 82,

          salary: "₹6 - ₹11 LPA",

          experience: "1-3 Years",

          requiredSkills: [
            "Node.js",
            "Express",
            "MongoDB",
          ],

          missingSkills: [
            "Redis",
            "Microservices",
          ],

          companies: [
            "Amazon",
            "Flipkart",
            "Swiggy",
          ],

          reason:
            "Backend development matches your project profile.",
        },
      ],

      careerRoadmap: [
        "Master Data Structures & Algorithms.",
        "Build 5 production-level MERN projects.",
        "Learn Docker and GitHub Actions.",
        "Learn AWS Cloud Fundamentals.",
        "Practice System Design.",
        "Improve Aptitude and Problem Solving.",
        "Solve 300+ LeetCode Questions.",
        "Start applying to Product Companies.",
      ],

      overallAdvice:
        "Your resume shows strong potential for Software Development roles. Focus on improving DSA, cloud technologies, Docker, system design, and build more production-grade projects to significantly increase interview opportunities.",
    };
  }
};