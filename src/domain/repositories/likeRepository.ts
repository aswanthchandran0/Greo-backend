import { Like } from "../entities/like";
import { Schema } from "mongoose";
export interface LikeRepository{
    likePosts(userId: Schema.Types.ObjectId, postIds: Schema.Types.ObjectId[]): Promise<void>;
    unlikePosts(userId: Schema.Types.ObjectId, postIds: Schema.Types.ObjectId[]): Promise<void>;
}