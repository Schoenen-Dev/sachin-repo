const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-frontend.vercel.app',
    'https://bipbilling.co.in'
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Auth API is running!',
    status: 'OK'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

// ── MongoDB Connection ────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });

// ── EXPORT APP FOR VERCEL ─────────────────────────────────
module.exports = app;