import { LikeRepository } from "../../domain/repositories/likeRepository";
import mongoose, { Schema } from "mongoose";
import { RollLikeRepository } from "../repositories/rollLikeRepository";
export class RollUnlikePost {
    private rollLikeRepository: RollLikeRepository;

    constructor(rollLikeRepository: RollLikeRepository) {
        this.rollLikeRepository = rollLikeRepository;
    }

    async execute(userId:mongoose.Types.ObjectId, postIds: mongoose.Types.ObjectId[]): Promise<void> {
        await this.rollLikeRepository.unlikePosts(userId, postIds);
    }
}