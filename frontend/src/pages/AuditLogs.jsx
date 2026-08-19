import React, { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

import PageHeader from "../components/PageHeader";
import client from "../api/client";

import "../styles/AuditLogs.css";

const actionLabels = {
  CASE_CREATED: "Case Created",
  CASE_ASSIGNED: "Case Assigned",
  STATUS_CHANGED: "Status Changed",
  CASE_SUBMITTED: "Case Submitted",
  CASE_CLEARED: "Case Cleared",
  CASE_DISCREPANT: "Case Discrepant",
  CASE_UPDATED: "Case Updated",
};

const actionColors = {
  CASE_CREATED: "success",
  CASE_ASSIGNED: "info",
  STATUS_CHANGED: "warning",
  CASE_SUBMITTED: "primary",
  CASE_CLEARED: "success",
  CASE_DISCREPANT: "error",
  CASE_UPDATED: "default",
};

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await client.get("/audit-logs", {
        params: {
          search,
          action,
          page,
          limit: 20,
        },
      });

      setLogs(data.logs || []);
      setPagination(
        data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        }
      );
    } catch (err) {
      console.error("Audit logs error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load audit logs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLogs();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, action, page]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleActionChange = (event) => {
    setAction(event.target.value);
    setPage(1);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString();
  };

  return (
    <div className="audit-page">
      <PageHeader
        title="Audit Logs"
        subtitle="Track important case changes"
      />

      <Card className="audit-card">
        <CardContent>
          {/* Toolbar */}

          <Box className="audit-toolbar">
            <TextField
              fullWidth
              size="small"
              placeholder="Search by case ID or activity"
              value={search}
              onChange={handleSearch}
              className="audit-search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl
              size="small"
              className="audit-filter"
            >
              <Select
                value={action}
                displayEmpty
                onChange={handleActionChange}
              >
                <MenuItem value="">
                  All Activities
                </MenuItem>

                {Object.entries(actionLabels).map(
                  ([value, label]) => (
                    <MenuItem
                      key={value}
                      value={value}
                    >
                      {label}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Box>

          {/* Error */}

          {error && (
            <Alert
              severity="error"
              className="audit-alert"
            >
              {error}
            </Alert>
          )}

          {/* Loading */}

          {loading && (
            <Box className="audit-loading">
              <CircularProgress size={30} />

              <Typography color="text.secondary">
                Loading audit logs...
              </Typography>
            </Box>
          )}

          {/* Empty */}

          {!loading &&
            !error &&
            logs.length === 0 && (
              <Box className="audit-empty">
                <HistoryRoundedIcon />

                <Typography variant="h6">
                  No audit logs found
                </Typography>

                <Typography color="text.secondary">
                  Case activities will appear here.
                </Typography>
              </Box>
            )}

          {/* Logs */}

          {!loading && logs.length > 0 && (
            <Stack className="audit-list">
              {logs.map((log) => (
                <Box
                  key={log._id}
                  className="audit-item"
                >
                  <Box className="audit-icon">
                    <HistoryRoundedIcon />
                  </Box>

                  <Box className="audit-content">
                    <Box className="audit-top">
                      <Chip
                        label={
                          actionLabels[log.action] ||
                          log.action
                        }
                        size="small"
                        color={
                          actionColors[log.action] ||
                          "default"
                        }
                      />

                      <Typography className="audit-date">
                        {formatDate(log.createdAt)}
                      </Typography>
                    </Box>

                    <Typography className="audit-details">
                      {log.details}
                    </Typography>

                    <Box className="audit-meta">
                      {log.case && (
                        <Box className="audit-meta-item">
                          <AssignmentRoundedIcon />

                          <Typography>
                            {log.case.caseId}
                          </Typography>
                        </Box>
                      )}

                      {log.performedBy && (
                        <Box className="audit-meta-item">
                          <PersonRoundedIcon />

                          <Typography>
                            {log.performedBy.name}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}

          {/* Pagination */}

          {!loading &&
            pagination.totalPages > 1 && (
              <Box className="audit-pagination">
                <Pagination
                  count={pagination.totalPages}
                  page={page}
                  onChange={(_, value) =>
                    setPage(value)
                  }
                  color="primary"
                />
              </Box>
            )}
        </CardContent>
      </Card>
    </div>
  );
}