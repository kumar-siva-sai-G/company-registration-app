const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifySid) {
  const errorMessage = 'Twilio credentials are not configured. Please check your .env file for TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_VERIFY_SERVICE_SID.';
  console.error(errorMessage);
  // Throwing an error here will prevent the application from starting without proper configuration.
  throw new Error(errorMessage);
}

const client = twilio(accountSid, authToken);

/**
 * Sends a verification OTP to a phone number using Twilio Verify.
 * @param {string} phoneNumber The user's phone number in E.164 format (e.g., +917981404804).
 */
async function startVerification(phoneNumber) {
  try {
    const verification = await client.verify.v2.services(verifySid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });
    return verification.status; // Should be "pending"
  } catch (error) {
    console.error(`Error starting Twilio verification for ${phoneNumber}:`, error.message);
    // Provide more specific error feedback
    if (error.code === 60200) { // Invalid parameter
        throw new Error('Invalid phone number provided for verification.');
    }
    // You can add more specific error codes from Twilio as needed.
    // https://www.twilio.com/docs/api/errors
    throw new Error('Failed to send verification code.');
  }
}

/**
 * Checks the OTP provided by the user.
 * @param {string} phoneNumber The user's phone number in E.164 format.
 * @param {string} code The OTP code entered by the user.
 * @returns {Promise<boolean>} True if the code is valid, false otherwise.
 */
async function checkVerification(phoneNumber, code) {
  try {
    const verification_check = await client.verify.v2.services(verifySid)
      .verificationChecks
      .create({ to: phoneNumber, code: code });
    return verification_check.status === 'approved';
  } catch (error) {
    if (error.status !== 404) {
      console.error(`Error checking verification for ${phoneNumber}:`, error);
    }
    return false;
  }
}

module.exports = {
  startVerification,
  checkVerification,
};