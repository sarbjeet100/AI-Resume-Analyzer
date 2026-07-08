import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  Delete,
  Description,
  Visibility,
  CalendarMonth,
  Speed,
} from "@mui/icons-material";

import {
  getMyResumes,
  deleteResume,
} from "../../services/resumeService";

import styles from "./History.module.css";

const getScoreColor = (score) => {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "error";
};

const History = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] =
    useState(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);

      const response = await getMyResumes();

      setResumes(response.data || []);
    } catch (err) {
      console.error(err);
      alert("Unable to load resume history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteResume(selectedResume);

      setSelectedResume(null);

      loadResumes();
    } catch (err) {
      console.error(err);
      alert("Unable to delete resume.");
    }
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <CircularProgress size={65} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
      >
        Resume History
      </Typography>

      {resumes.length === 0 ? (
        <Card
          sx={{
            borderRadius: 4,
            textAlign: "center",
            py: 6,
          }}
        >
          <Description
            sx={{
              fontSize: 70,
              color: "#bdbdbd",
            }}
          />

          <Typography
            variant="h6"
            mt={2}
          >
            No Resume Uploaded Yet
          </Typography>

          <Typography
            color="text.secondary"
            mb={3}
          >
            Upload your first resume to start
            analyzing.
          </Typography>

          <Button
            variant="contained"
            onClick={() =>
              navigate("/upload")
            }
          >
            Upload Resume
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {resumes.map((resume) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={resume._id}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  transition: ".3s",
                  height: "100%",
                  "&:hover": {
                    transform:
                      "translateY(-6px)",
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Description
                      color="primary"
                      sx={{
                        fontSize: 40,
                      }}
                    />

                    <Chip
                      color={getScoreColor(
                        resume.ats
                          ?.overallScore || 0
                      )}
                      label={`ATS ${
                        resume.ats
                          ?.overallScore || 0
                      }`}
                    />
                  </Stack>

                  <Typography
                    variant="h6"
                    gutterBottom
                    noWrap
                  >
                    {resume.originalName}
                  </Typography>

                  <Divider
                    sx={{ my: 2 }}
                  />

                  <Box mb={1}>
                    <Typography
                      color="text.secondary"
                    >
                      <CalendarMonth
                        sx={{
                          fontSize: 17,
                          mr: 1,
                          verticalAlign:
                            "middle",
                        }}
                      />
                      {new Date(
                        resume.createdAt
                      ).toLocaleString()}
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography
                      color="text.secondary"
                    >
                      <Speed
                        sx={{
                          fontSize: 17,
                          mr: 1,
                          verticalAlign:
                            "middle",
                        }}
                      />
                      {resume.processingTime ||
                        0}
                      ms
                    </Typography>
                  </Box>

                  <Chip
                    label={
                      resume.status
                    }
                    color={
                      resume.status ===
                      "completed"
                        ? "success"
                        : "warning"
                    }
                    sx={{
                      mb: 3,
                    }}
                  />

                  <Stack spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={
                        <Visibility />
                      }
                      fullWidth
                      onClick={() =>
                        navigate(
                          `/analysis/${resume._id}`
                        )
                      }
                    >
                      View Analysis
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={
                        <Delete />
                      }
                      fullWidth
                      onClick={() =>
                        setSelectedResume(
                          resume._id
                        )
                      }
                    >
                      Delete
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={Boolean(selectedResume)}
        onClose={() =>
          setSelectedResume(null)
        }
      >
        <DialogTitle>
          Delete Resume
        </DialogTitle>

        <DialogContent>
          Are you sure you want to
          permanently delete this
          resume analysis?
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setSelectedResume(null)
            }
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default History;