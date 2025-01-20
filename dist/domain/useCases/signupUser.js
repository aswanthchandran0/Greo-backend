"use strict";
// import { User, UserProfile } from '../entities/user'
// import { userRepository} from '../repositories/userRepository'
// import { UserProfileRepository } from '../repositories/userProfileRepository'
// import { PasswordValidation } from '../validations/passwordValidation'
// import { OtpRepository } from '../repositories/otpRepository'
// import tokenService from '../../application/services/tokenService'
// import { SignUpResponse } from '../../application/dto/userDto'
// import { ClientSession, ObjectId, Schema } from 'mongoose';
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
exports.SignupUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const passwordValidation_1 = require("../validations/passwordValidation");
const user_1 = require("../entities/user");
const mongoose_1 = __importDefault(require("mongoose"));
class SignupUser {
    constructor(userRepository, randomNameGenerator, sentOtp) {
        this.userRepository = userRepository;
        this.randomNameGenerator = randomNameGenerator;
        this.sentOtp = sentOtp;
        this.saltRounds = 10;
    }
    execute(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            let existingUser = yield this.userRepository.findByEmail(userData.email);
            if (existingUser && !existingUser.is_verified) {
                yield this.userRepository.deleteUser(existingUser.id);
                existingUser = null;
            }
            if (existingUser)
                throw new Error('user already exists');
            const { error } = passwordValidation_1.passwordSchema.validate(userData.password);
            if (error)
                throw new Error(error.details[0].message);
            const hashedPassword = yield bcrypt_1.default.hash(userData.password, this.saltRounds);
            const username = yield this.randomNameGenerator.uniqueNameGenerator(userData.name);
            const user = new user_1.User(new mongoose_1.default.Types.ObjectId(), userData.name, '', username, userData.email, '', 'Everyone', hashedPassword, 'prefer not to say', false, false, false);
            const savedUser = yield this.userRepository.save(user);
            yield this.sentOtp.execute(savedUser.id, savedUser.email);
            return { user: savedUser, otpSent: true };
        });
    }
}
exports.SignupUser = SignupUser;
// export class  SignupUser {
//     private saltRounds = 10
//     constructor(
//         private userRepository:userRepository,
//         private userProfileRepository:UserProfileRepository,
//     ){}
//     async execute(userData:{user_name:string;email:string;password:string,publicKey:string},session?: ClientSession):Promise<SignUpResponse>{
//     const existingUser = await this.userRepository.findByEmail(userData.email,session)
//     const existedUserName = await this.userRepository.findByUserName(userData.user_name,session)
//     const isValidPassword = PasswordValidation.validate(userData.password)
//     if(existingUser){
//         throw new Error ('user already exists')
//     }
//     if(existedUserName !== null && existedUserName !==undefined){
//         console.log('existedUserName',existedUserName)
//         throw new Error ('username already taken')
//     }
//     if(!isValidPassword){
//         throw new Error(PasswordValidation.getStrengthFeedback(userData.password))
//     }
//     const hashedPassword = await bcrypt.hash(userData.password,this.saltRounds)
//     const ObjectId = Schema.Types.ObjectId;
//     const user = new User(new ObjectId(''), '','', userData.user_name, userData.email,'', 'Everyone', hashedPassword, false,userData.publicKey);
//     console.log('user in sign up user',user)
//     console.log()
//   const savedUser =  await this.userRepository.save(user,session)
//    const userProfile = new UserProfile(savedUser.id,'prefer not to say',false,[],[],[],[])
//    await this.userProfileRepository.save(userProfile)
//    const accessToken = tokenService.generateAccessToken(savedUser.id);
//    const refreshToken = tokenService.generateRefreshToken(savedUser.id);
//    return {
//     user:savedUser,
//     tokens:{
//         accessToken,
//         refreshToken
//     }
//    }
// }
// } 
