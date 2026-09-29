// src/api/routes/v1/oauthRoutes.js
import express from 'express';
import {
  initiateGoogleAuth,
  handleGoogleCallback,
} from '../../controllers/oauthController.js';

const router = express.Router();

// Public routes — no auth required
router.get('/google', initiateGoogleAuth);
router.get('/google/callback', handleGoogleCallback);

export default router;