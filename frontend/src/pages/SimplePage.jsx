import React from "react";
import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import PageHeader from "../components/PageHeader";

import "../styles/SimplePage.css";

export default function SimplePage({
  title,
  subtitle,
}) {
  return (
    <div className="simple-page">
      <PageHeader
        title={title}
        subtitle={subtitle}
      />

      <Card className="simple-page-card">
        <CardContent>
          <Typography className="simple-page-message">
            This page is intentionally lightweight.
            The core assessment workflow is implemented
            first.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}