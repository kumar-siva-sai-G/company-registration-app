import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCompanyProfile, updateCompanyProfile } from '../api/apiService';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Grid,
  Paper,
} from '@mui/material';
import { toast } from 'react-toastify';
import ImageUploader from '../components/ImageUploader';
import { useForm, Controller } from 'react-hook-form';

const Settings = () => {
  const queryClient = useQueryClient();

  const { data: apiResponse, isLoading, isError, error: queryError } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: async () => {
      const response = await getCompanyProfile();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const profile = apiResponse?.data;

  const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm({
    defaultValues: {
      company_name: '', description: '', industry: '', website: '',
      address: '', city: '', state: '', country: '', postal_code: '',
      founded_date: '', logo_url: '', banner_url: '',
      social_links: { linkedin: '', twitter: '', facebook: '', youtube: '' },
    },
  });

  useEffect(() => {
    if (profile) {
      let socialLinks = profile.social_links || {};
      if (typeof socialLinks === 'string' && socialLinks) {
        try { socialLinks = JSON.parse(socialLinks); } catch (e) { socialLinks = {}; }
      }
      reset({
        ...profile,
        founded_date: profile.founded_date ? profile.founded_date.split('T')[0] : '',
        social_links: {
          linkedin: socialLinks.linkedin || '',
          twitter: socialLinks.twitter || '',
          facebook: socialLinks.facebook || '',
          youtube: socialLinks.youtube || '',
        },
      });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: updateCompanyProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.response?.data?.message || error.message}`);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  
  if (isLoading) return <Container><CircularProgress /><Typography>Loading settings...</Typography></Container>;
  if (isError && queryError.response?.status !== 404) return <Typography>Error loading profile: {queryError.message}</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>Company Settings</Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant="h6">Company Details</Typography></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Company Name" {...register('company_name')} error={!!errors.company_name} helperText={errors.company_name?.message} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Industry" {...register('industry')} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={4} label="Description" {...register('description')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Website" type="url" {...register('website')} helperText="Must be a full URL, e.g., https://example.com" /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Founded Date" type="date" {...register('founded_date')} InputLabelProps={{ shrink: true }} /></Grid>

            <Grid item xs={12}><Typography variant="h6" sx={{ mt: 2 }}>Address</Typography></Grid>
            <Grid item xs={12}><TextField fullWidth label="Street Address" {...register('address')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="City" {...register('city')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="State/Province" {...register('state')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Postal Code" {...register('postal_code')} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Country" {...register('country')} /></Grid>

            <Grid item xs={12}><Typography variant="h6" sx={{ mt: 2 }}>Social Media</Typography></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="LinkedIn URL" {...register('social_links.linkedin')} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Twitter URL" {...register('social_links.twitter')} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="Facebook URL" {...register('social_links.facebook')} /></Grid>
            <Grid item xs={12} sm={4}><TextField fullWidth label="YouTube URL" {...register('social_links.youtube')} /></Grid>

            <Grid item xs={12}><Typography variant="h6" sx={{ mt: 2 }}>Branding</Typography></Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>Logo</Typography>
              <Controller
                name="logo_url"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    type="logo"
                    currentImage={field.value}
                    onUploadSuccess={(url) => setValue('logo_url', url, { shouldDirty: true })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>Banner</Typography>
               <Controller
                name="banner_url"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    type="banner"
                    currentImage={field.value}
                    onUploadSuccess={(url) => setValue('banner_url', url, { shouldDirty: true })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Settings;