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
exports.adminAuthenticateToken = void 0;
const tokenService_1 = __importDefault(require("../../../../../application/services/tokenService"));
const adminAuthenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        console.log('request was reaching inside not token', token);
        return res.status(401).json({ message: 'Access token is missing or Invalid' });
    }
    try {
        const decoded = yield tokenService_1.default.adminVerifyToken(token, false);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.log('error in authentication', err);
        return res.status(401).json({ message: "Invalid or expired access token" });
    }
});
exports.adminAuthenticateToken = adminAuthenticateToken;
