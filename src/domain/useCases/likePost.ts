import { LikeRepository } from "../../domain/repositories/likeRepository";
import mongoose, { Schema } from "mongoose";
export class LikePost {
    private likeRepository: LikeRepository;

    constructor(likeRepository: LikeRepository) {
        this.likeRepository = likeRepository;
    }

    async execute(userId: mongoose.Types.ObjectId, postIds: mongoose.Types.ObjectId[]): Promise<void> {
        await this.likeRepository.likePosts(userId, postIds);
    }
}
