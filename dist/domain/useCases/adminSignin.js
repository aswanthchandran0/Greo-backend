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
exports.SigninAdmin = void 0;
const tokenService_1 = __importDefault(require("../../application/services/tokenService"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class SigninAdmin {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    execute(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.adminRepository.findByEmail(email);
            if (!admin) {
                throw new Error('Admin not found');
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, admin['password']);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }
            console.log('admin', admin);
            const adminAccessToken = tokenService_1.default.generateAdminAccessToken(admin._id);
            return { admin,
                tokens: {
                    accessToken: adminAccessToken,
                }
            };
        });
    }
}
exports.SigninAdmin = SigninAdmin;
