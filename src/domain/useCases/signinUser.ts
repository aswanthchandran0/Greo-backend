import bcrypt from 'bcrypt'
import { User } from '../entities/user'
import { userRepository } from '../repositories/userRepository'
import tokenService from '../../application/services/tokenService'
import { SignInResponse } from '../../application/dto/userDto'
export class SigninUser{
  constructor(private userRepository:userRepository){}
  async execute(email:string,password:string):Promise<SignInResponse>{
    const user = await this.userRepository.findByEmail(email)
    if(!user){
      throw new Error('Invalid email or password')
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
      throw new Error('Invalid email or password')
    }

    const accessToken = tokenService.generateAccessToken(user.id);
    const refreshToken = tokenService.generateRefreshToken(user.id);
    return {
      user: {
        id: user.id,
        user_name: user.user_name,
        email: user.email
      },
      tokens: {
          accessToken,
          refreshToken
      }
  };
}
}