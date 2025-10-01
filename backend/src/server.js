const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const http = require('http');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const connectDB = require('./config/db');
const errorHandler = require('./utils/errorHandler');

// Connect to database
connectDB();

const app = express();
require('dotenv').config();
require('dotenv').config({ path: './sendgrid.env' });

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors());
app.use(helmet());
app.use(compression());

// Disable caching for all API responses
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});