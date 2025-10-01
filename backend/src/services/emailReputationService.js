const axios = require('axios');
const API_KEY = process.env.ABSTRACT_API_KEY;

async function verifyEmailReputation(email) {
  try {
    const response = await axios.get(
      `https://emailreputation.abstractapi.com/v1/?api_key=${API_KEY}&email=${encodeURIComponent(email)}`
    );
    return response.data;
  } catch (error) {
    // Swallowing errors here can hide critical issues (e.g., invalid API key, network problems).
    // It's better to log the error and let the caller handle it.
    console.error(`Email reputation check failed for ${email}:`, error.message);
    throw new Error('Failed to verify email reputation.');
  }
}

module.exports = { verifyEmailReputation };
