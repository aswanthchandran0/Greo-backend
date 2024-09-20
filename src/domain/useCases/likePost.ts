import { LikeRepository } from "../../domain/repositories/likeRepository";
import { Schema } from "mongoose";
export class LikePost {
    private likeRepository: LikeRepository;

    constructor(likeRepository: LikeRepository) {
        this.likeRepository = likeRepository;
    }

    async execute(userId: Schema.Types.ObjectId, postIds: Schema.Types.ObjectId[]): Promise<void> {
        await this.likeRepository.likePosts(userId, postIds);
    }
}
