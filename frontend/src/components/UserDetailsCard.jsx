import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const UserDetailsCard = ({ user }) => {
  if (!user) {
    return null;
  }

  const getGender = (genderCode) => {
    switch (genderCode) {
      case 'm':
        return 'Male';
      case 'f':
        return 'Female';
      case 'o':
        return 'Other';
      default:
        return 'N/A';
    }
  };

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          User Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Full Name: {user.full_name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Email: {user.email}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Mobile Number: {user.mobile_no}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gender: {getGender(user.gender)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserDetailsCard;