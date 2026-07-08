import API from "./api";

// =======================================
// Register User
// =======================================

export const registerUser = async (userData) => {
  const { data } = await API.post(
    "/auth/register",
    userData
  );

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  if (data.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );
  }

  return data;
};

// =======================================
// Login User
// =======================================

export const loginUser = async (credentials) => {
  const { data } = await API.post(
    "/auth/login",
    credentials
  );

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  if (data.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );
  }

  return data;
};

// =======================================
// Get Current User
// =======================================

export const getCurrentUser = async () => {
  const { data } = await API.get("/auth/me");

  return data;
};

// =======================================
// Logout
// =======================================

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// =======================================
// Authentication
// =======================================

export const isAuthenticated = () => {
  return Boolean(
    localStorage.getItem("token")
  );
};

// =======================================
// Get Stored User
// =======================================

export const getStoredUser = () => {
  try {
    const user =
      localStorage.getItem("user");

    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

// =======================================
// Get Token
// =======================================

export const getToken = () => {
  return localStorage.getItem("token");
};