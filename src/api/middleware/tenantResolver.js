// src/api/middleware/tenantResolver.js
import models from '../../database/models/index.js';

const { Tenant } = models;

export default async function tenantResolver(req, res, next) {
  try {
    const domain = req.headers['x-tenant-domain'];
    const slug = req.headers['x-tenant-slug'];

    let tenant = null;

    if (domain) {
      tenant = await Tenant.findOne({ where: { custom_domain: domain } });
    }

    if (!tenant && slug) {
      tenant = await Tenant.findOne({ where: { slug } });
    }

    // Fallback: in dev, if slug isn't provided, allow ?slug= query
    if (!tenant && req.query.slug) {
      tenant = await Tenant.findOne({ where: { slug: req.query.slug } });
    }

    if (!tenant) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Store not found',
      });
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message,
    });
  }
}