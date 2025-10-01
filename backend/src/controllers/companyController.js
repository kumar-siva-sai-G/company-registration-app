const dbService = require('../services/dbService');
const imagekitService = require('../services/imagekitService');

async function createCompany(req, res, next) {
  try {
    const owner_id = req.user.userId;
    const { company_name, address, city, state, country, postal_code, website, logo_url, banner_url, industry, founded_date, description, social_links } = req.body;
    if (!company_name || !address || !city || !state || !country || !postal_code || !industry) {
      return res.status(400).json({ success: false, message: 'Missing required company fields.' });
    }
    const newCompanyProfile = await dbService.createCompanyProfile({
      owner_id,
      company_name,
      address,
      city,
      state,
      country,
      postal_code,
      website,
      logo_url,
      banner_url,
      industry,
      founded_date,
      description,
      social_links: social_links || null,
    });
    res.status(201).json({
      success: true,
      message: 'Company profile created successfully',
      data: { companyProfile: newCompanyProfile },
    });
  } catch (error) {
    next({ status: 500, message: 'Error creating company profile', error });
  }
}

async function getCompanyProfile(req, res, next) {
  try {
    const owner_id = req.user.userId;
    let profile = await dbService.getCompanyProfileByOwnerId(owner_id);
    console.log('getCompanyProfile owner_id:', owner_id);
    console.log('getCompanyProfile profile:', profile);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

async function updateCompanyProfile(req, res, next) {
  try {
    const owner_id = req.user.userId;
    const updates = req.body;

    // Filter out null, undefined, or empty string values from the updates
    const filteredUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    // Always stringify social_links if present
    if (filteredUpdates.social_links) {
      filteredUpdates.social_links = JSON.stringify(filteredUpdates.social_links);
    }

    const existingProfile = await dbService.getCompanyProfileByOwnerId(owner_id);

    if (existingProfile) {
      if (Object.keys(filteredUpdates).length === 0) {
        return res.status(200).json({ success: true, message: 'No valid fields provided to update.' });
      }
      await dbService.updateCompanyProfile(owner_id, filteredUpdates);
      res.status(200).json({ success: true, message: 'Company profile updated successfully' });
    } else {
      // If no profile exists for the user, it's better to return an error.
      // The client should use the create endpoint first.
      res.status(404).json({ success: false, message: 'Company profile not found. Please create one first.' });
    }
  } catch (error) {
    next({ status: 500, message: 'Error updating company profile', error });
  }
}

/**
 * A helper function to handle file uploads for company profiles.
 * @param {object} req - The Express request object.
 * @param {string} fileType - The type of file being uploaded ('logo' or 'banner').
 * @param {string} imagekitFolder - The folder to upload to in ImageKit.
 */
async function handleFileUpload(req, fileType, imagekitFolder) {
  const owner_id = req.user.userId;
  const file = req.file;
  if (!file) {
    throw { status: 400, message: 'No file uploaded' };
  }

  const result = await imagekitService.uploadImage(file.path, imagekitFolder);
  const url = result.url;
  const updateData = { [`${fileType}_url`]: url };

  const existingProfile = await dbService.getCompanyProfileByOwnerId(owner_id);
  if (existingProfile) {
    await dbService.updateCompanyProfile(owner_id, updateData);
  } else {
    // If no profile exists, create one with the new image URL.
    await dbService.createCompanyProfile({ owner_id, ...updateData });
  }
  return url;
}

async function uploadLogo(req, res, next) {
  try {
    const logo_url = await handleFileUpload(req, 'logo', 'logos');
    res.status(200).json({ success: true, message: 'Logo uploaded successfully', url: logo_url });
  } catch (error) {
    // Pass the error object directly to the error handling middleware
    next(error);
  }
}

async function uploadBanner(req, res, next) {
  try {
    const banner_url = await handleFileUpload(req, 'banner', 'banners');
    res.status(200).json({ success: true, message: 'Banner uploaded successfully', url: banner_url });
  } catch (error) {
    // Pass the error object directly to the error handling middleware
    next(error);
  }
}

module.exports = {
  createCompany,
  getCompanyProfile,
  updateCompanyProfile,
  uploadLogo,
  uploadBanner,
};