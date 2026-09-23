import jwt from 'jsonwebtoken';
import { jwtConfig, expireIn } from '../config/auth.js';

const generateAccessToken = (payload) => {
  return jwt.sign(
    { ...payload, type: 'access' },
    jwtConfig.accessToken,
    { expiresIn: expireIn.accessToken }
  );
};

const generateRefreshToken = (payload) => {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    jwtConfig.refreshToken,
    { expiresIn: expireIn.refreshToken }
  );
};

const generateResetPasswordToken = (payload) => {
  return jwt.sign(
    { ...payload, type: 'reset_password' },
    jwtConfig.resetPasswordToken,
    { expiresIn: expireIn.resetPasswordToken }
  );
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  generateResetPasswordToken,
  verifyToken,
};