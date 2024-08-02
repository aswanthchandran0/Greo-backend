import bcrypt from 'bcrypt'
import { User } from '../entities/user'
import { userRepository } from '../repositories/userRepository'

export class SigninUser{
  constructor(private userRepository:userRepository){}
  async execute(email:string,password:string):Promise<User>{
    const user = await this.userRepository.findByEmail(email)
    if(!user){
      throw new Error('Invalid email or password')
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
      throw new Error('Invalid email or password')
    }
    return user
  }
}