import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

import "../styles/CaseDetail.css";

export default function CaseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await client.get(
        `/cases/${id}`
      );

      setData(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load case"
      );
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const addComment = async () => {
    if (!comment.trim()) return;

    try {
      await client.post(
        `/cases/${id}/comments`,
        {
          text: comment,
        }
      );

      setComment("");
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to add comment"
      );
    }
  };

  const changeStatus = async (status) => {
    try {
      setError("");

      await client.patch(
        `/cases/${id}/status`,
        {
          status,
        }
      );

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Status change failed"
      );
    }
  };

  if (!data) {
    return (
      <div className="case-detail-loading">
        <Typography>
          {error || "Loading case..."}
        </Typography>
      </div>
    );
  }

  const caseData = data.case;

  return (
    <div className="case-detail-page">
      <PageHeader
        title={`${caseData.caseId} — ${caseData.subjectName}`}
        subtitle={`${caseData.clientName} • ${caseData.caseType} • Due ${new Date(
          caseData.dueDate
        ).toLocaleDateString()}`}
        action={
          <Stack className="case-detail-header-actions">
            <StatusChip status={caseData.status} />

            {user.role === "MANAGER" && (
              <Button
                component={Link}
                to={`/cases/${id}/edit`}
                variant="outlined"
                startIcon={<EditRoundedIcon />}
              >
                Edit
              </Button>
            )}
          </Stack>
        }
      />

      {error && (
        <Alert
          severity="error"
          className="case-detail-alert"
        >
          {error}
        </Alert>
      )}

      <Grid
        container
        spacing={2.5}
        className="case-detail-grid"
      >
        {/* LEFT */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card className="case-detail-card">
            <CardContent>
              <Typography variant="h6">
                Overview
              </Typography>

              <Typography
                color="text.secondary"
                className="case-description"
              >
                {caseData.description ||
                  "No description added."}
              </Typography>

              <Grid
                container
                spacing={2}
              >
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Assigned To
                  </Typography>

                  <Typography fontWeight={700}>
                    {caseData.agent?.name ||
                      "Unassigned"}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Created By
                  </Typography>

                  <Typography fontWeight={700}>
                    {caseData.createdBy?.name}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* TIMELINE */}
          <Card className="case-detail-card">
            <CardContent>
              <Typography variant="h6">
                Status Timeline
              </Typography>

              <div className="status-timeline">
                {data?.auditLogs.map((log) => (
                  <div
                    className="timeline-item"
                    key={log._id}
                  >
                    <div className="timeline-dot" />

                    <div className="timeline-content">
                      <Typography fontWeight={700}>
                        {log.action ===
                        "STATUS_CHANGED"
                          ? `${log.fromStatus} → ${log.toStatus}`
                          : log.action}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {log.actor?.name} •{" "}
                        {new Date(
                          log.createdAt
                        ).toLocaleString()}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* DOCUMENTS */}
          <Card className="case-detail-card">
            <CardContent>
              <Typography variant="h6">
                Documents ({data.documents.length})
              </Typography>

              <div className="documents-list">
                {data.documents.map((document) => (
                  <div
                    className="document-item"
                    key={document._id}
                  >
                    <Typography fontWeight={600}>
                      {document.originalName}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {Math.round(
                        document.size / 1024
                      )}{" "}
                      KB •{" "}
                      {document.uploadedBy?.name}
                    </Typography>
                  </div>
                ))}

                {!data.documents.length && (
                  <Typography color="text.secondary">
                    No documents uploaded yet.
                  </Typography>
                )}
              </div>

              {user.role === "AGENT" &&
                caseData.status === "In Progress" && (
                  <Button
                    component={Link}
                    to={`/cases/${id}/upload`}
                    variant="outlined"
                    startIcon={
                      <UploadFileRoundedIcon />
                    }
                    className="upload-document-button"
                  >
                    Upload Document
                  </Button>
                )}
            </CardContent>
          </Card>

          {/* COMMENTS */}
          <Card className="case-detail-card">
            <CardContent>
              <Typography variant="h6">
                Comments
              </Typography>

              <div className="comments-list">
                {data.comments.map((item) => (
                  <div
                    className="comment-item"
                    key={item._id}
                  >
                    <Typography fontWeight={700}>
                      {item.author?.name}
                    </Typography>

                    <Typography className="comment-text">
                      {item.text}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </Typography>

                    <Divider className="comment-divider" />
                  </div>
                ))}
              </div>

              <div className="comment-input">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(event) =>
                    setComment(event.target.value)
                  }
                />

                <Button
                  variant="contained"
                  onClick={addComment}
                  startIcon={<SendRoundedIcon />}
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* WORKFLOW */}
          <Card className="case-detail-card workflow-card">
            <CardContent>
              <Typography variant="h6">
                Workflow Action
              </Typography>

              {user.role === "AGENT" &&
                caseData.status === "Assigned" && (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() =>
                      changeStatus("In Progress")
                    }
                    startIcon={
                      <SendRoundedIcon />
                    }
                  >
                    Start Case
                  </Button>
                )}

              {user.role === "AGENT" &&
                caseData.status === "In Progress" && (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() =>
                      changeStatus("Submitted")
                    }
                  >
                    Submit Case
                  </Button>
                )}

              {user.role === "MANAGER" &&
                caseData.status === "Submitted" && (
                  <div className="manager-actions">
                    <Button
                      fullWidth
                      color="success"
                      variant="contained"
                      onClick={() =>
                        changeStatus("Cleared")
                      }
                    >
                      Clear
                    </Button>

                    <Button
                      fullWidth
                      color="error"
                      variant="outlined"
                      onClick={() =>
                        changeStatus("Discrepant")
                      }
                    >
                      Discrepant
                    </Button>
                  </div>
                )}

              {[
                "New",
                "Cleared",
                "Discrepant",
              ].includes(caseData.status) && (
                <Typography color="text.secondary">
                  No workflow action available for
                  the current status.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}