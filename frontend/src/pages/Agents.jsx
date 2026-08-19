import React, { useEffect, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";

import PageHeader from "../components/PageHeader";
import client from "../api/client";

import "../styles/Agents.css";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add Agent dialog
  const [openDialog, setOpenDialog] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Load Agents
  |--------------------------------------------------------------------------
  */

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      const { data } = await client.get(
        "/users/agents",
        {
          params,
        }
      );

      setAgents(data?.agents || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load agents"
      );

      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAgents();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  /*
  |--------------------------------------------------------------------------
  | Open Dialog
  |--------------------------------------------------------------------------
  */

  const handleOpenDialog = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setFormError("");
    setOpenDialog(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Close Dialog
  |--------------------------------------------------------------------------
  */

  const handleCloseDialog = () => {
    if (creating) return;

    setOpenDialog(false);
    setFormError("");
  };

  /*
  |--------------------------------------------------------------------------
  | Form Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Create Agent
  |--------------------------------------------------------------------------
  */

  const handleCreateAgent = async () => {
    setFormError("");

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      setFormError("Name is required");
      return;
    }

    if (!email) {
      setFormError("Email is required");
      return;
    }

    if (!form.password) {
      setFormError("Password is required");
      return;
    }

    if (form.password.length < 6) {
      setFormError(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setFormError(
        "Passwords do not match"
      );
      return;
    }

    try {
      setCreating(true);

      await client.post(
        "/users/agents",
        {
          name,
          email,
          password: form.password,
        }
      );

      // Close dialog
      setOpenDialog(false);

      // Clear form
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Reload agents
      await loadAgents();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Unable to create agent"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box className="agents-page">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <PageHeader
        title="Agents"
        subtitle="Manage agents and monitor assigned cases"
      />

      <Card className="agents-card">
        <CardContent>

          {/* =====================================================
              TOOLBAR
          ====================================================== */}

          <Box className="agents-toolbar">

            <TextField
              className="agents-search"
              fullWidth
              size="small"
              placeholder="Search agents by name or email"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Box className="agents-count">
              <PeopleRoundedIcon />

              <Typography>
                {agents.length}{" "}
                {agents.length === 1
                  ? "Agent"
                  : "Agents"}
              </Typography>
            </Box>

            {/* ADD AGENT BUTTON */}

            <Button
              variant="contained"
              startIcon={
                <PersonAddRoundedIcon />
              }
              onClick={handleOpenDialog}
              className="add-agent-button"
            >
              Add Agent
            </Button>

          </Box>


          {/* =====================================================
              ERROR
          ====================================================== */}

          {error && (
            <Alert
              severity="error"
              className="agents-alert"
            >
              {error}
            </Alert>
          )}


          {/* =====================================================
              LOADING
          ====================================================== */}

          {loading && (
            <Box className="agents-loading">

              <CircularProgress size={30} />

              <Typography color="text.secondary">
                Loading agents...
              </Typography>

            </Box>
          )}


          {/* =====================================================
              EMPTY
          ====================================================== */}

          {!loading &&
            !error &&
            agents.length === 0 && (

              <Box className="agents-empty">

                <PeopleRoundedIcon />

                <Typography variant="h6">
                  {search.trim()
                    ? "No agents found"
                    : "No agents available"}
                </Typography>

                <Typography color="text.secondary">
                  {search.trim()
                    ? "Try a different name or email."
                    : "Click Add Agent to create your first agent."}
                </Typography>

              </Box>
          )}


          {/* =====================================================
              AGENT LIST
          ====================================================== */}

          {!loading &&
            agents.length > 0 && (

              <Stack className="agents-list">

                {agents.map((agent) => (

                  <Card
                    key={agent._id}
                    className="agent-item"
                    variant="outlined"
                  >

                    <CardContent>

                      <Box className="agent-main">

                        {/* Avatar */}

                        <Avatar className="agent-avatar">

                          {agent.name
                            ?.charAt(0)
                            ?.toUpperCase() || "A"}

                        </Avatar>


                        {/* Agent Information */}

                        <Box className="agent-info">

                          <Typography className="agent-name">
                            {agent.name ||
                              "Unknown Agent"}
                          </Typography>

                          <Box className="agent-email">

                            <EmailRoundedIcon />

                            <Typography>
                              {agent.email ||
                                "No email"}
                            </Typography>

                          </Box>

                        </Box>


                        {/* Status */}

                        <Chip
                          label={
                            agent.isActive
                              ? "Active"
                              : "Inactive"
                          }
                          size="small"
                          color={
                            agent.isActive
                              ? "success"
                              : "default"
                          }
                          className="agent-status"
                        />


                        {/* Assigned Cases */}

                        <Box className="agent-cases">

                          <AssignmentRoundedIcon />

                          <Box>

                            <Typography className="agent-cases-value">
                              {agent.assignedCasesCount ??
                                0}
                            </Typography>

                            <Typography className="agent-cases-label">
                              Assigned Cases
                            </Typography>

                          </Box>

                        </Box>


                        {/* Joined */}

                        <Box className="agent-joined">

                          <Typography className="agent-joined-label">
                            Joined
                          </Typography>

                          <Typography>
                            {agent.createdAt
                              ? new Date(
                                  agent.createdAt
                                ).toLocaleDateString()
                              : "—"}
                          </Typography>

                        </Box>

                      </Box>

                    </CardContent>

                  </Card>

                ))}

              </Stack>

          )}

        </CardContent>
      </Card>


      {/* =====================================================
          ADD AGENT DIALOG
      ====================================================== */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>
          Add New Agent
        </DialogTitle>

        <DialogContent>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: 1,
            }}
          >

            {/* Form Error */}

            {formError && (
              <Alert severity="error">
                {formError}
              </Alert>
            )}


            {/* Name */}

            <TextField
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              disabled={creating}
            />


            {/* Email */}

            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              disabled={creating}
            />


            {/* Password */}

            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              disabled={creating}
              helperText="Minimum 6 characters"
            />


            {/* Confirm Password */}

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              disabled={creating}
            />

          </Box>

        </DialogContent>


        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >

          <Button
            onClick={handleCloseDialog}
            disabled={creating}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateAgent}
            disabled={creating}
          >

            {creating ? (
              <>
                <CircularProgress
                  size={20}
                  sx={{ mr: 1 }}
                />

                Creating...
              </>
            ) : (
              "Create Agent"
            )}

          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}