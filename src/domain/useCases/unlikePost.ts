import { LikeRepository } from "../../domain/repositories/likeRepository";
import mongoose, { Schema } from "mongoose";
export class UnlikePost {
    private likeRepository: LikeRepository;

    constructor(likeRepository: LikeRepository) {
        this.likeRepository = likeRepository;
    }

    async execute(userId:mongoose.Types.ObjectId, postIds: mongoose.Types.ObjectId[]): Promise<void> {
        await this.likeRepository.unlikePosts(userId, postIds);
    }
}
