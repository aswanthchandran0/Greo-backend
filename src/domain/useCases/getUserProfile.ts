import mongoose from "mongoose";
import { UserGraphService } from "../../application/services/userGraphService";
import { PostRepository } from "../repositories/postRepository";
import { userRepository } from "../repositories/userRepository";


export class GetUserProfile{
    constructor(
        private userRepository:userRepository,
        private postRepository:PostRepository,
        private userGraphService:UserGraphService
    ){}

    async execute(userId:mongoose.Types.ObjectId,username:string){

        try {
            const user = await this.userRepository.findByUserName(username)
            if(!user) throw new Error('Sorry, we couldn’t find the user.')
         
            if(userId == user?.id) {
                 const posts =  await this.postRepository.getUserPosts(user.id)
                 const followersCount = await this.userGraphService.getFollowersCount(user.id.toString())
                 const followingCount = await this.userGraphService.getFollowingCount(user.id.toString())
                 return{
                     user:{
                         otherUser:false,
                     },
                     posts,
                     followersCount,
                     followingCount,
                 }
         
            }else{
             const otherUser = await this.userRepository.findByUserId(user.id)
               const posts = await this.postRepository.getUserPosts(user.id)
               const followersCount = await this.userGraphService.getFollowersCount(user.id.toString())
               const followingCount = await this.userGraphService.getFollowingCount(user.id.toString())
               const isFollowing = await this.userGraphService.isFollowing(userId.toString(),user.id.toString())
               console.log('posts',posts)
               return{
                   user:{
                     ...otherUser,
                     otherUser:true
                 },
                   posts,
                   followersCount,
                   followingCount,
                   isFollowing,       
               }
            }
        } catch (error) {
            console.log('error',error)
        }
 
  

}
}