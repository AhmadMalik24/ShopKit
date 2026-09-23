// src/api/routes/v1/templateRoutes.js
import express from 'express';
import * as templateController from '../../controllers/templateController.js';

const router = express.Router();

// Public — no auth required
router.get('/', templateController.listTemplates);
router.get('/:slug', templateController.getTemplate);

export default router;