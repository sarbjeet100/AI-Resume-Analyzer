import API from "./api";

// =========================================
// Get Job Recommendations
// =========================================

export const getJobRecommendations = async (
  resumeId
) => {
  const response = await API.get(
    `/job-recommendation/${resumeId}`
  );

  return response.data;
};