// src/api/routes/v1/uploadRoutes.js
import express from 'express';
import authenticate from '../../middleware/authenticate.js';
import { uploadLimiter } from '../../middleware/rateLimiter.js';
import * as uploadController from '../../controllers/uploadController.js';

const router = express.Router();

router.use(authenticate);

router.post('/presign', uploadLimiter, uploadController.presignUpload);
router.post('/delete', uploadLimiter, uploadController.deleteUpload);

export default router;