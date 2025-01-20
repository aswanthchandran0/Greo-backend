import tokenService from "../../application/services/tokenService";
import { userRepository } from "../repositories/userRepository";
import bcrypt from 'bcrypt'


export class UpdatePassword{
    constructor(private userRepository:userRepository
    ){}
   private saltRounds = 10
   async execute(token:string,password:string){
    if(!token) throw new Error('token is required')
      if( !password || password=== '') throw new Error('password cannot be empty')
      const decodedToken = await tokenService.verifyResetPasswordToken(token)
      if(!decodedToken) throw new Error('Invalid token')
        console.log('decoded token',decodedToken)
      const hashedPassword = await bcrypt.hash(password,this.saltRounds)
      if(hashedPassword) await this.userRepository.updatePassword(decodedToken.userId,hashedPassword)
   }
}