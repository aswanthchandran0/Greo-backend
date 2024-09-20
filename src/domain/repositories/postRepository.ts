import  Mongoose from "mongoose"
import { Post } from "../entities/post"
import { Schema } from "mongoose"
import { userWithPosts } from "../../application/dto/userDto"

export interface PostRepository{
   savePostData(postData:Post):Promise<any>
   getPostsWithDetails(ObjectUserId:Mongoose.Types.ObjectId):Promise<Post[]|null>
   getPostsByUserName(userName:string):Promise<Post[]|null>
   getPostsWithUserByUserName(userName:string):Promise<userWithPosts | null>
}