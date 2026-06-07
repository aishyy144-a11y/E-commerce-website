const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Permissive CORS for development
app.use(cors({
  origin: true, // This allows any origin that makes the request
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(cookieParser());

// Routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Database connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
mongoose.connect(mongoURI, {
  maxPoolSize: 20,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: `API route ${req.originalUrl} not found` });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
