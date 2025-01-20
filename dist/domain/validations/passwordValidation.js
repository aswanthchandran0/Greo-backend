"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.passwordSchema = joi_1.default.string()
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
