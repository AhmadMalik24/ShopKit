// src/api/controllers/publicController.js
import * as publicService from '../services/publicService.js';

export async function getTenant(req, res) {
    try {
        const tenant = await publicService.getTenantInfo(req.tenant.id);
        return res.json({ success: true, data: tenant, error: null });
    } catch (error) {
        return res.status(404).json({ success: false, data: null, error: error.message });
    }
}

export async function getBlocks(req, res) {
    try {
        const blocks = await publicService.getPublicBlocks(req.tenant.id);
        return res.json({ success: true, data: blocks, error: null });
    } catch (error) {
        return res.status(500).json({ success: false, data: null, error: error.message });
    }
}

export async function getProducts(req, res) {
    try {
        const products = await publicService.getPublicProducts(req.tenant.id);
        return res.json({ success: true, data: products, error: null });
    } catch (error) {
        return res.status(500).json({ success: false, data: null, error: error.message });
    }
}