import React from "react";
import { Chip } from "@mui/material";

import "../styles/StatusChip.css";

const statusConfig = {
  New: {
    color: "default",
    className: "status-chip--new",
  },

  Assigned: {
    color: "info",
    className: "status-chip--assigned",
  },

  "In Progress": {
    color: "warning",
    className: "status-chip--progress",
  },

  Submitted: {
    color: "success",
    className: "status-chip--submitted",
  },

  Cleared: {
    color: "success",
    className: "status-chip--cleared",
  },

  Discrepant: {
    color: "error",
    className: "status-chip--discrepant",
  },
};

export default function StatusChip({ status }) {
  const config = statusConfig[status] || {
    color: "default",
    className: "status-chip--default",
  };

  return (
    <Chip
      label={status}
      color={config.color}
      size="small"
      className={`status-chip ${config.className}`}
    />
  );
}