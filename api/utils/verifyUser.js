import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler, (401, 'Ei Kirjaauduttu Sisään'));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'Pääsy Estetty'));

    req.user = user;

    next();
  });
  console.log(req.cookies);
};
