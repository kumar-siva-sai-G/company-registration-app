const sgMail = require('@sendgrid/mail');

/**
 * Configure SendGrid and validate environment variables.
 */
const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.EMAIL_FROM;

if (!apiKey || !fromEmail) {
  const errorMessage = 'Email service is not configured. Please check your .env file for SENDGRID_API_KEY and EMAIL_FROM.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}
sgMail.setApiKey(apiKey);

const sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: { name: 'Your App Name', email: fromEmail },
    to: to,
    subject: `Welcome, ${name}!`,
    html: `
      <h1>Welcome!</h1>
      <p>Thank you for registering. Your account is active and you can log in now.</p>
      <br>
      <p>If you did not create this account, please click the link below to secure your email address:</p>
      <a href="https://your-app.com/report-unauthorized-account?email=${encodeURIComponent(to)}">This wasn't me</a>
      <br>
      <p>Thanks,</p>
      <p>The Your App Name Team</p>
    `,
  };

  try {
    await sgMail.send(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email via SendGrid:', JSON.stringify(error, null, 2));
    // We don't throw an error here because registration itself was successful.
    // Failing to send a welcome email shouldn't fail the whole registration process.
  }
};

const sendOtpEmail = async (to, otp) => {
  console.log('[sendOtpEmail] - Preparing to send OTP email.');
  console.log(`[sendOtpEmail] - Recipient: ${to}`);
  console.log(`[sendOtpEmail] - From Email: ${fromEmail}`);
  console.log(`[sendOtpEmail] - API Key Loaded: ${apiKey ? `Yes, starts with ${apiKey.substring(0, 5)}` : 'No'}`);

  const mailOptions = {
    from: { name: 'Your App Name', email: fromEmail },
    to: to,
    subject: 'Your One-Time Password (OTP)',
    html: `
      <h1>Email Verification</h1>
      <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
      <br>
      <p>If you did not request this, please ignore this email.</p>
      <br>
      <p>Thanks,</p>
      <p>The Your App Name Team</p>
    `,
  };

  try {
    console.log('[sendOtpEmail] - Calling sgMail.send().');
    await sgMail.send(mailOptions);
    console.log('[sendOtpEmail] - sgMail.send() executed without throwing an error.');
  } catch (error) {
    console.error('Error sending OTP email via SendGrid:', JSON.stringify(error, null, 2));
    // In this case, we should throw the error because OTP is critical for registration
    throw new Error('Failed to send OTP email.');
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOtpEmail,
};