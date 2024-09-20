import mongoose from "mongoose";
import { userRepository } from "../repositories/userRepository";


export class GetUserByUserId {
   constructor (private userRepository: userRepository){}

   async execute(userId:mongoose.Types.ObjectId){
    return await this.userRepository.findByUserId(userId)
   }
}