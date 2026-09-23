// src/api/controllers/tenantController.js
import * as tenantService from '../services/tenantService.js';

export async function getMyTenant(req, res) {
    try {
        const tenant = await tenantService.getTenantWithOwner(req.user.tenant_id);
        return res.json({ success: true, data: tenant, error: null });
    } catch (error) {
        return res.status(404).json({ success: false, data: null, error: error.message });
    }
}

export async function updateMyTenant(req, res) {
    try {
        const tenant = await tenantService.updateTenant(
            req.user.tenant_id,
            req.body
        );
        return res.json({ success: true, data: tenant, error: null });
    } catch (error) {
        return res.status(400).json({ success: false, data: null, error: error.message });
    }
}

export async function updateMyDomain(req, res) {
    try {
        const tenant = await tenantService.setCustomDomain(
            req.user.tenant_id,
            req.body.custom_domain
        );
        return res.json({ success: true, data: tenant, error: null });
    } catch (error) {
        return res.status(400).json({ success: false, data: null, error: error.message });
    }
}

export async function removeMyDomain(req, res) {
    try {
        const tenant = await tenantService.clearCustomDomain(req.user.tenant_id);
        return res.json({ success: true, data: tenant, error: null });
    } catch (error) {
        return res.status(400).json({ success: false, data: null, error: error.message });
    }
}