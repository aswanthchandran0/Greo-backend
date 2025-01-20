import mongoose from "mongoose";
import { userRepository } from "../repositories/userRepository";


export class CheckUserNameAvailabilty {
    constructor(private userRepository:userRepository){}

    async execute(userId:mongoose.Types.ObjectId,username:string){
      const currentUser = await this .userRepository.findByUserId(userId)
      const user =  await this .userRepository.findByUserName(username)
      if(user && currentUser?.user_name !== username){
        return {exist:true}
      }else{
        return {exist:false}
      }
    }
}