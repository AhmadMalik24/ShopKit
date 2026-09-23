// src/api/routes/v1/authRoutes.js
import express from 'express';
import { registerSchema, loginSchema } from '../../validations/authValidation.js';
import validate from '../../middleware/validate.js';
import authenticate from '../../middleware/authenticate.js';
import { register, login, refreshToken, logout, me } from '../../controllers/authController.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticate, me);
export default router;