const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
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
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
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
