const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expires_at: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

// To automatically delete documents after they expire
otpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
