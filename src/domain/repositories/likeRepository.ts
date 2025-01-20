import { Like } from "../entities/like";
import mongoose from "mongoose";
import { User } from "../entities/user";
import { Iuser } from "../../infrastructure/database/mongo/models/userModel";
export interface LikeRepository{
    likePosts(userId: mongoose.Types.ObjectId, postIds: mongoose.Types.ObjectId[]): Promise<void>;
    unlikePosts(userId: mongoose.Types.ObjectId, postIds: mongoose.Types.ObjectId[]): Promise<void>;
    getLikedUsers(postId:mongoose.Types.ObjectId):Promise<Iuser[]| null>
}