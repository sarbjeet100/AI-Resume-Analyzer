import API from "./api";

// =====================================
// Dashboard Analytics
// =====================================

export const getDashboardData = async () => {
  const response = await API.get("/dashboard");

  return response.data;
};

// =====================================
// Dashboard Stats
// =====================================

export const getDashboardStats = async () => {
  const response = await API.get("/dashboard");

  return response.data.data;
};

// =====================================
// Recent Uploads
// =====================================

export const getRecentUploads = async () => {
  const response = await API.get("/dashboard");

  return response.data.data.recentUploads;
};

// =====================================
// Best Resume
// =====================================

export const getBestResume = async () => {
  const response = await API.get("/dashboard");

  return response.data.data.bestResume;
};

// =====================================
// ATS Statistics
// =====================================

export const getATSStatistics = async () => {
  const response = await API.get("/dashboard");

  return {
    averageATS: response.data.data.averageATS,
    highestATS: response.data.data.highestATS,
    lowestATS: response.data.data.lowestATS,
  };
};