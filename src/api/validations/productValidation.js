// src/api/validations/productValidation.js
import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().min(0).required(),
  image_urls: Joi.array().items(Joi.string()).optional(),
  category: Joi.string().max(100).optional(),
  is_available: Joi.boolean().optional(),
  display_order: Joi.number().integer().min(0).optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().min(0).optional(),
  image_urls: Joi.array().items(Joi.string()).optional(),
  category: Joi.string().max(100).optional(),
  is_available: Joi.boolean().optional(),
  display_order: Joi.number().integer().min(0).optional(),
});

export const reorderProductsSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().required(),
        display_order: Joi.number().integer().min(0).required(),
      })
    )
    .min(1)
    .required(),
});