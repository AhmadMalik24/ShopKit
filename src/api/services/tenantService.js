// src/api/services/tenantService.js
import models from '../../database/models/index.js';

const { Tenant, User, Block, Product } = models;

/**
 * Get the current tenant with basic counts
 */
export async function getTenantById(tenantId) {
  const tenant = await Tenant.findByPk(tenantId, {
    attributes: { exclude: ['owner_id'] },
  });
  if (!tenant) throw new Error('Tenant not found');

  return tenant;
}

/**
 * Get tenant with owner info (for settings page)
 */
export async function getTenantWithOwner(tenantId) {
  const tenant = await Tenant.findByPk(tenantId, {
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'email', 'whatsapp_number'],
      },
    ],
  });
  if (!tenant) throw new Error('Tenant not found');

  return tenant;
}

/**
 * Update the tenant's branding and contact info
 */
export async function updateTenant(tenantId, data) {
  const tenant = await Tenant.findByPk(tenantId);
  if (!tenant) throw new Error('Tenant not found');

  const allowedFields = [
    'name',
    'logo_url',
    'primary_color',
    'secondary_color',
    'business_type',
    'whatsapp_number',
    'contact_email',
    'address',
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  await tenant.update(updates);

  return tenant;
}

/**
 * Set a custom domain for the tenant
 */
export async function setCustomDomain(tenantId, domain) {
  const tenant = await Tenant.findByPk(tenantId);
  if (!tenant) throw new Error('Tenant not found');

  // Check if another tenant already has this domain
  const existing = await Tenant.findOne({
    where: { custom_domain: domain },
  });

  if (existing && existing.id !== tenantId) {
    throw new Error('This domain is already connected to another store');
  }

  await tenant.update({ custom_domain: domain });

  return tenant;
}

/**
 * Clear the tenant's custom domain
 */
export async function clearCustomDomain(tenantId) {
  const tenant = await Tenant.findByPk(tenantId);
  if (!tenant) throw new Error('Tenant not found');

  await tenant.update({ custom_domain: null });

  return tenant;
}