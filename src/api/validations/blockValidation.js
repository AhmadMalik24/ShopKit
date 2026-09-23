// src/api/validations/blockValidation.js
import Joi from 'joi';

const blockTypeEnum = [
  'hero',
  'products',
  'about',
  'testimonials',
  'contact',
  'footer',
  'gallery',
  'cta',
];

export const createBlockSchema = Joi.object({
  type: Joi.string().valid(...blockTypeEnum).required(),
  position: Joi.number().integer().min(0).optional(),
  config: Joi.object().optional(),
  styles: Joi.object().optional(),
  animation: Joi.object().optional(),
  is_visible: Joi.boolean().optional(),
});

export const updateBlockSchema = Joi.object({
  config: Joi.object().optional(),
  styles: Joi.object().optional(),
  animation: Joi.object().optional(),
  position: Joi.number().integer().min(0).optional(),
  is_visible: Joi.boolean().optional(),
});

export const reorderBlocksSchema = Joi.object({
  blocks: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().required(),
        position: Joi.number().integer().min(0).required(),
      })
    )
    .min(1)
    .required(),
});