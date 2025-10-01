const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = '90d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn }); 
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Invalid token:', error.message);
    throw error; // Re-throw the error to be handled by the controller
  }
};

module.exports = { generateToken, verifyToken };