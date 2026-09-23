// src/api/routes/v1/index.js
import express from 'express';
import authRoutes from './authRoutes.js';
import templateRoutes from './templateRoutes.js';
import tenantRoutes from './tenantRoutes.js';
import blockRoutes from './blockRoutes.js';
import publicRoutes from './publicRoutes.js';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';



const router = express.Router();

router.use('/auth', authRoutes);
router.use('/templates', templateRoutes);
router.use('/tenants', tenantRoutes);
router.use('/blocks', blockRoutes);
router.use('/public', publicRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/tenants', tenantRoutes);

export default router;