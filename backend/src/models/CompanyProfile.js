const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  company_name: String,
  address: String,
  city: String,
  state: String,
  country: String,
  postal_code: String,
  website: String,
  logo_url: String,
  banner_url: String,
  industry: String,
  founded_date: Date,
  description: String,
  social_links: {
    linkedin: String,
    twitter: String,
    facebook: String,
  },
}, { timestamps: true });

const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);

module.exports = CompanyProfile;
