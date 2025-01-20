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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config/config");
const userModel_1 = require("../../infrastructure/database/mongo/models/userModel");
const adminModel_1 = require("../../infrastructure/database/mongo/models/adminModel");
class JWTService {
    generateAccessToken(userId) {
        const Secret = config_1.config.JWT_SECRET;
        return jsonwebtoken_1.default.sign({ userId }, Secret, { expiresIn: "1d" });
    }
    generateAdminAccessToken(adminId) {
        const Secret = config_1.config.JWT_SECRET;
        return jsonwebtoken_1.default.sign({ adminId }, Secret, { expiresIn: "1d" });
    }
    generateRefreshToken(userId) {
        const Secret = config_1.config.JWT_REFRESH_SECRET;
        return jsonwebtoken_1.default.sign({ userId }, Secret, { expiresIn: "30d" });
    }
    verifyToken(token_1) {
        return __awaiter(this, arguments, void 0, function* (token, isRefreshToken = false) {
            try {
                const secret = isRefreshToken
                    ? config_1.config.JWT_REFRESH_SECRET
                    : config_1.config.JWT_SECRET;
                const decodedToken = jsonwebtoken_1.default.verify(token, secret);
                if (!decodedToken)
                    throw new Error("Invalid token");
                const user = yield userModel_1.UserModel.findOne({ _id: decodedToken.userId });
                if (!user)
                    throw new Error("user not found");
                if (user.is_suspended)
                    throw new Error("User suspended");
                return decodedToken;
            }
            catch (error) {
                console.error("token verification failed:", error.message);
                throw error;
            }
        });
    }
    adminVerifyToken(token_1) {
        return __awaiter(this, arguments, void 0, function* (token, isRefreshToken = false) {
            try {
                const secret = isRefreshToken
                    ? config_1.config.JWT_REFRESH_SECRET
                    : config_1.config.JWT_SECRET;
                const decodedToken = jsonwebtoken_1.default.verify(token, secret);
                const admin = yield adminModel_1.AdminModel.findOne({ _id: decodedToken.adminId });
                if (admin) {
                    return decodedToken;
                }
                else {
                    throw new Error("admin not found");
                }
            }
            catch (error) {
                console.error("token verification failed:", error.message);
                throw error;
            }
        });
    }
    refreshTokens(refreshToken) {
        const decodedToken = this.verifyToken(refreshToken, true);
        if (!decodedToken)
            throw new Error("Invalid refresh Token");
        const userId = decodedToken.userId;
        const accessToken = this.generateAccessToken(userId);
        const newRefreshToken = this.generateRefreshToken(userId);
        return { accessToken, refreshToken: newRefreshToken };
    }
    generateResetPasswordToken(userId) {
        const secret = config_1.config.JWT_RESET_PASSWORD_SECRET;
        return jsonwebtoken_1.default.sign({ userId }, secret, { expiresIn: "15min" });
    }
    verifyResetPasswordToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('TOKENIN SERVICE', token);
                const secret = config_1.config.JWT_RESET_PASSWORD_SECRET;
                const decodedToken = jsonwebtoken_1.default.verify(token, secret);
                console.log('decoded token', decodedToken);
                if (!decodedToken)
                    throw new Error("Invalid token");
                const user = yield userModel_1.UserModel.findOne({ _id: decodedToken.userId });
                if (!user)
                    throw new Error("User not found");
                if (user.is_suspended)
                    throw new Error("User suspended");
                return decodedToken;
            }
            catch (error) {
                console.error("Reset password token verification failed:", error.message);
                throw error;
            }
        });
    }
}
exports.default = new JWTService();
