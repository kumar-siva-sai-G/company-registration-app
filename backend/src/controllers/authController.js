const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const dbService = require('../services/dbService');
const { sendWelcomeEmail, sendOtpEmail } = require('../services/emailService');
const twilioService = require('../services/twilioService'); // Enabling Twilio
const crypto = require('crypto');

// Email OTP Controller
async function sendEmailOtpController(req, res, next) {
    try {
        const { email } = req.body;
        const existingUser = await dbService.getUserByEmail(email);
        if (existingUser && existingUser.is_email_verified) {
            return res.status(409).json({ message: 'This email is already registered.' });
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await dbService.createOrUpdateOtp(email, otp, otpExpires);
        await sendOtpEmail(email, otp);
        res.status(200).json({ success: true, message: 'An OTP has been sent to your email.' });
    } catch (error) {
        console.error('[sendEmailOtpController] Error:', error);
        next(error);
    }
}

// Verify Email OTP Controller
async function verifyEmailOtpController(req, res, next) {
    try {
        const { email, otp } = req.body;
        const otpData = await dbService.getOtpByEmail(email);
        if (!otpData || otpData.otp !== otp || new Date() > new Date(otpData.expires_at)) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        const emailVerificationToken = jwt.generateToken({ email }, '15m');
        await dbService.deleteOtp(email);
        res.status(200).json({ 
            success: true, 
            message: 'Email verified successfully.',
            emailVerificationToken: emailVerificationToken 
        });
    } catch (error) {
        console.error('[verifyEmailOtpController] Error:', error);
        next(error);
    }
}

// Final Registration Controller
async function register(req, res, next) {
    try {
        const { emailVerificationToken, password, full_name, gender, mobile_no, company_name, industry, address, city, state, country, postal_code } = req.body;
        if (!emailVerificationToken) {
            return res.status(401).json({ message: 'Email verification token is missing.' });
        }
        const decoded = jwt.verifyToken(emailVerificationToken);
        const email = decoded.email;
        if (!email) {
            return res.status(401).json({ message: 'Invalid email verification token.' });
        }
        const existingUser = await dbService.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await dbService.createUser({
            email,
            password: hashedPassword,
            full_name,
            gender,
            mobile_no,
            signup_type: 'e',
            is_email_verified: true,
            is_mobile_verified: false, // Mobile is not verified yet
        });
        if (company_name) {
            await dbService.createCompanyProfile({ owner_id: userId, company_name, industry, address, city, state, country, postal_code });
        }
        
        // Automatically send the first mobile OTP after registration
        await twilioService.startVerification(mobile_no);

        await sendWelcomeEmail(email, full_name);
        res.status(201).json({
            success: true,
            message: "Registration successful. An OTP has been sent to your mobile for verification.",
            data: { userId }
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Email verification session has expired. Please verify your email again.' });
        }
        console.error('Registration process failed:', error);
        next(error);
    }
}

// --- Mobile Verification Controllers ---
async function verifyMobileController(req, res, next) {
    try {
        const { mobile_no, otp } = req.body;
        const isCorrect = await twilioService.checkVerification(mobile_no, otp);

        if (!isCorrect) {
            return res.status(400).json({ message: 'Invalid or expired mobile OTP.' });
        }

        // OTP is correct, update the user record
        const user = await dbService.getUserByMobile(mobile_no); // Need to create this function
        if (!user) {
            return res.status(404).json({ message: 'User not found for this mobile number.' });
        }

        await dbService.updateUser(user.id, { is_mobile_verified: true });

        res.status(200).json({ success: true, message: 'Mobile number verified successfully.' });

    } catch (error) {
        console.error('[verifyMobileController] Error:', error);
        next(error);
    }
}

async function resendMobileOtpController(req, res, next) {
    try {
        const { mobile_no } = req.body;
        await twilioService.startVerification(mobile_no);
        res.status(200).json({ success: true, message: 'A new OTP has been sent to your mobile.' });
    } catch (error) {
        console.error('[resendMobileOtpController] Error:', error);
        next(error);
    }
}

// --- Login Controllers ---
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await dbService.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.generateToken({ userId: user.id, email: user.email });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            data: {
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    mobile_no: user.mobile_no,
                    gender: user.gender,
                    // Add any other user fields you want to return
                },
            },
        });
    } catch (error) {
        console.error('[login] Error:', error);
        next(error);
    }
}

async function googleSignIn(req, res, next) {
    // ... (implementation is correct)
}

module.exports = {
    register,
    sendEmailOtpController,
    verifyEmailOtpController,
    verifyMobileController,
    resendMobileOtpController,
    login,
    googleSignIn,
};