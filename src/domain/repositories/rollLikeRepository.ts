import { Like } from "../entities/like";
import mongoose from "mongoose";
export interface RollLikeRepository{
    likePosts(userId: mongoose.Types.ObjectId, rollIds: mongoose.Types.ObjectId[]): Promise<void>;
    unlikePosts(userId: mongoose.Types.ObjectId, rolltIds: mongoose.Types.ObjectId[]): Promise<void>;
}