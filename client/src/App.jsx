import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import MainLayout from "./layouts/MainLayout/MainLayout";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Upload from "./pages/Upload/Upload";
import Analysis from "./pages/Analysis/Analysis";
import History from "./pages/History/History";
import Profile from "./pages/Profile/Profile";
import JobRecommendation from "./pages/JobRecommendation/JobRecommendation";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public Routes */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected Routes */}

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/upload"
              element={<Upload />}
            />

            <Route
              path="/history"
              element={<History />}
            />

            <Route
              path="/analysis"
              element={<Analysis />}
            />

            <Route
              path="/analysis/:id"
              element={<Analysis />}
            />

            <Route
              path="/job-recommendation"
              element={<JobRecommendation />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>

          {/* 404 */}

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;