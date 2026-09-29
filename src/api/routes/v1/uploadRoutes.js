// src/api/routes/v1/uploadRoutes.js
import express from 'express';
import authenticate from '../../middleware/authenticate.js';
import * as uploadController from '../../controllers/uploadController.js';

const router = express.Router();

router.use(authenticate);

router.post('/presign', uploadController.presignUpload);
router.post('/delete', uploadController.deleteUpload);

export default router;