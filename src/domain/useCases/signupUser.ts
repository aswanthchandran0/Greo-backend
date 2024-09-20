import bcrypt from 'bcrypt'
import { User, UserProfile } from '../entities/user'
import { userRepository} from '../repositories/userRepository'
import { UserProfileRepository } from '../repositories/userProfileRepository'
import { PasswordValidation } from '../validations/passwordValidation'
import { OtpRepository } from '../repositories/otpRepository'
import tokenService from '../../application/services/tokenService'
import { SignUpResponse } from '../../application/dto/userDto'
import { ClientSession, ObjectId, Schema } from 'mongoose';

export class  SignupUser {
    private saltRounds = 10

    constructor(
        private userRepository:userRepository,
        private userProfileRepository:UserProfileRepository,
    ){}

    async execute(userData:{user_name:string;email:string;password:string,publicKey:string},session?: ClientSession):Promise<SignUpResponse>{
    const existingUser = await this.userRepository.findByEmail(userData.email,session)
    const existedUserName = await this.userRepository.findByUserName(userData.user_name,session)
    const isValidPassword = PasswordValidation.validate(userData.password)
    if(existingUser){
        throw new Error ('user already exists')
    }
    if(existedUserName !== null && existedUserName !==undefined){
        console.log('existedUserName',existedUserName)
        throw new Error ('username already taken')
    }
    if(!isValidPassword){
        throw new Error(PasswordValidation.getStrengthFeedback(userData.password))
    }
   
    
    const hashedPassword = await bcrypt.hash(userData.password,this.saltRounds)
    const ObjectId = Schema.Types.ObjectId;
    const user = new User(new ObjectId(''), '','', userData.user_name, userData.email,'', 'Everyone', hashedPassword, false,userData.publicKey);
    console.log('user in sign up user',user)
    console.log()
  const savedUser =  await this.userRepository.save(user,session)
   const userProfile = new UserProfile(savedUser.id,'prefer not to say',false,[],[],[],[])
   await this.userProfileRepository.save(userProfile)

   const accessToken = tokenService.generateAccessToken(savedUser.id);
   const refreshToken = tokenService.generateRefreshToken(savedUser.id);
   return {
    user:savedUser,
    tokens:{
        accessToken,
        refreshToken
    }
   }
}
} 