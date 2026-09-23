import express from 'express';
import authenticate from '../../middleware/authenticate.js';
import validate from '../../middleware/validate.js';
import * as orderController from '../../controllers/orderController.js';
import { updateOrderStatusSchema } from '../../validations/orderValidation.js';

const router = express.Router();

router.use(authenticate);

router.get('/', orderController.listOrders);
router.get('/:id', orderController.getOrder);
router.put('/:id/status', validate(updateOrderStatusSchema), orderController.updateOrderStatus);

export default router;