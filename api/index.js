import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('connected to db');
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(5002, () => {
  console.log('serveri on käynnissä portilla 5002');
});
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'internal server error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
