import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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

app.listen(5002, () => {
  console.log('serveri on käynnissä portilla 5002');
});
