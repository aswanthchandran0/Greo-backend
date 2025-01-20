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
exports.ResentOtp = void 0;
const otp_1 = require("../entities/otp");
class ResentOtp {
    constructor(EmailService, otpRepository, userRepository) {
        this.EmailService = EmailService;
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
    }
    execute(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (!user)
                throw new Error('user not found');
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            const otp = new otp_1.OTP(user.id, otpCode, expiresAt);
            yield this.otpRepository.update(otp);
            yield this.EmailService.sendOTPEmail(email, otpCode);
        });
    }
}
exports.ResentOtp = ResentOtp;
