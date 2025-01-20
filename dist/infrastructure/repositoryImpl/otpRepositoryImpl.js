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
exports.OtpRepositoryImpl = void 0;
const otp_1 = require("../../domain/entities/otp");
const otpModel_1 = require("../database/mongo/models/otpModel");
class OtpRepositoryImpl {
    save(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpModel = new otpModel_1.OtpModel(otp);
            yield otpModel.save();
        });
    }
    findByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpModel = yield otpModel_1.OtpModel.findOne({ user_id }).exec();
            return otpModel ? new otp_1.OTP(otpModel.user_id, otpModel.otpCode, otpModel.expiresAt) : null;
        });
    }
    deleteByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield otpModel_1.OtpModel.deleteOne({ user_id }).exec();
        });
    }
    update(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield otpModel_1.OtpModel.findOneAndUpdate({ user_id: otp.user_id }, { otpCode: otp.otpCode, expiresAt: otp.expiresAt }).exec();
        });
    }
}
exports.OtpRepositoryImpl = OtpRepositoryImpl;
