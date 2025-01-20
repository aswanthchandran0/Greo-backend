import mongoose from "mongoose";
import { UserGraphService } from "../../application/services/userGraphService";
import { PostRepository } from "../repositories/postRepository";

export class GetUserFeed {
    constructor(
        private postRepository: PostRepository,
        private graphService: UserGraphService
    ) {}

   async execute(userId:mongoose.Types.ObjectId,skip: number, limit: number) {
       const followedUserIds =  await this.graphService.getFollowingIds(userId.toString())
       const followedUserObjectIds = followedUserIds.map(id => new  mongoose.Types.ObjectId(id));

       return this.postRepository.getPostsByFollowing(userId,followedUserObjectIds,skip,limit)
    }
}