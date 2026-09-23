import joi from 'joi';

const registerSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    store_name: joi.string().min(3).max(50).required(),
    whatsapp_number: joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
});

export { registerSchema, loginSchema };

