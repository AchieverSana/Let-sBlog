import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/user.route.js';
import authRoutes from './src/routes/auth.route.js';
import postRoutes from './src/routes/post.route.js';
import commentRoutes from './src/routes/comment.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  })
);

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

app.use(express.json());
app.use(cookieParser());

const connectMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
};

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date() });
});

app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Debug info',
    nodeEnv: process.env.NODE_ENV,
    hasMongoEnv: !!process.env.MONGO_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    timestamp: new Date(),
  });
});

app.use('/api/user', connectMiddleware, userRoutes);
app.use('/api/auth', connectMiddleware, authRoutes);
app.use('/api/post', connectMiddleware, postRoutes);
app.use('/api/comment', connectMiddleware, commentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

export default app;
