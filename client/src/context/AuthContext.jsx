import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  getStoredUser,
} from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());

  const [loading, setLoading] = useState(true);

  const [authenticated, setAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthenticated(false);
        setUser(null);
        return;
      }

      const response = await getCurrentUser();

      const currentUser =
        response.user ||
        response.data ||
        response;

      setUser(currentUser);

      setAuthenticated(true);

      localStorage.setItem(
        "user",
        JSON.stringify(currentUser)
      );
    } catch (error) {
      console.error(error);

      logoutUser();

      localStorage.removeItem("user");

      setAuthenticated(false);

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    const currentUser =
      response.user ||
      response.data?.user ||
      response.data;

    setUser(currentUser);

    setAuthenticated(true);

    localStorage.setItem(
      "user",
      JSON.stringify(currentUser)
    );

    return response;
  };

  const register = async (userData) => {
    const response = await registerUser(userData);

    const currentUser =
      response.user ||
      response.data?.user ||
      response.data;

    setUser(currentUser);

    setAuthenticated(true);

    localStorage.setItem(
      "user",
      JSON.stringify(currentUser)
    );

    return response;
  };

  const logout = () => {
    logoutUser();

    localStorage.removeItem("user");

    setUser(null);

    setAuthenticated(false);
  };

  const refreshUser = async () => {
    await initialize();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);

export default AuthContext;