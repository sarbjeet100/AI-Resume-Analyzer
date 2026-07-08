import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";

import {
  Description,
  TrendingUp,
  EmojiEvents,
  UploadFile,
  ArrowForward,
} from "@mui/icons-material";

import { getDashboardData } from "../../services/dashboardService";

import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboardData();
      setDashboard(response.data);
    } catch (err) {
      console.error(err);
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

  const cards = [
    {
      title: "Total Resumes",
      value: dashboard?.totalResumes || 0,
      icon: <Description fontSize="large" color="primary" />,
    },
    {
      title: "Average ATS",
      value: dashboard?.averageATS || 0,
      progress: dashboard?.averageATS || 0,
      icon: <TrendingUp fontSize="large" color="success" />,
    },
    {
      title: "Highest ATS",
      value: dashboard?.highestATS || 0,
      progress: dashboard?.highestATS || 0,
      icon: <EmojiEvents fontSize="large" color="warning" />,
    },
    {
      title: "Completed Analysis",
      value: dashboard?.completed || 0,
      icon: <UploadFile fontSize="large" color="secondary" />,
    },
  ];

  return (
    <div className={styles.container}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
      >
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              sx={{
                borderRadius: 4,
                height: "100%",
                transition: ".3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                },
              }}
            >
              <CardContent>
                <Avatar
                  sx={{
                    bgcolor: "#eef4ff",
                    mb: 2,
                    width: 55,
                    height: 55,
                  }}
                >
                  {card.icon}
                </Avatar>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {card.value}
                </Typography>

                <Typography
                  color="text.secondary"
                  mb={2}
                >
                  {card.title}
                </Typography>

                {card.progress !== undefined && (
                  <LinearProgress
                    variant="determinate"
                    value={card.progress}
                    sx={{
                      height: 8,
                      borderRadius: 20,
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={6}
        mb={3}
      >
        <Typography
          variant="h5"
          fontWeight={700}
        >
          Recent Resume Analysis
        </Typography>

        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={() => navigate("/history")}
        >
          View History
        </Button>
      </Box>

      <Grid container spacing={3}>
        {(dashboard?.recentUploads || []).map((resume) => (
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            key={resume.id}
          >
            <Card
              sx={{
                borderRadius: 4,
                height: "100%",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  noWrap
                  gutterBottom
                >
                  {resume.fileName}
                </Typography>

                <Chip
                  color="primary"
                  label={`ATS ${resume.atsScore}`}
                  sx={{ mb: 2 }}
                />

                <Typography
                  color="text.secondary"
                >
                  Status
                </Typography>

                <Typography
                  fontWeight={600}
                  mb={2}
                >
                  {resume.status}
                </Typography>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() =>
                    navigate(`/analysis/${resume.id}`)
                  }
                >
                  View Analysis
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard;