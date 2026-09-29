// src/api/routes/v1/authRoutes.js
import express from 'express';
import { registerSchema, loginSchema } from '../../validations/authValidation.js';
import validate from '../../middleware/validate.js';
import authenticate from '../../middleware/authenticate.js';
import { register, login, refreshToken, logout, me } from '../../controllers/authController.js';
import {
  registerLimiter,
  loginLimiter,
  refreshLimiter,
} from '../../middleware/rateLimiter.js';
const router = express.Router();

router.post('/register', registerLimiter, validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/refresh-token', refreshLimiter, refreshToken);
router.post('/logout', logout);
router.get('/me', authenticate, me);
export default router;