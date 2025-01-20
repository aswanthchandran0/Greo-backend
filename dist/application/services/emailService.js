"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../../config/config");
class EmailService {
    sendOTPEmail(email, otpCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                service: config_1.config.MAIL_SERVICE,
                auth: {
                    user: config_1.config.MAIL_SERVICE_USER,
                    pass: config_1.config.MAIL_SERVICE_PASSWORD
                }
            });
            const mailOption = {
                from: config_1.config.MAIL_SERVICE_USER,
                to: email,
                subject: 'Your OTP code',
                text: `Your OTP code is ${otpCode}. It will expire in 15 minutes.`
            };
            yield transporter.sendMail(mailOption);
        });
    }
    sendResetPasswordEmail(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                service: config_1.config.MAIL_SERVICE,
                auth: {
                    user: config_1.config.MAIL_SERVICE_USER,
                    pass: config_1.config.MAIL_SERVICE_PASSWORD
                }
            });
            const mailOption = {
                form: config_1.config.MAIL_SERVICE_USER,
                to: email,
                subject: 'Reset password',
                text: `Click here to reset your password: ${config_1.config.CLIENT_SIDE_URL}/auth/reset-password/${token}`
            };
            yield transporter.sendMail(mailOption);
        });
    }
    sendAdminMail(email, subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                service: config_1.config.MAIL_SERVICE,
                auth: {
                    user: config_1.config.MAIL_SERVICE_USER,
                    pass: config_1.config.MAIL_SERVICE_PASSWORD
                }
            });
            const mailOption = {
                from: config_1.config.MAIL_SERVICE_USER,
                to: email,
                subject: subject,
                text: message
            };
            yield transporter.sendMail(mailOption);
        });
    }
}
exports.EmailService = EmailService;
