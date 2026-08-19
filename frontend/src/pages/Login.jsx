import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  LockPersonRounded,
  Visibility,
  VisibilityOff,
  SecurityRounded,
  GroupsRounded,
  AnalyticsRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";
import "../styles/login.css";
import { toast } from "react-toastify";
import client from "../api/client";
export default function Login() {
  const { user, login } = useAuth();
  let navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const [resetForm, setResetForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [resetLoading, setResetLoading] = useState(false);

  // // If user is already logged in,
  // // redirect them to dashboard.
  // if (user) {
  //   return <Navigate to="/dashboard" replace />;
  // }

  // Handles email and password changes.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handles login submission.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password, rememberMe);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to sign in. Please check your credentials.",
      );
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async () => {
    if (
      !resetForm.email ||
      !resetForm.newPassword ||
      !resetForm.confirmPassword
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    if (resetForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setResetLoading(true);

    try {
      const { data } = await client.post("/auth/reset-password", {
        email: resetForm.email,
        newPassword: resetForm.newPassword,
      });

      toast.success(data.message);

      setForgotOpen(false);

      setResetForm({
        email: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.log(err, "err");
      toast.error(err.response?.data?.message || "Unable to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  // Toggle password visibility.
  const handleTogglePassword = () => {
    setShowPassword((previous) => !previous);
  };
  /**
   * Reusable feature item.
   */
  function Feature({ icon, label }) {
    return (
      <Box className="feature-item">
        {icon}

        <Typography className="feature-label">{label}</Typography>
      </Box>
    );
  }
  return (
    <Box className="login-page">
      {/* Background overlay */}
      <Box className="login-overlay" />

      <Container className="login-container" maxWidth="md">
        <Card className="login-card" elevation={0}>
          {/* ================================
              LEFT SIDE
          ================================= */}

          <Box className="login-left">
            {/* Decorative glow */}
            <Box className="login-left-glow" />

            {/* Brand */}
            <Box className="login-brand">
              <Box className="login-brand-icon">
                <LockPersonRounded />
              </Box>

              <Typography className="login-brand-title">
                Mini Case Tracker
              </Typography>
            </Box>

            {/* Hero content */}
            <Box className="login-hero">
              <Box className="login-hero-line" />

              <Typography className="login-hero-title">
                Smart Case
                <br />
                Management
              </Typography>

              <Typography className="login-hero-description">
                Track, manage and close client cases efficiently with secure
                role-based workflows.
              </Typography>
            </Box>

            {/* Feature card */}
            <Box className="login-features">
              <Feature
                icon={<SecurityRounded fontSize="small" />}
                label="Secure"
              />

              <Feature
                icon={<GroupsRounded fontSize="small" />}
                label="Role Based"
              />

              <Feature
                icon={<AnalyticsRounded fontSize="small" />}
                label="Analytics"
              />
            </Box>
          </Box>

          {/* ================================
              RIGHT SIDE
          ================================= */}

          <CardContent className="login-right">
            {/* Login header */}
            <Box className="login-header">
              <Box className="login-header-icon">
                <LockPersonRounded />
              </Box>

              <Typography className="login-title">Welcome Back 👋</Typography>

              <Typography className="login-subtitle">
                Sign in to your account
              </Typography>
            </Box>

            {/* Error message */}
            {error && (
              <Alert className="login-alert" severity="error">
                {error}
              </Alert>
            )}

            {/* Login form */}
            <Stack
              className="login-form"
              component="form"
              onSubmit={handleSubmit}
            >
              {/* Email */}
              <TextField
                className="login-field"
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="email"
                placeholder="Enter your email"
              />

              {/* Password */}
              <TextField
                className="login-field"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="current-password"
                placeholder="Enter your password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Remember me */}
              <Box className="login-options">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      size="small"
                    />
                  }
                  label={
                    <Typography className="remember-label">
                      Remember me
                    </Typography>
                  }
                />

                <Typography
                  className="forgot-password"
                  onClick={() => setForgotOpen(true)}
                >
                  Forgot password?
                </Typography>
              </Box>

              {/* Sign in */}
              <Button
                className="login-button"
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                endIcon={!loading && <ArrowForwardRounded />}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Stack>

            {/* Demo account information */}
            <Box className="demo-account">
              <Typography className="demo-account-text">
                Demo accounts: <strong>Manager</strong> / <strong>Agent</strong>
              </Typography>
            </Box>
            <Dialog
              open={forgotOpen}
              onClose={() => setForgotOpen(false)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Reset Password</DialogTitle>

              <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={resetForm.email}
                    onChange={(e) =>
                      setResetForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />

                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    value={resetForm.newPassword}
                    onChange={(e) =>
                      setResetForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                  />

                  <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    value={resetForm.confirmPassword}
                    onChange={(e) =>
                      setResetForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                </Stack>
              </DialogContent>

              <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                  onClick={() => setForgotOpen(false)}
                  disabled={resetLoading}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                >
                  {resetLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </DialogActions>
            </Dialog>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
