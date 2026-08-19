import React, { useEffect, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";

import PageHeader from "../components/PageHeader";
import client from "../api/client";

import "../styles/Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await client.get(
          "/users/profile"
        );

        if (!mounted) return;

        setProfile(data.user);
        setStats(data.stats || {});
      } catch (err) {
        if (!mounted) return;

        setError(
          err.response?.data?.message ||
            "Unable to load profile"
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Box className="profile-loading">
        <CircularProgress size={32} />

        <Typography color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="profile-page">
        <PageHeader
          title="Profile"
          subtitle="Manage your account information"
        />

        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  if (!profile) {
    return null;
  }

  const joinedDate = profile.createdAt
    ? new Date(
        profile.createdAt
      ).toLocaleDateString()
    : "—";

  const initial =
    profile.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <Box className="profile-page">
      <PageHeader
        title="Profile"
        subtitle="Manage your account information"
      />

      {/* ==========================================
          PROFILE HEADER
      ========================================== */}

      <Card className="profile-card profile-header-card">
        <CardContent>
          <Box className="profile-header">
            <Avatar className="profile-avatar">
              {initial}
            </Avatar>

            <Box className="profile-header-info">
              <Typography className="profile-name">
                {profile.name}
              </Typography>

              <Box className="profile-email">
                <EmailRoundedIcon />

                <Typography>
                  {profile.email}
                </Typography>
              </Box>

              <Box className="profile-meta">
                <Chip
                  label={profile.role}
                  size="small"
                  icon={
                    <AdminPanelSettingsRoundedIcon />
                  }
                  className="profile-role"
                />

                <Chip
                  label={
                    profile.isActive
                      ? "Active"
                      : "Inactive"
                  }
                  size="small"
                  className={
                    profile.isActive
                      ? "profile-status profile-status--active"
                      : "profile-status"
                  }
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ==========================================
          ACCOUNT INFORMATION
      ========================================== */}

      <Card className="profile-card">
        <CardContent>
          <Typography className="profile-section-title">
            Account Information
          </Typography>

          <Divider className="profile-divider" />

          <Grid
            container
            spacing={3}
            className="profile-info-grid"
          >
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box className="profile-info-item">
                <Box className="profile-info-icon">
                  <PersonRoundedIcon />
                </Box>

                <Box>
                  <Typography className="profile-info-label">
                    Full Name
                  </Typography>

                  <Typography className="profile-info-value">
                    {profile.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box className="profile-info-item">
                <Box className="profile-info-icon">
                  <EmailRoundedIcon />
                </Box>

                <Box>
                  <Typography className="profile-info-label">
                    Email
                  </Typography>

                  <Typography className="profile-info-value">
                    {profile.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box className="profile-info-item">
                <Box className="profile-info-icon">
                  <AdminPanelSettingsRoundedIcon />
                </Box>

                <Box>
                  <Typography className="profile-info-label">
                    Role
                  </Typography>

                  <Typography className="profile-info-value">
                    {profile.role}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box className="profile-info-item">
                <Box className="profile-info-icon">
                  <CalendarMonthRoundedIcon />
                </Box>

                <Box>
                  <Typography className="profile-info-label">
                    Joined
                  </Typography>

                  <Typography className="profile-info-value">
                    {joinedDate}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

    </Box>
  );
}

/* ==========================================
   STAT CARD
========================================== */

function StatCard({
  icon,
  value,
  label,
}) {
  return (
    <Box className="profile-stat-card">
      <Box className="profile-stat-icon">
        {icon}
      </Box>

      <Typography className="profile-stat-value">
        {value}
      </Typography>

      <Typography className="profile-stat-label">
        {label}
      </Typography>
    </Box>
  );
}