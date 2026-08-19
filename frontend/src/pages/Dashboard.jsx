import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  AddCircleOutlineRounded,
  AssignmentRounded,
  CheckCircleOutlineRounded,
  ErrorOutlineRounded,
  HourglassEmptyRounded,
  ListAltRounded,
  PendingActionsRounded,
  PlayCircleOutlineRounded,
  SendRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

import "../styles/Dashboard.css";

const statuses = [
  {
    key: "New",
    label: "New",
    icon: <AddCircleOutlineRounded />,
  },
  {
    key: "Assigned",
    label: "Assigned",
    icon: <AssignmentRounded />,
  },
  {
    key: "In Progress",
    label: "In Progress",
    icon: <PlayCircleOutlineRounded />,
  },
  {
    key: "Submitted",
    label: "Submitted",
    icon: <SendRounded />,
  },
  {
    key: "Cleared",
    label: "Cleared",
    icon: <CheckCircleOutlineRounded />,
  },
  {
    key: "Discrepant",
    label: "Discrepant",
    icon: <ErrorOutlineRounded />,
  },
];

const statusColors = {
  New: "info",
  Assigned: "primary",
  "In Progress": "warning",
  Submitted: "secondary",
  Cleared: "success",
  Discrepant: "error",
};

const statusIcons = {
  New: <AddCircleOutlineRounded />,
  Assigned: <AssignmentRounded />,
  "In Progress": <PlayCircleOutlineRounded />,
  Submitted: <SendRounded />,
  Cleared: <CheckCircleOutlineRounded />,
  Discrepant: <ErrorOutlineRounded />,
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalCases: 0,
    statuses: {
      New: 0,
      Assigned: 0,
      "In Progress": 0,
      Submitted: 0,
      Cleared: 0,
      Discrepant: 0,
    },
  });

  const [recentCases, setRecentCases] = useState([]);

  const [loading, setLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Dashboard summary
       *
       * Manager:
       *   -> all cases
       *
       * Agent:
       *   -> only assigned cases
       *
       * Backend decides this using req.user.role.
       */
      const { data } = await client.get(
        "/dashboard/overview"
      );

      setStats({
        totalCases: data?.totalCases ?? 0,

        statuses: {
          New: data?.statuses?.New ?? 0,
          Assigned: data?.statuses?.Assigned ?? 0,
          "In Progress":
            data?.statuses?.["In Progress"] ?? 0,
          Submitted: data?.statuses?.Submitted ?? 0,
          Cleared: data?.statuses?.Cleared ?? 0,
          Discrepant: data?.statuses?.Discrepant ?? 0,
        },
      });
    } catch (error) {
      console.error(
        "Failed to load dashboard stats:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentCases();
  }, []);

  const loadRecentCases = async () => {
    try {
      setRecentLoading(true);

      /*
       * We are reusing the existing cases API
       * for the Recent Cases section.
       *
       * The backend should already apply the correct
       * role-based filtering.
       */
      const { data } = await client.get(
        "/cases?limit=5&page=1"
      );

      setRecentCases(data?.items || []);
    } catch (error) {
      console.error(
        "Failed to load recent cases:",
        error
      );

      setRecentCases([]);
    } finally {
      setRecentLoading(false);
    }
  };

  const handleStatusClick = (status) => {
    navigate(
      `/cases?status=${encodeURIComponent(status)}`
    );
  };

  const handleCaseClick = (caseId) => {
    navigate(`/cases/${caseId}`);
  };

  const totalCases = stats.totalCases;

  const getPercentage = (count) => {
    if (!totalCases) {
      return 0;
    }

    return Math.round((count / totalCases) * 100);
  };

  const statistics = [
    {
      label: "Total Cases",
      value: totalCases,
      icon: <ListAltRounded />,
    },
    {
      label: "New Cases",
      value: stats.statuses.New,
      icon: <AddCircleOutlineRounded />,
    },
    {
      label: "Assigned",
      value: stats.statuses.Assigned,
      icon: <AssignmentRounded />,
    },
    {
      label: "In Progress",
      value: stats.statuses["In Progress"],
      icon: <PlayCircleOutlineRounded />,
    },
    {
      label: "Submitted",
      value: stats.statuses.Submitted,
      icon: <SendRounded />,
    },
    {
      label: "Cleared",
      value: stats.statuses.Cleared,
      icon: <CheckCircleOutlineRounded />,
    },
  ];

  return (
    <Box className="dashboard-page">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name || "User"}`}
      />

      {/* =========================================
          ERROR
      ========================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* =========================================
          SUMMARY STATISTICS
      ========================================== */}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 180,
            gap: 2,
          }}
        >
          <CircularProgress size={30} />

          <Typography color="text.secondary">
            Loading dashboard...
          </Typography>
        </Box>
      ) : (
        <Grid
          container
          spacing={2}
        >
          {statistics.map((item) => (
            <Grid
              key={item.label}
              size={{
                xs: 12,
                sm: 6,
                md: 2,
              }}
            >
              <Card className="dashboard-stat-card">
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography className="dashboard-stat-label">
                      {item.label}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        opacity: 0.7,
                      }}
                    >
                      {item.icon}
                    </Box>
                  </Box>

                  <Typography className="dashboard-stat-value">
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* =========================================
          STATUS OVERVIEW
      ========================================== */}

      <Card className="dashboard-overview-card">
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700 }}
            >
              Status Overview
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Monitor the current distribution of cases
            </Typography>
          </Box>

          <Grid
            container
            spacing={2}
          >
            {statuses.map((status) => {
              const count =
                stats.statuses[status.key] ?? 0;

              const percentage =
                getPercentage(count);

              return (
                <Grid
                  key={status.key}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                >
                  <Card
                    variant="outlined"
                    onClick={() =>
                      handleStatusClick(status.key)
                    }
                    sx={{
                      cursor: "pointer",
                      height: "100%",
                      transition:
                        "all 0.2s ease",

                      "&:hover": {
                        transform:
                          "translateY(-2px)",
                        boxShadow:
                          "0 6px 18px rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    <CardContent>
                      {/* Header */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          {status.icon}

                          <Typography
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            {status.label}
                          </Typography>
                        </Box>

                        <Chip
                          label={count}
                          size="small"
                          color={
                            statusColors[
                              status.key
                            ]
                          }
                        />
                      </Box>

                      {/* Count */}
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        {count}
                      </Typography>

                      {/* Percentage */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {percentage}% of total
                        cases
                      </Typography>

                      {/* Progress */}
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 7,
                          borderRadius: 5,
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* =========================================
          RECENT CASES
      ========================================== */}

      <Card className="dashboard-recent-card">
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                Recent Cases
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Recently created or updated cases
              </Typography>
            </Box>

            <Chip
              label="View all"
              variant="outlined"
              clickable
              onClick={() => navigate("/cases")}
            />
          </Box>

          {recentLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "center",
                alignItems: "center",
                py: 5,
                gap: 2,
              }}
            >
              <CircularProgress size={25} />

              <Typography
                color="text.secondary"
              >
                Loading recent cases...
              </Typography>
            </Box>
          ) : recentCases.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 5,
              }}
            >
              <HourglassEmptyRounded
                sx={{
                  fontSize: 40,
                  opacity: 0.5,
                  mb: 1,
                }}
              />

              <Typography
                variant="body1"
                fontWeight={600}
              >
                No cases found
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                There are no recent cases
                to display.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1}>
              {recentCases.map((caseItem) => (
                <Card
                  key={caseItem._id}
                  variant="outlined"
                  onClick={() =>
                    handleCaseClick(
                      caseItem._id
                    )
                  }
                  sx={{
                    cursor: "pointer",
                    transition:
                      "all 0.2s ease",

                    "&:hover": {
                      backgroundColor:
                        "action.hover",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      "&:last-child": {
                        pb: 2,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "space-between",
                        gap: 2,
                      }}
                    >
                      {/* Case information */}
                      <Box
                        sx={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <Typography
                          fontWeight={700}
                          noWrap
                        >
                          {caseItem.caseId ||
                            "Case"}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {caseItem.clientName ||
                            "Unknown Client"}
                          {" • "}
                          {caseItem.subjectName ||
                            "Unknown Subject"}
                        </Typography>
                      </Box>

                      {/* Status */}
                      <Chip
                        icon={
                          statusIcons[
                            caseItem.status
                          ] || (
                            <PendingActionsRounded />
                          )
                        }
                        label={
                          caseItem.status ||
                          "Unknown"
                        }
                        size="small"
                        color={
                          statusColors[
                            caseItem.status
                          ] || "default"
                        }
                      />

                      {/* Due date */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          minWidth: 100,
                          textAlign: "right",
                        }}
                      >
                        {caseItem.dueDate
                          ? new Date(
                              caseItem.dueDate
                            ).toLocaleDateString()
                          : "—"}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}