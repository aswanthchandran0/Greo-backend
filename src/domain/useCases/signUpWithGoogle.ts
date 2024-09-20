
import { User, UserProfile } from "../entities/user";
import { userRepository } from "../repositories/userRepository";
import { UserProfileRepository } from "../repositories/userProfileRepository";
import GoogleOAuthService from "../../application/services/googleOAuthService";
import tokenService from "../../application/services/tokenService";
import { GoogleSignUpResponse } from "../../application/dto/userDto";
import { RandomNameGenerator } from "../../application/services/randomNameGenerator";
import bcrypt from 'bcrypt'
import { ClientSession, Schema } from "mongoose";

export class SignUpWithGoogle {
  private googleOAuthService: GoogleOAuthService;
  private randomNumberGenerator:RandomNameGenerator
  private saltRounds = 10
    constructor(
        private userRepository:userRepository,
        private userProfileRepository:UserProfileRepository,
    ){
      this.googleOAuthService = new GoogleOAuthService()
      this.randomNumberGenerator = new RandomNameGenerator(userRepository)
    }

    async execute(token:string,session?: ClientSession,publicKey?:string):Promise<GoogleSignUpResponse>{
          const decodedtoken = await this.googleOAuthService.verifyGoogleToken(token);
          if(!decodedtoken){
            throw new Error('Invalid Google token')
          }
          const email = decodedtoken.email
          const name = decodedtoken.name
          let user_name = await this.randomNumberGenerator.uniqueNameGenerator(name)
          const profileImage = decodedtoken.picture

          const password = decodedtoken.name +decodedtoken.sub
          const hashedPassword = await bcrypt.hash(password,this.saltRounds)
          let user = await this.userRepository.findByEmail(email,session)

          if(user){
             throw new Error('user already exist')
          }
              const ObjectId = Schema.Types.ObjectId;
              const userId = new ObjectId('')
            user = new User(
                userId,
                profileImage,
                name,
                user_name.toString(),
                email,
                '',
                'Everyone',
                hashedPassword,
                false,
                publicKey
            )
          console.log('user in google sign up',user)
            user = await this.userRepository.save(user,session)
            const accessToken = tokenService.generateAccessToken(user.id);
            const refreshToken = tokenService.generateRefreshToken(user.id);

            return {
              user,
              tokens: {
                accessToken,
                refreshToken
              }
            };
          }
}