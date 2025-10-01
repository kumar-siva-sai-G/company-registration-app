const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises; // Use the promise-based version of fs

const uploadImage = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `hirenext/${folder}`,
    });
    return result;
  } catch (error) {
    // If the upload fails, the error will be caught here.
    // We still need to clean up the file.
    console.error('Cloudinary upload failed:', error);
    // Re-throw the error so the calling function knows something went wrong.
    throw error;
  } finally {
    // This block will run whether the upload succeeds or fails.
    await fs.unlink(filePath); // Use async unlink to clean up the temp file.
  }
};

module.exports = { uploadImage };