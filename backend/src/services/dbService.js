const pool = require('../config/db');

// --- User Functions ---

async function getUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function getUserByMobile(mobileNumber) {
  const [rows] = await pool.query('SELECT * FROM users WHERE mobile_no = ?', [mobileNumber]);
  return rows[0];
}

async function getUserById(userId) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
  return rows[0];
}

async function createUser(userData) {
  const fields = Object.keys(userData);
  const values = Object.values(userData);
  const placeholders = fields.map(() => '?').join(', ');

  const [result] = await pool.query(
    `INSERT INTO users (${fields.join(', ')}) VALUES (${placeholders})`,
    values
  );
  return result.insertId;
}

async function updateUser(userId, updates) {
    const allowedFields = ['is_email_verified', 'email_otp', 'email_otp_expires', 'is_mobile_verified'];
    
    const fieldsToUpdate = Object.keys(updates)
      .filter(key => allowedFields.includes(key) && updates[key] !== undefined);
  
    if (fieldsToUpdate.length === 0) {
      return; // No valid fields to update
    }
  
    const setClauses = fieldsToUpdate.map(field => `${field} = ?`);
    const values = fieldsToUpdate.map(field => updates[field]);
  
    const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`;
    await pool.query(sql, [...values, userId]);
}

// --- Company Profile Functions ---

async function getCompanyProfileByOwnerId(ownerId) {
  const [rows] = await pool.query('SELECT * FROM companyProfile WHERE owner_id = ?', [ownerId]);
  return rows[0];
}

async function updateCompanyProfile(ownerId, updates) {
  const allowedFields = ['company_name', 'address', 'city', 'state', 'country', 'postal_code', 'website', 'logo_url', 'banner_url', 'industry', 'founded_date', 'description', 'social_links'];
  
  const fieldsToUpdate = Object.keys(updates)
    .filter(key => allowedFields.includes(key) && updates[key] !== null && updates[key] !== undefined);

  if (fieldsToUpdate.length === 0) {
    return; // No valid fields to update
  }

  const setClauses = fieldsToUpdate.map(field => `${field} = ?`);
  const values = fieldsToUpdate.map(field => updates[field]);

  const sql = `UPDATE companyProfile SET ${setClauses.join(', ')} WHERE owner_id = ?`;
  await pool.query(sql, [...values, ownerId]);
}

async function createCompanyProfile(profileData) {
  const filteredProfileData = Object.fromEntries(Object.entries(profileData).filter(([_, v]) => v !== undefined && v !== null));
  const fields = Object.keys(filteredProfileData);
  const values = Object.values(filteredProfileData);
  const placeholders = fields.map(() => '?').join(', ');
  const [result] = await pool.query(
    `INSERT INTO companyProfile (${fields.join(', ')}) VALUES (${placeholders})`,
    values
  );
  return result.insertId;
}

// --- OTP Functions ---

async function createOrUpdateOtp(email, otp, expires_at) {
    const sql = `
        INSERT INTO otp_verifications (email, otp, expires_at)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE otp = ?, expires_at = ?;
    `;
    await pool.query(sql, [email, otp, expires_at, otp, expires_at]);
}

async function getOtpByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM otp_verifications WHERE email = ?', [email]);
    return rows[0];
}

async function deleteOtp(email) {
    await pool.query('DELETE FROM otp_verifications WHERE email = ?', [email]);
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

  // OTP functions
  createOrUpdateOtp,
  getOtpByEmail,
  deleteOtp,
};