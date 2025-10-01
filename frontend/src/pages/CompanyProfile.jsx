import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Link } from '@mui/material';

const CompanyProfile = ({ profile }) => {
  const [imgError, setImgError] = React.useState(false);
  const fallbackLogo = 'https://via.placeholder.com/80?text=No+Logo';

  if (!profile) {
    return (
      <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
        <CardContent>
          <Typography>No company profile to display.</Typography>
        </CardContent>
      </Card>
    );
  }

  // If social_links is a string, parse it. Handle potential null or undefined.
  let socialLinks = profile.social_links;
  if (typeof socialLinks === 'string' && socialLinks) {
    try {
      socialLinks = JSON.parse(socialLinks);
    } catch (e) {
      console.error("Failed to parse social_links JSON:", e, socialLinks);
      socialLinks = {}; // Default to an empty object on error
    }
  }

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
        <Typography variant="h5" component="div" gutterBottom>
            Company Profile
        </Typography>
      {profile.banner_url && (
        <CardMedia
          component="img"
          height="140"
          image={profile.banner_url}
          alt="Company Banner"
        />
      )}
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <img
            src={!imgError && profile.logo_url ? profile.logo_url : fallbackLogo}
            alt={!imgError && profile.logo_url ? "Company Logo" : "No Logo"}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              marginRight: 16,
              opacity: !imgError && profile.logo_url ? 1 : 0.5,
            }}
            onError={() => setImgError(true)}
          />
          <Typography variant="h5" component="div">
            {profile.company_name || 'Company Name Not Set'}
          </Typography>
        </Box>

        
        {profile.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                {profile.description}
            </Typography>
        )}
        {profile.industry && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Industry: {profile.industry}
            </Typography>
        )}

        {(profile.address || profile.city || profile.state || profile.country || profile.postal_code) && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Address: {[profile.address, profile.city, profile.state, profile.country, profile.postal_code].filter(Boolean).join(', ')}
            </Typography>
        )}

        {profile.website && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Website: <Link
              href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'primary.main',
                '&:visited': { color: 'secondary.main' }
              }}
            >{profile.website}</Link>
          </Typography>
        )}
        
        {/* Render social links only if they exist and have entries */}
        {socialLinks && typeof socialLinks === 'object' && Object.values(socialLinks).some(v => v) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">Social Links:</Typography>
            {Object.entries(socialLinks).map(([key, value]) =>
              value ? (
                <Typography key={key} variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}: <Link
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'primary.main',
                      '&:visited': { color: 'secondary.main' }
                    }}
                  >{value}</Link>
                </Typography>
              ) : null
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyProfile;