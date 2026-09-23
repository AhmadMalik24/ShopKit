// src/api/services/templateService.js
import models, { sequelize } from '../../database/models/index.js';

const { Template, Block, Tenant } = models;

/**
 * List all active templates (without blocks — lighter payload)
 */
export async function listTemplates(category) {
    const where = { is_active: true };
    if (category && category !== 'all') where.category = category;

    return await Template.findAll({
        where,
        order: [['display_order', 'ASC']],
        attributes: { exclude: ['blocks'] },
    });
}

/**
 * Get a single template with its full blocks blueprint
 */
export async function getTemplateBySlug(slug) {
    const template = await Template.findOne({
        where: { slug, is_active: true },
    });
    if (!template) throw new Error('Template not found');
    return template;
}

/**
 * Apply a template to a tenant:
 *  1. Delete existing blocks
 *  2. Clone blocks from the template
 *  3. Update tenant.template_id + onboarding flag
 * All inside a transaction so a partial failure rolls back.
 */
export async function applyTemplateToTenant(tenantId, templateSlug) {
    const template = await Template.findOne({
        where: { slug: templateSlug, is_active: true },
    });
    if (!template) throw new Error('Template not found');

    const transaction = await sequelize.transaction();

    try {
        // 1. Remove existing blocks
        await Block.destroy({
            where: { tenant_id: tenantId },
            transaction,
        });

        // 2. Clone blocks from the template
        const newBlocks = template.blocks.map((block, idx) => ({
            tenant_id: tenantId,
            type: block.type,
            position: block.position ?? idx,
            config: block.config || {},
            styles: block.styles || {},
            animation: block.animation || { type: 'fadeIn', duration: 600, delay: 0 },
            is_visible: true,
        }));

        const createdBlocks = await Block.bulkCreate(newBlocks, { transaction });

        // 3. Mark tenant as having chosen a template
        await Tenant.update(
            { template_id: template.id, has_seen_onboarding: true },
            { where: { id: tenantId }, transaction }
        );

        await transaction.commit();

        return {
            blocks: createdBlocks,
            template: {
                id: template.id,
                name: template.name,
                slug: template.slug,
            },
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}