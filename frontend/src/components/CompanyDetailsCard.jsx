import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';



const CompanyDetailsCard = ({ profile }) => {
  // Debug log
  console.log('CompanyDetailsCard received profile:', profile);
  if (!profile) {
    return null;
  }

  // If social_links is a string, parse it
  let socialLinks = profile.social_links;
  if (typeof socialLinks === 'string') {
    try {
      socialLinks = JSON.parse(socialLinks);
    } catch (e) {
      socialLinks = {};
    }
  }

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <CardContent>
        
        <Typography variant="h5" component="div" >
          {profile.company_name}
        </Typography>
        
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {profile.description}
          </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Industry: {profile.industry}
        </Typography>
        
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Address: {profile.address}
          </Typography>
        
        
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            City: {profile.city}
          </Typography>
        
        
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            State: {profile.state}
          </Typography>
        
       
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Country: {profile.country}
          </Typography>
    
        
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Postal Code: {profile.postal_code}
          </Typography>
        
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Website: <a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a>
          </Typography>
        
        {/* Social Links */}
        {socialLinks && typeof socialLinks === 'object' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">Social Links:</Typography>
            {Object.entries(socialLinks).map(([key, value]) =>
              value ? (
                <Typography key={key} variant="body2" color="text.secondary">
                  {key.charAt(0).toUpperCase() + key.slice(1)}: <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                </Typography>
              ) : null
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyDetailsCard;