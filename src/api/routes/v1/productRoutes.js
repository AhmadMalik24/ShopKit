// src/api/routes/v1/productRoutes.js
import express from 'express';
import authenticate from '../../middleware/authenticate.js';
import validate from '../../middleware/validate.js';
import * as productController from '../../controllers/productController.js';
import {
  createProductSchema,
  updateProductSchema,
  reorderProductsSchema,
} from '../../validations/productValidation.js';

const router = express.Router();

router.use(authenticate);

router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);
router.post('/', validate(createProductSchema), productController.createProduct);
router.put('/reorder', validate(reorderProductsSchema), productController.reorderProducts);
router.put('/:id', validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;