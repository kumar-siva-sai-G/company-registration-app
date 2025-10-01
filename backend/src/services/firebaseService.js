const admin = require('../config/firebase');
const twilioService = require('./twilioService');

async function sendSmsOtp(mobileNumber) {
  // This function was a placeholder. It is now implemented using the Twilio service.
  // Firebase Admin SDK does not directly send SMS OTPs to arbitrary numbers.
  // We are using our existing Twilio service for this.
  try {
    return await twilioService.startVerification(mobileNumber);
  } catch (error) {
    console.error(`Failed to send SMS OTP to ${mobileNumber} via firebaseService wrapper:`, error);
    throw error; // Re-throw the original error to be handled by the caller
  }
}

module.exports = {
  sendSmsOtp,
};