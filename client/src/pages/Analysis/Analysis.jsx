import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";

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
  LinearProgress,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import PsychologyIcon from "@mui/icons-material/Psychology";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CodeIcon from "@mui/icons-material/Code";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";

import { getResumeById } from "../../services/resumeService";

import styles from "./Analysis.module.css";

const Section = ({ title, icon, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        height: "100%",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={2}
      >
        {icon}
        <Typography variant="h6">
          {title}
        </Typography>
      </Box>

      <List dense>
        {items.map((item, index) => (
          <ListItem key={index}>
            • {item}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

const Analysis = () => {
  const { id } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (location.state?.id) {
      fetchResume(location.state.id);
    } else if (id) {
      fetchResume(id);
    } else {
      navigate("/history");
    }
  }, []);

  const fetchResume = async (resumeId) => {
    try {
      setLoading(true);

      const response = await getResumeById(resumeId);

      setResume(response.data);
    } catch (err) {
      console.error(err);
      alert("Unable to load resume.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <CircularProgress size={65} />
      </div>
    );
  }

  if (!resume) {
    return (
      <Alert severity="error">
        Resume not found.
      </Alert>
    );
  }

  return (
    <div className={styles.container}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
      >
        Resume Analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 4,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
              >
                ATS Score
              </Typography>

              <Typography
                variant="h2"
                color="primary"
                fontWeight={700}
              >
                {resume.ats?.overallScore || 0}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={
                  resume.ats?.overallScore || 0
                }
                sx={{
                  mt: 2,
                  height: 12,
                  borderRadius: 10,
                }}
              />

              <Typography
                mt={2}
                color="text.secondary"
              >
                Processing Time :
                {" "}
                {resume.processingTime || 0} ms
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 4,
            }}
          >
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                mb={3}
              >
                <Avatar
                  sx={{
                    width: 65,
                    height: 65,
                  }}
                >
                  <PersonIcon />
                </Avatar>

                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                  >
                    {resume.parsedResume?.name ||
                      "Unknown"}
                  </Typography>

                  <Typography color="text.secondary">
                    Resume Information
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography mb={1}>
                <EmailIcon
                  fontSize="small"
                  sx={{
                    mr: 1,
                    verticalAlign: "middle",
                  }}
                />
                {resume.parsedResume?.email ||
                  "Not Found"}
              </Typography>

              <Typography mb={1}>
                <PhoneIcon
                  fontSize="small"
                  sx={{
                    mr: 1,
                    verticalAlign: "middle",
                  }}
                />
                {resume.parsedResume?.phone ||
                  "Not Found"}
              </Typography>

              <Typography mb={1}>
                <LinkedInIcon
                  fontSize="small"
                  sx={{
                    mr: 1,
                    verticalAlign: "middle",
                  }}
                />
                {resume.parsedResume?.linkedin ||
                  "Not Found"}
              </Typography>

              <Typography>
                <GitHubIcon
                  fontSize="small"
                  sx={{
                    mr: 1,
                    verticalAlign: "middle",
                  }}
                />
                {resume.parsedResume?.github ||
                  "Not Found"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 4,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
              >
                Technical Skills
              </Typography>

              <Box
                display="flex"
                flexWrap="wrap"
                gap={1}
              >
                {(resume.parsedResume?.skills ||
                  []).map(
                  (skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      color="primary"
                    />
                  )
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Section
            title="ATS Suggestions"
            icon={<TipsAndUpdatesIcon color="warning" />}
            items={resume.ats?.suggestions}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Section
            title="Strengths"
            icon={<WorkspacePremiumIcon color="success" />}
            items={resume.aiAnalysis?.strengths}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Section
            title="Weaknesses"
            icon={<PsychologyIcon color="error" />}
            items={resume.aiAnalysis?.weaknesses}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Section
            title="Missing Skills"
            icon={<CodeIcon color="secondary" />}
            items={resume.aiAnalysis?.missingSkills}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Section
            title="Recommended Projects"
            icon={<WorkIcon color="primary" />}
            items={
              resume.aiAnalysis
                ?.recommendedProjects
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Section
            title="Recommended Certifications"
            icon={<SchoolIcon color="primary" />}
            items={
              resume.aiAnalysis
                ?.recommendedCertifications
            }
          />
        </Grid>

        <Grid item xs={12}>
  <Card
    sx={{
      borderRadius: 4,
    }}
  >
    <CardContent>
      <Typography
        variant="h5"
        gutterBottom
      >
        Overall AI Feedback
      </Typography>

      <Typography
        color="text.secondary"
        lineHeight={1.9}
      >
        {resume.aiAnalysis?.overallFeedback ||
          "AI Feedback unavailable."}
      </Typography>

      <Button
        variant="contained"
        size="large"
        sx={{
          mt: 4,
        }}
        onClick={() =>
          navigate("/job-recommendation")
        }
      >
        View AI Job Recommendations
      </Button>
    </CardContent>
  </Card>
</Grid>
      </Grid>
    </div>
  );
};

export default Analysis;