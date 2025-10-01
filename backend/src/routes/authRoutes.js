const express = require('express');
const { body } = require('express-validator');
const {
  register,
  sendEmailOtpController,
  verifyEmailOtpController,
  verifyMobileController,
  resendMobileOtpController,
  login,
  googleSignIn,
} = require('../controllers/authController');
const validate = require('../middleware/validation');
const router = express.Router();

// --- Email Verification ---
router.post(
  '/send-email-otp',
  validate([
    body('email').isEmail().withMessage('A valid email address is required'),
  ]),
  sendEmailOtpController
);

router.post(
  '/verify-email-otp',
  validate([
    body('email').isEmail().withMessage('A valid email address is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ]),
  verifyEmailOtpController
);

// --- Mobile Verification ---
router.post(
  '/verify-mobile',
  validate([
    body('mobile_no').notEmpty().withMessage('Mobile number is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ]),
  verifyMobileController
);

router.post(
  '/resend-otp',
  validate([
    body('mobile_no').notEmpty().withMessage('Mobile number is required'),
  ]),
  resendMobileOtpController
);


// --- Main Auth Flow ---
router.post(
  '/register',
  validate([
    body('emailVerificationToken').notEmpty().withMessage('Email verification token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ]),
  register
);

router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  login
);

router.post('/google-signin', googleSignIn);

module.exports = router;