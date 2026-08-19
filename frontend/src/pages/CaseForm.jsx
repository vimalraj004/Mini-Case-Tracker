import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import client from "../api/client";

import "../styles/CaseForm.css";

export default function CaseForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editing = Boolean(id);

  const [agents, setAgents] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    clientName: "",
    subjectName: "",
    caseType: "",
    dueDate: "",
    description: "",
    agentId: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const agentsResponse = await client.get("/users/agents");

        setAgents(agentsResponse.data.agents);

        if (editing) {
          const { data } = await client.get(`/cases/${id}`);

          const caseData = data.case;

          setForm({
            clientName: caseData.clientName,
            subjectName: caseData.subjectName,
            caseType: caseData.caseType,
            dueDate: caseData.dueDate.slice(0, 10),
            description: caseData.description || "",
            agentId: caseData.agent?._id || "",
          });
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load case information"
        );
      }
    };

    loadData();
  }, [id, editing]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    setError("");

    try {
      if (editing) {
        await client.patch(`/cases/${id}`, form);
        navigate(`/cases/${id}`);
      } else {
        await client.post("/cases", form);
        navigate("/cases");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save case"
      );
    }
  };

  return (
    <div className="case-form-page">
      <PageHeader
        title={editing ? "Edit Case" : "Create New Case"}
        subtitle={
          editing
            ? "Update case information and assignment"
            : "Create and optionally assign a new case"
        }
      />

      <Card className="case-form-card">
        <CardContent>
          {error && (
            <Alert
              severity="error"
              className="case-form-alert"
            >
              {error}
            </Alert>
          )}

          <Stack
            component="form"
            onSubmit={submit}
            className="case-form"
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Client Name"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Subject Name"
                  name="subjectName"
                  value={form.subjectName}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Case Type"
                  name="caseType"
                  value={form.caseType}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Due Date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  select
                  fullWidth
                  label="Assign Agent"
                  name="agentId"
                  value={form.agentId}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    Unassigned
                  </MenuItem>

                  {agents.map((agent) => (
                    <MenuItem
                      key={agent._id}
                      value={agent._id}
                    >
                      {agent.name} — {agent.email}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <div className="case-form-actions">
              <Button
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
              >
                {editing
                  ? "Update Case"
                  : "Create Case"}
              </Button>
            </div>
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
}