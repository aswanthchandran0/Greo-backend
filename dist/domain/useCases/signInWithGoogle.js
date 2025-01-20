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
exports.SignInWithGoogle = void 0;
const googleOAuthService_1 = __importDefault(require("../../application/services/googleOAuthService"));
const tokenService_1 = __importDefault(require("../../application/services/tokenService"));
class SignInWithGoogle {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.googleOAuthService = new googleOAuthService_1.default();
    }
    execute(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedtoken = yield this.googleOAuthService.verifyGoogleToken(token);
            if (!decodedtoken) {
                throw new Error('Invalid Google token');
            }
            const email = decodedtoken.email;
            let user = yield this.userRepository.findByEmail(email);
            if (!user)
                throw new Error('User not exist');
            if (user.is_suspended)
                throw new Error('User suspended');
            const accessToken = tokenService_1.default.generateAccessToken(user.id);
            const refreshToken = tokenService_1.default.generateRefreshToken(user.id);
            return {
                user: user,
                tokens: {
                    accessToken,
                    refreshToken
                }
            };
        });
    }
}
exports.SignInWithGoogle = SignInWithGoogle;
