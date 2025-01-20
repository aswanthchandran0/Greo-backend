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
exports.GenerateForgotPasswordToken = void 0;
const tokenService_1 = __importDefault(require("../../application/services/tokenService"));
class GenerateForgotPasswordToken {
    constructor(userRepository, EmailService) {
        this.userRepository = userRepository;
        this.EmailService = EmailService;
    }
    execute(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (!user)
                throw new Error('user not exist.');
            const ResetToken = yield tokenService_1.default.generateResetPasswordToken(user.id);
            if (!ResetToken)
                throw new Error('something went wrong');
            yield this.EmailService.sendResetPasswordEmail(email, ResetToken);
        });
    }
}
exports.GenerateForgotPasswordToken = GenerateForgotPasswordToken;
