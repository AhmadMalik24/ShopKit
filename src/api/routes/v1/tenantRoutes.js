// src/api/routes/v1/tenantRoutes.js
import express from 'express';
import authenticate from '../../middleware/authenticate.js';
import validate from '../../middleware/validate.js';
import * as tenantController from '../../controllers/tenantController.js';
import * as templateController from '../../controllers/templateController.js';
import {
  updateTenantSchema,
  updateDomainSchema,
} from '../../validations/tenantValidation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get current tenant
router.get('/me', tenantController.getMyTenant);

// Update tenant branding/info
router.put('/me', validate(updateTenantSchema), tenantController.updateMyTenant);

// Apply a template (already existed)
router.post('/me/apply-template', templateController.applyTemplate);

// Connect/remove custom domain
router.post('/me/domain', validate(updateDomainSchema), tenantController.updateMyDomain);
router.delete('/me/domain', tenantController.removeMyDomain);

export default router;