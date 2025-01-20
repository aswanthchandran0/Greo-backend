import  Mongoose, { mongo } from "mongoose"
import { Post } from "../entities/post"
import mongoose, { Schema } from "mongoose"
import { IUserPost, SinglePost, userWithPosts } from "../../application/dto/userDto"
import { IpostReport, ReasonType } from "../../infrastructure/database/mongo/models/postReportModel"
import { IPost } from "../../infrastructure/database/mongo/models/postModel"
import { Iuser } from "../../infrastructure/database/mongo/models/userModel"

export interface PostRepository{
   savePostData(postData:Post):Promise<any>
   getUserPosts(userId:mongoose.Types.ObjectId):Promise<IUserPost[] | null>
   getPostsByFollowing(userId:mongoose.Types.ObjectId,followedUserIds: mongoose.Types.ObjectId[],skip: number, limit: number):Promise<IUserPost[] | null>
   deletePost(postId:mongoose.Types.ObjectId):Promise<void>
   updatePost(userId:mongoose.Types.ObjectId,postId:Mongoose.Types.ObjectId,content:string):Promise<void>
   reportPost(postId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, reason:ReasonType): Promise<void>;
   getReportedPosts(): Promise<IpostReport[] | null>
   getPost(postId:mongoose.Types.ObjectId,userId: mongoose.Types.ObjectId):Promise<IPost | null>
   getAllPosts():Promise<IPost[] | null>
   blockAndUnblockPost(postId:mongoose.Types.ObjectId,action:boolean):Promise<boolean>
   getUserPostByPostId(postId:mongoose.Types.ObjectId):Promise<SinglePost|null>
   // getPostsWithDetails(ObjectUserId:Mongoose.Types.ObjectId):Promise<Post[]|null>
   // getPostsByUserName(userName:string):Promise<Post[]|null>
}