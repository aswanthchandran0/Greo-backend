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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendOtp = void 0;
const otp_1 = require("../entities/otp");
class SendOtp {
    constructor(otpRepository, emailService) {
        this.otpRepository = otpRepository;
        this.emailService = emailService;
    }
    execute(user_id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            const otp = new otp_1.OTP(user_id, otpCode, expiresAt);
            yield this.otpRepository.save(otp);
            yield this.emailService.sendOTPEmail(email, otpCode);
        });
    }
}
exports.SendOtp = SendOtp;
