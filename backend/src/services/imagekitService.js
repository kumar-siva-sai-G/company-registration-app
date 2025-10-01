const ImageKit = require('imagekit');
const fs = require('fs').promises; // Use the promise-based version of fs
require('dotenv').config();
const path = require('path');

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

if (!publicKey || !privateKey || !urlEndpoint) {
  const errorMessage = 'ImageKit is not configured. Please check your .env file for IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

async function uploadImage(filePath, folder = '') {
  try {
    // Use asynchronous file reading to avoid blocking the event loop.
    const fileBuffer = await fs.readFile(filePath);
    // Use path.basename for cross-platform compatibility (works with \ and / separators).
    const fileName = path.basename(filePath);

    const result = await imagekit.upload({
      file: fileBuffer,
      fileName,
      folder,
    });
    return result;
  } finally {
    // It's good practice to clean up the temporary file from the 'uploads/' directory.
    await fs.unlink(filePath);
  }
}

module.exports = {
  uploadImage,
};
