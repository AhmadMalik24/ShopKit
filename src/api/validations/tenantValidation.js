// src/api/validations/tenantValidation.js
import Joi from 'joi';

export const updateTenantSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  logo_url: Joi.string().uri().allow(null, '').optional(),
  primary_color: Joi.string()
    .pattern(/^#([0-9A-Fa-f]{3}){1,2}$/)
    .optional(),
  secondary_color: Joi.string()
    .pattern(/^#([0-9A-Fa-f]{3}){1,2}$/)
    .optional(),
  business_type: Joi.string().max(100).allow(null, '').optional(),
  whatsapp_number: Joi.string().max(20).allow(null, '').optional(),
  contact_email: Joi.string().email().allow(null, '').optional(),
  address: Joi.string().allow(null, '').optional(),
});

export const updateDomainSchema = Joi.object({
  custom_domain: Joi.string()
    .min(3)
    .max(255)
    .pattern(/^([a-z0-9-]+\.)+[a-z]{2,}$/i)
    .required(),
});