import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import client from "../api/client";

import "../styles/UploadDocuments.css";

export default function UploadDocuments() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files?.[0] || null);
    setError("");
  };

  const upload = async () => {
    if (!file) {
      setError("Select a file first");
      return;
    }

    const form = new FormData();

    form.append("file", file);

    setSaving(true);
    setError("");

    try {
      await client.post(
        `/cases/${id}/documents`,
        form
      );

      navigate(`/cases/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Upload failed"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="upload-page">
      <PageHeader
        title="Upload Documents"
        subtitle="Add supporting documents or photos to this case"
      />

      <Card className="upload-card">
        <CardContent>
          {error && (
            <Alert
              severity="error"
              className="upload-alert"
            >
              {error}
            </Alert>
          )}

          <div className="upload-dropzone">
            <CloudUploadRoundedIcon
              className="upload-icon"
              color="primary"
            />

            <Typography variant="h6">
              Choose a file
            </Typography>

            <Typography
              color="text.secondary"
              className="upload-help-text"
            >
              PDF, JPG, PNG, DOC or DOCX up to 10 MB
            </Typography>

            <Button
              component="label"
              variant="outlined"
            >
              Browse Files

              <input
                hidden
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileChange}
              />
            </Button>

            {file && (
              <Typography className="selected-file">
                {file.name}
              </Typography>
            )}
          </div>

          <div className="upload-actions">
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={upload}
              disabled={saving}
            >
              {saving
                ? "Uploading..."
                : "Upload Document"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}