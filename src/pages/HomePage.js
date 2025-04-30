import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  Paper,
  Container,
  Grid
} from '@mui/material';
import {
  Groups,
  LocationOn,
  CalendarMonth,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { FeatureCard } from '../components/Home/FeatureCard';

const features = [
  {
    icon: <Groups fontSize="large" color="primary" />,
    title: "Easy Group Coordination",
    description: "Invite participants and manage meetings effortlessly"
  },
  {
    icon: <LocationOn fontSize="large" color="primary" />,
    title: "Smart Location Suggestions",
    description: "Find the perfect midpoint for all attendees"
  },
  {
    icon: <CalendarMonth fontSize="large" color="primary" />,
    title: "Seamless Scheduling",
    description: "Coordinate times that work for everyone"
  }
];

export function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper
        elevation={0}
        sx={{
          py: 10,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)'
            : 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 50%, #7986cb 100%)',
          color: 'white',
          borderRadius: 0
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant={isMobile ? "h4" : "h3"}
                component="h1"
                fontWeight={700}
                gutterBottom
              >
                Meet in the Middle
              </Typography>
              <Typography
                variant={isMobile ? "body1" : "h6"}
                component="p"
                sx={{ mb: 4 }}
              >
                The smart way to find the perfect meeting spot for your group
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </Stack>
            </Grid>
            {!isMobile && (
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src="/images/meeting-map.svg"
                  alt="Meeting illustration"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: 500
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          fontWeight={600}
          gutterBottom
        >
          How It Works
        </Typography>
        <Typography
          variant="body1"
          component="p"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}
        >
          Our platform makes group meetups effortless with these key features
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Paper
        elevation={0}
        sx={{
          py: 8,
          background: theme.palette.mode === 'dark'
            ? theme.palette.grey[900]
            : theme.palette.grey[100]
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h3"
            align="center"
            fontWeight={600}
            gutterBottom
          >
            Ready to Simplify Your Group Meetings?
          </Typography>
          <Typography
            variant="body1"
            component="p"
            align="center"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Join thousands of users who save time and frustration with our smart meeting coordination platform
          </Typography>
          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/register')}
              sx={{ px: 6, py: 1.5 }}
            >
              Start for Free
            </Button>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
}

export default HomePage;