import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import userRoutes from './src/routes/user.route.js';
import authRoutes from './src/routes/auth.route.js';
import postRoutes from './src/routes/post.route.js';
import commentRoutes from './src/routes/comment.route.js';
import cookieParser from 'cookie-parser';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://let-s-blog-mu.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. Postman, curl, same-origin)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        /^https:\/\/let-s-blog.*\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  })
);

// Note: the cors middleware above already handles OPTIONS preflight
// requests automatically — no separate app.options() route is needed.

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cookieParser());

// ─── MongoDB ──────────────────────────────────────────────────────────────────
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 1,
      minPoolSize: 0,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.log('❌ MongoDB connection error:', err.message);
    isConnected = false;
    throw err;
  }
};

const connectMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
};

// ─── Rate limiting ────────────────────────────────────────────────────────────
// Brute-force protection on auth endpoints: max 20 attempts per IP per 15 min.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts from this IP. Please try again in 15 minutes.',
  },
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'API is running', timestamp: new Date() });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date() });
});

app.get('/api/debug', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    hasMongoUri: !!process.env.MONGO_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    timestamp: new Date(),
  });
});

app.use('/api/user', connectMiddleware, userRoutes);
app.use('/api/auth', authLimiter, connectMiddleware, authRoutes);
app.use('/api/post', connectMiddleware, postRoutes);
app.use('/api/comment', connectMiddleware, commentRoutes);

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({ success: false, message, statusCode });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
