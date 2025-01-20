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
exports.SignUpWithGoogle = void 0;
const user_1 = require("../entities/user");
const googleOAuthService_1 = __importDefault(require("../../application/services/googleOAuthService"));
const tokenService_1 = __importDefault(require("../../application/services/tokenService"));
const randomNameGenerator_1 = require("../../application/services/randomNameGenerator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
class SignUpWithGoogle {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.saltRounds = 10;
        this.googleOAuthService = new googleOAuthService_1.default();
        this.randomNumberGenerator = new randomNameGenerator_1.RandomNameGenerator(userRepository);
    }
    execute(token, session, publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedtoken = yield this.googleOAuthService.verifyGoogleToken(token);
            if (!decodedtoken) {
                throw new Error('Invalid Google token');
            }
            const email = decodedtoken.email;
            const name = decodedtoken.name;
            let user_name = yield this.randomNumberGenerator.uniqueNameGenerator(name);
            const profileImage = decodedtoken.picture;
            const password = decodedtoken.name + decodedtoken.sub;
            const hashedPassword = yield bcrypt_1.default.hash(password, this.saltRounds);
            let user = yield this.userRepository.findByEmail(email, session);
            if (user) {
                throw new Error('user already exist');
            }
            const ObjectId = mongoose_1.default.Types.ObjectId;
            const userId = new ObjectId();
            user = new user_1.User(userId, name, profileImage, user_name.toString(), email, '', 'Everyone', hashedPassword, 'prefer not to say', false, false, true);
            console.log('user in google sign up', user);
            user = yield this.userRepository.save(user, session);
            const accessToken = tokenService_1.default.generateAccessToken(user.id);
            const refreshToken = tokenService_1.default.generateRefreshToken(user.id);
            return {
                user,
                tokens: {
                    accessToken,
                    refreshToken
                }
            };
        });
    }
}
exports.SignUpWithGoogle = SignUpWithGoogle;
