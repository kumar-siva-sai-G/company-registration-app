// const admin = require('firebase-admin');
// const path = require('path');
//
// // Securely load the service account key from the path in the .env file
// const serviceAccountPath = path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);
// const serviceAccount = require(serviceAccountPath);
//
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
//
// module.exports = admin;
module.exports = {}; // Export an empty object to avoid breaking require statements