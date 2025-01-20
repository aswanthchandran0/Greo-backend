"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExploreRepositoryImpl = void 0;
const postModel_1 = require("../database/mongo/models/postModel");
const rollModel_1 = require("../database/mongo/models/rollModel");
class ExploreRepositoryImpl {
    // Fetch posts and rolls and combine them for the explore page
    fetchPostsAndRolls(viewingUserId, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield postModel_1.PostModel.aggregate([
                    {
                        $match: { isBlocked: { $ne: true } }
                    },
                    {
                        $lookup: {
                            from: "likes",
                            localField: "_id",
                            foreignField: "postId",
                            as: "likes",
                        },
                    },
                    {
                        $lookup: {
                            from: "comments",
                            localField: "_id",
                            foreignField: "postId",
                            as: "comments",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userDetails"
                        }
                    },
                    {
                        $addFields: {
                            likeCount: { $size: "$likes.users" }, // Count users in likes
                            commentCount: { $size: "$comments.comments" }, // Count comments
                            profileImage: { $arrayElemAt: ["$userDetails.profileImage", 0] },
                            user_name: { $arrayElemAt: ["$userDetails.user_name", 0] },
                            name: { $arrayElemAt: ["$userDetails.name", 0] }
                        },
                    },
                    { $skip: (page - 1) * pageSize }, // Adjust skip for 1-based page indexing
                    { $limit: pageSize },
                ]);
                console.log("posts with counts", posts);
                const postDtos = posts.map((post) => ({
                    id: post._id.toString(),
                    userId: post.userId.toString(),
                    mediaUrls: post.mediaUrls,
                    content: post.content,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    likeCount: post.likeCount,
                    commentCount: post.commentCount,
                    profileImage: post.profileImage,
                    user_name: post.user_name,
                    name: post.name,
                    type: "post",
                }));
                // Fetch rolls with likeCount and commentCount
                const rolls = yield rollModel_1.RollModel.aggregate([
                    {
                        $lookup: {
                            from: "rolllikes",
                            localField: "_id",
                            foreignField: "rollId",
                            as: "likes",
                        },
                    },
                    {
                        $lookup: {
                            from: "rollcomments",
                            localField: "_id",
                            foreignField: "rollId",
                            as: "comments",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userDetails"
                        }
                    },
                    {
                        $addFields: {
                            likeCount: { $size: "$likes.users" }, // Count users in likes
                            commentCount: { $size: "$comments.comments" }, // Count comments
                            profileImage: { $arrayElemAt: ["$userDetails.profileImage", 0] },
                            userName: { $arrayElemAt: ["$userDetails.user_name", 0] },
                        },
                    },
                    { $skip: (page - 1) * pageSize }, // Adjust skip for 1-based page indexing
                    { $limit: pageSize },
                ]);
                console.log("rolls with counts", rolls);
                const rollDtos = rolls.map((roll) => ({
                    _id: roll._id.toString(),
                    userId: roll.userId.toString(),
                    thumbnail: roll.thumbnail,
                    mediaUrl: roll.mediaUrl,
                    content: roll.content,
                    createdAt: roll.createdAt,
                    likeCount: roll.likeCount,
                    commentCount: roll.commentCount,
                    profileImage: roll.profileImage,
                    userName: roll.userName,
                    type: "roll",
                }));
                // Merge posts and rolls into one array
                const mixedContent = this.mergePostsAndRolls(postDtos, rollDtos);
                return mixedContent;
            }
            catch (error) {
                console.error("Error fetching posts and rolls for explore page:", error);
                throw error; // Handle the error as appropriate
            }
        });
    }
    // Function to mix posts and rolls intelligently
    mergePostsAndRolls(posts, rolls) {
        // Example: Alternating between posts and rolls
        const mixedContent = [];
        const maxLength = Math.max(posts.length, rolls.length);
        for (let i = 0; i < maxLength; i++) {
            if (i < posts.length)
                mixedContent.push(posts[i]);
            if (i < rolls.length)
                mixedContent.push(rolls[i]);
        }
        console.log('mixed content', mixedContent.length);
        return mixedContent;
    }
}
exports.ExploreRepositoryImpl = ExploreRepositoryImpl;
