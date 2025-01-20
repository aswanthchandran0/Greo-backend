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
exports.UpdatePassword = void 0;
const tokenService_1 = __importDefault(require("../../application/services/tokenService"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UpdatePassword {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.saltRounds = 10;
    }
    execute(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token)
                throw new Error('token is required');
            if (!password || password === '')
                throw new Error('password cannot be empty');
            const decodedToken = yield tokenService_1.default.verifyResetPasswordToken(token);
            if (!decodedToken)
                throw new Error('Invalid token');
            console.log('decoded token', decodedToken);
            const hashedPassword = yield bcrypt_1.default.hash(password, this.saltRounds);
            if (hashedPassword)
                yield this.userRepository.updatePassword(decodedToken.userId, hashedPassword);
        });
    }
}
exports.UpdatePassword = UpdatePassword;
