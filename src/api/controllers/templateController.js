// src/api/controllers/templateController.js
import * as templateService from '../services/templateService.js';

export async function listTemplates(req, res) {
    try {
        const templates = await templateService.listTemplates(req.query.category);
        return res.json({ success: true, data: templates, error: null });
    } catch (error) {
        return res.status(500).json({ success: false, data: null, error: error.message });
    }
}

export async function getTemplate(req, res) {
    try {
        const template = await templateService.getTemplateBySlug(req.params.slug);
        return res.json({ success: true, data: template, error: null });
    } catch (error) {
        return res.status(404).json({ success: false, data: null, error: error.message });
    }
}

export async function applyTemplate(req, res) {
    try {
        const { template_slug } = req.body;
        if (!template_slug) {
            return res.status(400).json({
                success: false,
                data: null,
                error: 'template_slug is required',
            });
        }

        const result = await templateService.applyTemplateToTenant(
            req.user.tenant_id,
            template_slug
        );

        return res.json({ success: true, data: result, error: null });
    } catch (error) {
        return res.status(400).json({
            success: false,
            data: null,
            error: error.message,
        });
    }
}