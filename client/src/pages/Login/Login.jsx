import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";

import {
  Lock,
  Email,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";

import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      return alert(
        "Please fill all fields."
      );
    }

    try {
      setLoading(true);

      await login(formData);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Paper
        elevation={8}
        className={styles.card}
      >
        <div className={styles.header}>
          <LoginIcon className={styles.icon} />

          <Typography
            variant="h4"
            fontWeight={700}
          >
            Welcome Back
          </Typography>

          <Typography color="text.secondary">
            Login to AI Resume Analyzer
          </Typography>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            type="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                color="inherit"
              />
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <Typography
          align="center"
          sx={{ mt: 3 }}
        >
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default Login;