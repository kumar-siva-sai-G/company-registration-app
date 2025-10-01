const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const companyController = require('../controllers/companyController');
const validate = require('../middleware/validation');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/register',
  authMiddleware,
  validate([
    body('company_name').notEmpty().withMessage('Company name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('postal_code').notEmpty().withMessage('Postal code is required'),
    body('industry').notEmpty().withMessage('Industry is required'),
  ]),
  companyController.createCompany
);

router.get('/profile', authMiddleware, companyController.getCompanyProfile);

router.put(
  '/profile',
  authMiddleware,
  validate([]),
  companyController.updateCompanyProfile
);

router.post('/upload-logo', authMiddleware, upload.single('logo'), companyController.uploadLogo);

router.post('/upload-banner', authMiddleware, upload.single('banner'), companyController.uploadBanner);

module.exports = router;