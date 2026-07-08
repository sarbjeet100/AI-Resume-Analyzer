import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { uploadResume } from "../../services/resumeService";

import styles from "./Upload.module.css";

const MAX_SIZE = 5 * 1024 * 1024;

const Upload = () => {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF resumes are allowed.");
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("Maximum file size is 5 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a resume.");
      return;
    }

    try {
      setLoading(true);
      setProgress(20);

      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 250);

      const response = await uploadResume(selectedFile);

      clearInterval(timer);

      setProgress(100);

      setTimeout(() => {
        navigate(`/analysis/${response.data.id}`);
      }, 600);
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Resume upload failed."
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 700);
    }
  };

  return (
    <div className={styles.container}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
      >
        Upload Resume
      </Typography>

      <Card
        sx={{
          maxWidth: 720,
          mx: "auto",
          borderRadius: 5,
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Stack
            spacing={3}
            alignItems="center"
          >
            <CloudUploadIcon
              sx={{
                fontSize: 90,
                color: "primary.main",
              }}
            />

            <Typography
              variant="h5"
              fontWeight={700}
            >
              Upload Your Resume
            </Typography>

            <Typography
              color="text.secondary"
              align="center"
            >
              Upload your latest resume in PDF
              format. Our AI will analyze your
              resume, calculate the ATS score and
              provide detailed feedback.
            </Typography>

            <Button
              variant="outlined"
              component="label"
              size="large"
              startIcon={<UploadFileIcon />}
            >
              Choose PDF

              <input
                hidden
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </Button>

            {selectedFile && (
              <Alert
                icon={<CheckCircleIcon />}
                severity="success"
                sx={{ width: "100%" }}
              >
                <Box>
                  <Typography
                    fontWeight={700}
                  >
                    File Selected
                  </Typography>

                  <Chip
                    sx={{ mt: 1 }}
                    icon={<DescriptionIcon />}
                    label={`${selectedFile.name} (${(
                      selectedFile.size /
                      1024
                    ).toFixed(1)} KB)`}
                  />
                </Box>
              </Alert>
            )}

            {loading && (
              <Box width="100%">
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                  }}
                />

                <Typography
                  mt={1}
                  align="center"
                  color="text.secondary"
                >
                  AI is analyzing your resume...
                </Typography>
              </Box>
            )}

            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={
                loading || !selectedFile
              }
              onClick={handleUpload}
              sx={{
                py: 1.6,
                fontWeight: 700,
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                />
              ) : (
                "Analyze Resume"
              )}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;