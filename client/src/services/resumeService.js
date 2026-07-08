import API from "./api";

// =====================================
// Upload Resume
// =====================================

export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await API.post(
    "/resume/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};

// =====================================
// Get My Resumes
// =====================================

export const getMyResumes = async () => {
  const response = await API.get("/resume");

  return response.data;
};

// =====================================
// Get Resume By Id
// =====================================

export const getResumeById = async (id) => {
  const response = await API.get(
    `/resume/${id}`
  );

  return response.data;
};

// =====================================
// Delete Resume
// =====================================

export const deleteResume = async (id) => {
  const response = await API.delete(
    `/resume/${id}`
  );

  return response.data;
};

// =====================================
// Match Resume With Job Description
// =====================================

export const matchResumeWithJob = async (
  resumeId,
  jobDescription
) => {
  const response = await API.post(
    "/job/match",
    {
      resumeId,
      jobDescription,
    }
  );

  return response.data;
};

// =====================================
// Get AI Job Recommendations
// =====================================

export const getJobRecommendations =
  async (resumeId) => {
    const response = await API.get(
      `/job-recommendation/${resumeId}`
    );

    return response.data;
  };