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
exports.VerifyOtp = void 0;
class VerifyOtp {
    constructor(otpRepository, userRepository) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
    }
    execute(user_id, otpCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = yield this.otpRepository.findByUserId(user_id);
            if (otp && otp.otpCode == otpCode && otp.expiresAt > new Date()) {
                yield this.otpRepository.deleteByUserId(user_id);
                yield this.userRepository.updateUser(user_id, { is_verified: true });
                return true;
            }
            else if (otp && otp.expiresAt < new Date()) {
                yield this.otpRepository.deleteByUserId(user_id);
                return false;
            }
            return false;
        });
    }
}
exports.VerifyOtp = VerifyOtp;
