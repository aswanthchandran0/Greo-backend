import mongoose, { Schema } from "mongoose";
import { RollLikeRepository } from "../repositories/rollLikeRepository";
export class RollLikePost {
    private rollLikeRepository:RollLikeRepository;

    constructor(rollLikeRepository:RollLikeRepository) {
        this.rollLikeRepository = rollLikeRepository;
    }

    async execute(userId: mongoose.Types.ObjectId, postIds: mongoose.Types.ObjectId[]): Promise<void> {
        await this.rollLikeRepository.likePosts(userId, postIds);
    }
}
