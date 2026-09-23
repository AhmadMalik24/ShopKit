// src/api/services/publicService.js
import models from '../../database/models/index.js';

const { Tenant, Block, Product } = models;

/**
 * Return the tenant's public branding info
 */
export async function getTenantInfo(tenantId) {
  const tenant = await Tenant.findByPk(tenantId, {
    attributes: [
      'id',
      'name',
      'slug',
      'custom_domain',
      'logo_url',
      'primary_color',
      'secondary_color',
      'business_type',
      'whatsapp_number',
      'contact_email',
      'address',
    ],
  });
  if (!tenant) throw new Error('Tenant not found');
  return tenant;
}

/**
 * Return the tenant's visible blocks, sorted by position
 */
export async function getPublicBlocks(tenantId) {
  return await Block.findAll({
    where: { tenant_id: tenantId, is_visible: true },
    order: [['position', 'ASC']],
  });
}

/**
 * Return the tenant's available products, sorted by display_order
 */
export async function getPublicProducts(tenantId) {
  return await Product.findAll({
    where: { tenant_id: tenantId, is_available: true },
    order: [['display_order', 'ASC']],
  });
}