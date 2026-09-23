// src/api/routes/v1/blockRoutes.js
import express from 'express';
import authenticate from '../../middleware/authenticate.js';
import validate from '../../middleware/validate.js';
import * as blockController from '../../controllers/blockController.js';
import {
  createBlockSchema,
  updateBlockSchema,
  reorderBlocksSchema,
} from '../../validations/blockValidation.js';

const router = express.Router();

// Every route here requires a valid access token
router.use(authenticate);

router.get('/', blockController.listBlocks);
router.get('/:id', blockController.getBlock);
router.post('/', validate(createBlockSchema), blockController.createBlock);
router.put('/reorder', validate(reorderBlocksSchema), blockController.reorderBlocks);
router.put('/:id', validate(updateBlockSchema), blockController.updateBlock);
router.delete('/:id', blockController.deleteBlock);

export default router;