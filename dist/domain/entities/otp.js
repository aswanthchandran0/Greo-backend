"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
class OTP {
    constructor(user_id, otpCode, expiresAt) {
        this.user_id = user_id;
        this.otpCode = otpCode;
        this.expiresAt = expiresAt;
    }
}
exports.OTP = OTP;
