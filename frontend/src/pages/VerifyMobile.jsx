import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { verifyMobile, resendMobileOtp } from '../api/apiService';
import { Box, Button, Typography, Container } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import OtpInput from '../components/OtpInput';

const VerifyMobile = () => {
  const { handleSubmit, formState: { errors }, control } = useForm();
  const navigate = useNavigate();
  const mobileNumber = sessionStorage.getItem('mobile_for_verification');
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    if (!mobileNumber) {
      toast.error("Could not find your mobile number. Please try registering again.");
      navigate('/register');
    }
  }, [mobileNumber, navigate]);

  useEffect(() => {
    const timer = resendCooldown > 0 && setInterval(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const resendMutation = useMutation({
    mutationFn: resendMobileOtp,
    onSuccess: () => toast.success('A new OTP has been sent.'),
    onError: () => toast.error('Failed to resend OTP.'),
  });

  const mutation = useMutation({
    mutationFn: verifyMobile,
    onSuccess: (data) => {
      toast.success(data.data.message);
      sessionStorage.removeItem('mobile_for_verification');
      // After successful verification, navigate to the login page.
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'OTP verification failed.');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ mobile_no: mobileNumber, otp: data.otp });
  };

  const handleResend = () => {
    if (resendCooldown === 0) {
      resendMutation.mutate({ mobile_no: mobileNumber });
      setResendCooldown(60); // Reset cooldown
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Verify Your Mobile Number
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          An OTP has been sent to <strong>{mobileNumber}</strong>. Please enter the 6-digit code below.
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3, width: '100%' }}>
          <Controller
            name="otp"
            control={control}
            rules={{ required: 'OTP is required', minLength: { value: 6, message: 'Please enter all 6 digits.' } }}
            render={({ field }) => <OtpInput length={6} onChange={field.onChange} />}
          />
          {errors.otp && (
            <Typography color="error" variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
              {errors.otp.message}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={mutation.isPending}>
            {mutation.isPending ? 'Verifying...' : 'Verify'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={handleResend}
            disabled={resendCooldown > 0 || resendMutation.isPending}
            sx={{ mt: 1 }}
          >
            {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default VerifyMobile;