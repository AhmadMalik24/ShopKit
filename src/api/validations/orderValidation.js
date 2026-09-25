// src/api/validations/orderValidation.js
import Joi from 'joi';

export const createOrderSchema = Joi.object({
  customer_name: Joi.string().min(1).max(255).required(),
  customer_phone: Joi.string().min(6).max(20).required(),
  delivery_address: Joi.string().allow('').optional(),
  delivery_type: Joi.string()
    .valid('pickup', 'local_delivery', 'courier')
    .optional(),
  payment_method: Joi.string()
    .valid('cod', 'jazzcash', 'easypaisa', 'card')
    .optional(),
  notes: Joi.string().allow('').optional(),
  items: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      'pending',
      'confirmed',
      'preparing',
      'out_for_delivery',
      'delivered',
      'cancelled'
    )
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, confirmed, preparing, out_for_delivery, delivered, cancelled',
    }),
});