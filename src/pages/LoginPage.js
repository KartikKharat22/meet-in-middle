import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Link,
  Divider,
  Alert,
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
  Paper
} from '@mui/material';
import {
  Phone,
  ArrowBack
} from '@mui/icons-material';
import { AuthLayout } from '../components/Layout/AuthLayout';
import Login from '../components/Authentication/Login'; // Import your Login component

function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [error, setError] = useState('');

  return (
    <AuthLayout>
      <Paper elevation={3} sx={{
        width: '100%',
        maxWidth: 400,
        p: 3,
        borderRadius: 2,
        position: 'relative'
      }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            textAlign: 'center',
            color: 'primary.main',
            mt: 2
          }}
        >
          Login with OTP
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Login
          onError={setError}
          onSuccess={() => navigate('/verify-otp')}
        />
      </Paper>
    </AuthLayout>
  );
}

export default LoginPage;