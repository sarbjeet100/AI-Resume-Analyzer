import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { getCurrentUser } from "../../services/userService";

import styles from "./Profile.module.css";

const Profile = () => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await getCurrentUser();

      setUser(
        response.user ||
          response.data ||
          response
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className={styles.loader}
      >
        <CircularProgress size={55} />
      </div>
    );
  }

  if (!user) {
    return (
      <Typography
        align="center"
        mt={10}
      >
        Unable to load profile.
      </Typography>
    );
  }

  return (
    <div className={styles.container}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
      >
        My Profile
      </Typography>

      <Grid
        container
        justifyContent="center"
      >
        <Grid
          item
          xs={12}
          md={8}
          lg={6}
        >
          <Card
            className={styles.card}
          >
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={4}
              >
                <Avatar
                  sx={{
                    width: 110,
                    height: 110,
                    fontSize: 42,
                    bgcolor: "primary.main",
                  }}
                >
                  {user.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </Avatar>

                <Typography
                  variant="h5"
                  mt={2}
                >
                  {user.name}
                </Typography>

                <Typography color="text.secondary">
                  {user.role
                    ?.toUpperCase() ||
                    "USER"}
                </Typography>
              </Box>

              <Divider
                sx={{ mb: 3 }}
              />

              <Box
                className={styles.info}
              >
                <PersonIcon color="primary" />

                <div>
                  <Typography fontWeight={600}>
                    Full Name
                  </Typography>

                  <Typography color="text.secondary">
                    {user.name}
                  </Typography>
                </div>
              </Box>

              <Box
                className={styles.info}
              >
                <EmailIcon color="primary" />

                <div>
                  <Typography fontWeight={600}>
                    Email Address
                  </Typography>

                  <Typography color="text.secondary">
                    {user.email}
                  </Typography>
                </div>
              </Box>

              <Box
                className={styles.info}
              >
                <BadgeIcon color="primary" />

                <div>
                  <Typography fontWeight={600}>
                    Role
                  </Typography>

                  <Typography color="text.secondary">
                    {user.role}
                  </Typography>
                </div>
              </Box>

              <Box
                className={styles.info}
              >
                <CalendarMonthIcon color="primary" />

                <div>
                  <Typography fontWeight={600}>
                    Member Since
                  </Typography>

                  <Typography color="text.secondary">
                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </Typography>
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;