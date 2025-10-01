const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile_no: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple documents to have a null value for mobile_no
  },
  is_email_verified: {
    type: Boolean,
    default: false,
  },
  is_mobile_verified: {
    type: Boolean,
    default: false,
  },
  email_otp: String,
  email_otp_expires: Date,
  mobile_otp: String,
  mobile_otp_expires: Date,
  google_id: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
