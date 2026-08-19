import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Stack,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

import "../styles/Cases.css";

export default function Cases() {
  const { user } = useAuth();

  const [data, setData] = useState({
    items: [],
    pagination: {
      page: 1,
      pages: 1,
      total: 0,
    },
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  async function load(page = 1) {
    const params = new URLSearchParams({
      page,
      limit: 10,
    });

    if (search) params.set("search", search);
    if (status) params.set("status", status);

    const { data } = await client.get(`/cases?${params}`);

    setData(data);
  }

  useEffect(() => {
    load(1);
  }, [status]);

  return (
    <div className="cases-page">
      <PageHeader
        title={user.role === "AGENT" ? "My Cases" : "Cases"}
        subtitle="Search, filter and manage case workflow"
        action={
          user.role === "MANAGER" && (
            <Button
              component={Link}
              to="/cases/new"
              variant="contained"
              startIcon={<AddRoundedIcon />}
            >
              Create Case
            </Button>
          )
        }
      />

      <Card className="cases-card">
        <CardContent>
          <Stack
            className="cases-filters"
            direction={{ xs: "column", md: "row" }}
            spacing={2}
          >
            <TextField
              className="cases-search"
              fullWidth
              size="small"
              label="Search cases"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  load(1);
                }
              }}
            />

            <FormControl
              className="cases-status-filter"
              size="small"
            >
              <InputLabel>Status</InputLabel>

              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>

                {[
                  "New",
                  "Assigned",
                  "In Progress",
                  "Submitted",
                  "Cleared",
                  "Discrepant",
                ].map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <div className="cases-table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Case ID</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>

              <TableBody>
                {data.items.map((c) => (
                  <TableRow key={c._id} hover>
                    <TableCell className="case-id">
                      {c.caseId}
                    </TableCell>

                    <TableCell>{c.clientName}</TableCell>

                    <TableCell>{c.subjectName}</TableCell>

                    <TableCell>
                      {c.agent?.name || "Unassigned"}
                    </TableCell>

                    <TableCell>
                      <StatusChip status={c.status} />
                    </TableCell>

                    <TableCell>
                      {new Date(c.dueDate).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Button
                        component={Link}
                        to={`/cases/${c._id}`}
                        size="small"
                        startIcon={<VisibilityRoundedIcon />}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            component="div"
            count={data.pagination.total}
            page={Math.max(0, data.pagination.page - 1)}
            rowsPerPage={10}
            rowsPerPageOptions={[10]}
            onPageChange={(_, page) => load(page + 1)}
          />
        </CardContent>
      </Card>
    </div>
  );
}