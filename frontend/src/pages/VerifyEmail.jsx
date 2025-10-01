import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token found. Please check the link.');
      return;
    }

    const verify = async () => {
      try {
        const response = await axios.post(`${API_URL}/auth/verify-email`, { token });
        setStatus('success');
        setMessage(response.data.message);
        setTimeout(() => navigate('/login'), 5000); // Redirect to login after 5 seconds
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'An error occurred during verification.');
      }
    };

    verify();
  }, [location, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>Email Verification</Typography>
      {status === 'verifying' && <CircularProgress sx={{ my: 2 }} />}
      <Alert severity={status === 'success' ? 'success' : status === 'error' ? 'error' : 'info'}>
        {message}
      </Alert>
    </Box>
  );
};

export default VerifyEmail;