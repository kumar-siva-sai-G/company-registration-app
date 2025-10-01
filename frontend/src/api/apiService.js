import { api } from './axios';

export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const verifyMobile = (otpData) => api.post('/auth/verify-mobile', otpData);
export const resendMobileOtp = (mobileData) => api.post('/auth/resend-otp', mobileData);

export const sendEmailOtp = (emailData) => api.post('/auth/send-email-otp', emailData);
export const verifyEmailOtp = (otpData) => api.post('/auth/verify-email-otp', otpData);

export const getCompanyProfile = () => api.get('/company/profile');
export const updateCompanyProfile = (profileData) => api.put('/company/profile', profileData);
export const uploadLogo = (formData) => api.post('/company/upload-logo', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const uploadBanner = (formData) => api.post('/company/upload-banner', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});