import mongoose from "mongoose";
import { PostRepository } from "../repositories/postRepository";
import { userRepository } from "../repositories/userRepository";
import { UserGraphService } from "../../application/services/userGraphService";
import { UserDetails } from "../../application/dto/userDto";
export class GetUserDetails {
    constructor(
       private postRepository:PostRepository,
       private userRepository:userRepository,
       private userGraphService:UserGraphService
    ){}

    async execute(userId:mongoose.Types.ObjectId):Promise<UserDetails | null>{
       const user = await this.userRepository.findByUserId(userId)
       if(!user){
         throw new Error('user not found') 
       }
      const posts = await this.postRepository.getUserPosts(userId)
      const followersCount = await this.userGraphService.getFollowersCount(userId.toString())
      const followingCount = await this.userGraphService.getFollowersCount(userId.toString())
      
      return{
        user:user,
        posts:posts,
        followersCount:followersCount,
        followingCount:followingCount
      }
    
    }
}