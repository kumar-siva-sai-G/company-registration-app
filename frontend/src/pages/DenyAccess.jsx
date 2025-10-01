import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DenyAccess = () => {
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('Securing your email address...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');

    if (!token) {
      setStatus('error');
      setMessage('No security token found. The link may be invalid.');
      return;
    }

    const deny = async () => {
      try {
        const response = await axios.post(`${API_URL}/auth/deny-access`, { token });
        setStatus('success');
        setMessage(response.data.message);
        setTimeout(() => navigate('/login'), 10000); // Redirect to login after 10 seconds
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'An error occurred.');
      }
    };

    deny();
  }, [location, navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>Account Security</Typography>
      {status === 'processing' && <CircularProgress sx={{ my: 2 }} />}
      <Alert severity={status === 'success' ? 'success' : status === 'error' ? 'error' : 'info'}>
        {message}
      </Alert>
    </Box>
  );
};

export default DenyAccess;