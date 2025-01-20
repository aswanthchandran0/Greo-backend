import Joi from 'joi';


export const passwordSchema = Joi.string()
  .min(6)
  .required()
  .pattern(/[A-Z]/, 'uppercase letter')
  .pattern(/[a-z]/, 'lowercase letter')
  .pattern(/\d/, 'number')
  .messages({
    'string.min': 'Password should be at least 6 characters long.',
    'string.pattern.name': 'Password should include at least one {#name}.',
    'any.required': 'Password is required.',
  });
