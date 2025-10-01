import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { registerUser, sendEmailOtp, verifyEmailOtp } from '../api/apiService';
import { Box, Button, TextField, Typography, Container, MenuItem, Grid } from '@mui/material';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm();
  const navigate = useNavigate();
  const [emailVerification, setEmailVerification] = useState({
    sent: false,
    verified: false,
    token: null,
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response, formData) => {
      toast.success("Registration successful! Please verify your mobile number.");
      sessionStorage.setItem('mobile_for_verification', formData.mobile_no);
      navigate('/verify-mobile');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed.');
    },
  });

  const onSubmit = (data) => {
    if (!emailVerification.verified) {
      toast.error('Please verify your email before registering.');
      return;
    }
    // Add the verification token to the form data
    mutation.mutate({ ...data, emailVerificationToken: emailVerification.token });
  };

  const handleSendEmailOtp = async () => {
    const email = getValues('email');
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    try {
      await sendEmailOtp({ email });
      toast.success('An 6-digit code has been sent to your email.');
      setEmailVerification(prev => ({ ...prev, sent: true }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyEmailOtp = async () => {
    const email = getValues('email');
    const emailOtp = getValues('emailOtp');
    if (!emailOtp) {
      toast.error('Please enter the 6-digit code.');
      return;
    }
    try {
      const response = await verifyEmailOtp({ email, otp: emailOtp });
      toast.success('Email verified successfully!');
      setEmailVerification({
        sent: true,
        verified: true,
        token: response.data.emailVerificationToken,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP.');
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 8 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Company Registration
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          {/* User Info Section */}
          <Box mb={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Full Name" {...register('full_name', { required: 'Full name is required' })} error={!!errors.full_name} helperText={errors.full_name?.message} fullWidth autoFocus />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                    select
                    label="Gender"
                    {...register('gender', { required: 'Gender is required' })}
                    defaultValue=""
                    error={!!errors.gender}
                    helperText={errors.gender?.message}
                    fullWidth
                >
                  <MenuItem value="m">Male</MenuItem>
                  <MenuItem value="f">Female</MenuItem>
                  <MenuItem value="o">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Company Name" {...register('company_name', { required: 'Company name is required' })} error={!!errors.company_name} helperText={errors.company_name?.message} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Industry / Company Type" {...register('industry', { required: 'Industry is required' })} error={!!errors.industry} helperText={errors.industry?.message} fullWidth />
              </Grid>
            </Grid>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" gutterBottom>Company Address</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField label="Street Address" {...register('address', { required: 'Address is required' })} fullWidth error={!!errors.address} helperText={errors.address?.message} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="City" {...register('city', { required: 'City is required' })} fullWidth error={!!errors.city} helperText={errors.city?.message} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="State/Province" {...register('state', { required: 'State is required' })} fullWidth error={!!errors.state} helperText={errors.state?.message} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Postal Code" {...register('postal_code', { required: 'Postal code is required' })} fullWidth error={!!errors.postal_code} helperText={errors.postal_code?.message} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Country" {...register('country', { required: 'Country is required' })} fullWidth error={!!errors.country} helperText={errors.country?.message} /></Grid>
            </Grid>
          </Box>

          <Box mb={4}>
            <Typography variant="h6" gutterBottom>Contact & Login</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={emailVerification.sent ? 6 : 8}>
                <TextField
                  label="Email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                  disabled={emailVerification.sent}
                />
              </Grid>
              {!emailVerification.verified && (
                <Grid item xs={12} sm={emailVerification.sent ? 6 : 4}>
                  <Button variant="outlined" onClick={handleSendEmailOtp} fullWidth disabled={emailVerification.sent}>
                    Verify Email
                  </Button>
                </Grid>
              )}
              {emailVerification.sent && !emailVerification.verified && (
                <>
                  <Grid item xs={12} sm={6}><TextField label="8-Digit Code" {...register('emailOtp', { required: true })} fullWidth /></Grid>
                  <Grid item xs={12} sm={6}><Button variant="contained" onClick={handleVerifyEmailOtp}>Verify Code</Button></Grid>
                </>
              )}
              {emailVerification.verified && <Grid item xs={12}><Typography color="green">Email Verified ✔️</Typography></Grid>}
              <Grid item xs={12} sm={emailVerification.verified ? 6 : 12}>
                <TextField label="Password" type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })} error={!!errors.password} helperText={errors.password?.message} fullWidth />
              </Grid>
              <Grid item xs={12} sm={emailVerification.verified ? 6 : 12}>
                <TextField label="Mobile Number" {...register('mobile_no', { required: 'Mobile number is required' })} error={!!errors.mobile_no} helperText={errors.mobile_no?.message} fullWidth />
                <input type="hidden" {...register('signup_type')} value="e" />
              </Grid>
            </Grid>
          </Box>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!emailVerification.verified || mutation.isPending}>
            {mutation.isPending ? 'Registering...' : 'Register'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;