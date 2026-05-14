// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const authRoutes = require('./routes/auth');

// const app = express();

// // ── CORS CONFIG ───────────────────────────────────────────
// app.use(cors({
//   origin: [
//     'http://localhost:5173',
//     'http://localhost:3000',
//     'https://bipbilling.co.in',
//     'https://www.bipbilling.co.in',
//     'https://your-frontend.vercel.app'
//   ],
//   credentials: true
// }));

// // ── MIDDLEWARE ────────────────────────────────────────────
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ── ROUTES ────────────────────────────────────────────────
// app.use('/api/auth', authRoutes);

// // ── HEALTH CHECK ──────────────────────────────────────────
// app.get('/', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: '🚀 Auth API is running!',
//     status: 'OK'
//   });
// });

// // ── 404 HANDLER ───────────────────────────────────────────
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });

// // ── ERROR HANDLER ─────────────────────────────────────────
// app.use((err, req, res, next) => {
//   console.error('❌ Server Error:', err.stack);

//   res.status(500).json({
//     success: false,
//     message: 'Internal server error',
//     error: err.message
//   });
// });

// // ── MONGODB CONNECTION ───────────────────────────────────
// const PORT = process.env.PORT || 5000;

// // ── MONGODB CONNECTION ───────────────────────────────────
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('✅ MongoDB Atlas Connected Successfully');

//     // Start local server
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });

//   })
//   .catch((err) => {
//     console.error('❌ MongoDB Connection Failed:', err.message);
//   });

// // ── EXPORT APP FOR VERCEL ─────────────────────────────────
// module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// ── CORS CONFIG ───────────────────────────────────────────
app.use(cors({
  origin: [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://sachin-login-repo.vercel.app',
  'https://bipbilling.co.in',
  'https://www.bipbilling.co.in'
],
  credentials: true
}));

// ── MIDDLEWARE ────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── HEALTH CHECK ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Auth API is running!',
    status: 'OK'
  });
});

// ── 404 HANDLER ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ── ERROR HANDLER ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// ── MONGODB CONNECTION ───────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas Connected Successfully');

    // ✅ FIX: Start the server ONLY after DB connects
    // This ensures no requests are handled before DB is ready
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1); // Exit if DB fails — no point running without DB
  });

// ── EXPORT APP FOR VERCEL (serverless) ───────────────────
module.exports = app;

// At the bottom of server.js
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app; // Vercel uses this