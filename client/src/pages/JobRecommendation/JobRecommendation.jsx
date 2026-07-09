import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
  Divider,
} from "@mui/material";

import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";

import { getMyResumes } from "../../services/resumeService";
import { getJobRecommendations } from "../../services/jobRecommendationService";

import styles from "./JobRecommendation.module.css";

const JobRecommendation = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);

      const resumeResponse = await getMyResumes();

      const resumes = resumeResponse.data || [];

      if (resumes.length === 0) {
        setLoading(false);
        return;
      }

      const latestResume = resumes[0];

      const response = await getJobRecommendations(
        latestResume._id
      );

      setJobs(
        response.data.recommendedJobs || []
      );

      setRoadmap(
        response.data.careerRoadmap || []
      );

      setAdvice(
        response.data.overallAdvice || ""
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <CircularProgress size={60} />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Alert severity="info">
        Upload a resume first to receive AI Job
        Recommendations.
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
        AI Job Recommendations
      </Typography>

      <Grid container spacing={3}>
        {jobs.map((job, index) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            key={index}
          >
            <Card className={styles.card}>
              <CardContent>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                >
                  <WorkIcon
                    sx={{
                      mr: 1,
                      verticalAlign: "middle",
                    }}
                  />
                  {job.title}
                </Typography>

                <Chip
                  color="success"
                  icon={<TrendingUpIcon />}
                  label={`${job.match}% Match`}
                  sx={{ mb: 2 }}
                />

                <Typography>
                  <strong>Salary</strong>
                </Typography>

                <Typography
                  color="text.secondary"
                  mb={2}
                >
                  {job.salary}
                </Typography>

                <Typography>
                  <strong>Experience</strong>
                </Typography>

                <Typography
                  color="text.secondary"
                  mb={2}
                >
                  {job.experience}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography
                  fontWeight={700}
                >
                  Required Skills
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    mt: 1,
                    mb: 2,
                  }}
                >
                  {job.requiredSkills?.map(
                    (skill, i) => (
                      <Chip
                        key={i}
                        label={skill}
                        color="primary"
                        size="small"
                      />
                    )
                  )}
                </Box>

                <Typography
                  fontWeight={700}
                >
                  Missing Skills
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    mt: 1,
                    mb: 2,
                  }}
                >
                  {job.missingSkills?.map(
                    (skill, i) => (
                      <Chip
                        key={i}
                        label={skill}
                        color="warning"
                        size="small"
                      />
                    )
                  )}
                </Box>

                <Typography
                  fontWeight={700}
                >
                  Companies
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    mt: 1,
                    mb: 2,
                  }}
                >
                  {job.companies?.map(
                    (company, i) => (
                      <Chip
                        key={i}
                        icon={<BusinessIcon />}
                        label={company}
                        color="secondary"
                        size="small"
                      />
                    )
                  )}
                </Box>

                <Typography
                  color="text.secondary"
                  mt={2}
                >
                  {job.reason}
                </Typography>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mt: 5 }}>
        <CardContent>

          <Typography
            variant="h5"
            gutterBottom
          >
            <SchoolIcon
              sx={{
                mr: 1,
                verticalAlign: "middle",
              }}
            />
            Career Roadmap
          </Typography>

          {roadmap.map((step, index) => (
            <Typography
              key={index}
              sx={{ mb: 1 }}
            >
              {index + 1}. {step}
            </Typography>
          ))}

        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>

          <Typography
            variant="h5"
            gutterBottom
          >
            AI Career Advice
          </Typography>

          <Typography>
            {advice}
          </Typography>

        </CardContent>
      </Card>
    </div>
  );
};

export default JobRecommendation;