import React from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { getCompanyProfile } from '../api/apiService';
import CompanyProfile from './CompanyProfile';
import UserDetailsCard from '../components/UserDetailsCard';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {  
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: apiResponse, isLoading, isError, error } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: async () => {
      try {
        const response = await getCompanyProfile();
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return null; // A 404 is not an error, it just means no profile exists yet.
        }
        throw error; // Re-throw other errors
      }
    },
    // The data will be considered fresh for 5 minutes.
    // This avoids unnecessary refetching on component re-mounts.
    staleTime: 1000 * 60 * 5,
  });

  const profile = apiResponse?.data;

  if (isLoading) {
    return <Typography>Loading profile...</Typography>;
  }

  if (isError) {
    return <Typography>Error loading profile: {error.message}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.full_name}
      </Typography>
      <Typography variant="body1">
        This is your company dashboard.
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => navigate('/settings')}
      >
        Go to Settings
      </Button>
      {user && <UserDetailsCard user={user} />}
      <CompanyProfile profile={profile} />
    </Container>
  );
};

export default Dashboard;