import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia } from '@mui/material';

const ProfileCard = ({ profile }) => {
  if (!profile) {
    return null;
  }

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      {profile.banner_url && (
        <CardMedia
          component="img"
          height="140"
          image={profile.banner_url}
          alt="Company Banner"
        />
      )}
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {profile.logo_url && (
            <img src={profile.logo_url} alt="Company Logo" style={{ width: 80, height: 80, borderRadius: '50%', marginRight: 16 }} />
          )}
          <Typography variant="h5" component="div">
            {profile.company_name}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {profile.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Industry: {profile.industry}
        </Typography>
        {profile.website && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Website: <a href={profile.website}>{profile.website}</a>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;