import React from 'react';
import { Box, Card, CardMedia } from '@mui/material';



const CompanyMediaCard = ({ profile }) => {
  // Debug log
  console.log('CompanyMediaCard received profile:', profile);
  if (!profile) {
    return null;
  }

  // Fallback image if logo fails to load
  const [imgError, setImgError] = React.useState(false);
  const fallbackLogo = 'https://via.placeholder.com/80?text=No+Logo';

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
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        {profile.logo_url && !imgError ? (
          <img
            src={profile.logo_url}
            alt="Company Logo"
            style={{ width: 80, height: 80, borderRadius: '50%', marginRight: 16 }}
            onError={() => setImgError(true)}
          />
        ) : (
          <img
            src={fallbackLogo}
            alt="No Logo"
            style={{ width: 80, height: 80, borderRadius: '50%', marginRight: 16, opacity: 0.5 }}
          />
        )}
      </Box>
    </Card>
  );
};

export default CompanyMediaCard;