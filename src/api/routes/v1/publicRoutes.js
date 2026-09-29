// src/api/routes/v1/publicRoutes.js
import express from 'express';
import tenantResolver from '../../middleware/tenantResolver.js';
import * as publicController from '../../controllers/publicController.js';
import * as orderController from '../../controllers/orderController.js';
import validate from '../../middleware/validate.js';
import { createOrderSchema } from '../../validations/orderValidation.js';
import { publicOrderLimiter } from '../../middleware/rateLimiter.js';
const router = express.Router();

// Every route in this file first resolves the tenant from the header/query
router.use(tenantResolver);

router.get('/tenant', publicController.getTenant);
router.get('/blocks', publicController.getBlocks);
router.get('/products', publicController.getProducts);

// Only add if you have order creation
if (publicController.createOrder) {
  router.post('/orders', publicOrderLimiter, publicController.createOrder);
}

export default router;