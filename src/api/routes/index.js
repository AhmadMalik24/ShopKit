import express from 'express';
import routesV1 from './v1/index.js';
import { globalLimiter } from '../middleware/rateLimiter.js';
const router = express.Router();

router.use('/v1', globalLimiter, routesV1);

export default router;