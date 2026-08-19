import React from "react";
import { Box, Typography } from "@mui/material";

import "../styles/PageHeader.css";

export default function PageHeader({
  title,
  subtitle,
  action,
}) {
  return (
    <Box className="page-header">
      <Box className="page-header__content">
        <Typography className="page-header__title">
          {title}
        </Typography>

        {subtitle && (
          <Typography className="page-header__subtitle">
            {subtitle}
          </Typography>
        )}
      </Box>

      {action && (
        <Box className="page-header__action">
          {action}
        </Box>
      )}
    </Box>
  );
}