const User = require('../models/User');
const CompanyProfile = require('../models/CompanyProfile');
const Otp = require('../models/Otp');

// --- User Functions ---

async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function getUserByMobile(mobileNumber) {
  return User.findOne({ mobile_no: mobileNumber });
}

async function getUserById(userId) {
  return User.findById(userId);
}

async function createUser(userData) {
  const user = new User(userData);
  await user.save();
  return user; // Returning the full user object is more idiomatic for Mongoose
}

async function updateUser(userId, updates) {
  // Mongoose's findByIdAndUpdate by default returns the document *before* the update.
  // Use { new: true } to return the updated document.
  return User.findByIdAndUpdate(userId, updates, { new: true });
}

// --- Company Profile Functions ---

async function getCompanyProfileByOwnerId(ownerId) {
  return CompanyProfile.findOne({ owner_id: ownerId });
}

async function updateCompanyProfile(ownerId, updates) {
  return CompanyProfile.findOneAndUpdate({ owner_id: ownerId }, updates, { new: true });
}

async function createCompanyProfile(profileData) {
  const profile = new CompanyProfile(profileData);
  await profile.save();
  return profile;
}

// --- OTP Functions ---

async function createOrUpdateOtp(email, otp, expires_at) {
  // Use findOneAndUpdate with upsert to either create a new OTP or update an existing one.
  return Otp.findOneAndUpdate(
    { email },
    { otp, expires_at },
    { upsert: true, new: true }
  );
}

async function getOtpByEmail(email) {
  return Otp.findOne({ email });
}

async function deleteOtp(email) {
  return Otp.deleteOne({ email });
}

module.exports = {
  getUserByEmail,
  getUserByMobile,
  getUserById,
  createUser,
  updateUser,
  createCompanyProfile,
  getCompanyProfileByOwnerId,
  updateCompanyProfile,
  createOrUpdateOtp,
  getOtpByEmail,
  deleteOtp,
};
