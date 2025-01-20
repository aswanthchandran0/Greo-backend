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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepositoryImpl = void 0;
const postModel_1 = require("../database/mongo/models/postModel");
const mongoose_1 = __importDefault(require("mongoose"));
const commentModel_1 = require("../database/mongo/models/commentModel");
const postReportModel_1 = require("../database/mongo/models/postReportModel");
const userSavedItems_1 = __importDefault(require("../database/mongo/models/userSavedItems"));
class PostRepositoryImpl {
    savePostData(postData) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = new postModel_1.PostModel(postData);
            return yield post.save();
        });
    }
    getUserPosts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield postModel_1.PostModel.aggregate([
                {
                    $match: {
                        userId: userId,
                        isBlocked: { $ne: true }
                    },
                },
                {
                    $lookup: {
                        from: "likes",
                        localField: "_id",
                        foreignField: "postId",
                        as: "likeData",
                    },
                },
                {
                    $lookup: {
                        from: "comments",
                        localField: "_id",
                        foreignField: "postId",
                        as: "comment",
                    },
                },
                {
                    $lookup: {
                        from: "saveditems", // Referencing the SavedItem collection
                        let: { postId: "$_id" }, // Using the postId to match saved items
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$userId", userId] }, // Match the userId
                                            { $in: ["$$postId", "$items.itemId"] }, // Check if the postId is in the saved items list
                                        ],
                                    },
                                },
                            },
                            {
                                $project: { _id: 1 }, // Only project the _id to check if the item is saved
                            },
                        ],
                        as: "savedItemData", // Store the result of the saved items lookup
                    },
                },
                {
                    $addFields: {
                        likeCount: {
                            $cond: {
                                if: { $gt: [{ $size: "$likeData" }, 0] },
                                then: { $size: { $first: "$likeData.users" } },
                                else: 0,
                            },
                        },
                        commentCount: {
                            $cond: {
                                if: { $gt: [{ $size: "$comment" }, 0] },
                                then: { $size: { $first: "$comment.comments" } },
                                else: 0,
                            },
                        },
                        isSaved: {
                            $cond: {
                                if: { $gt: [{ $size: "$savedItemData" }, 0] },
                                then: true, // If savedItemData array has any items, the post is saved
                                else: false, // Otherwise, it's not saved
                            },
                        },
                    },
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $project: {
                        _id: 1,
                        mediaUrls: 1,
                        content: 1,
                        createdAt: 1,
                        likeCount: 1,
                        commentCount: 1,
                        isSaved: 1,
                    },
                },
            ]);
            return posts;
        });
    }
    getPostsByFollowing(userId, followedUserIds, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const userIdObject = new mongoose_1.default.Types.ObjectId(userId);
            console.log('followedUserIds', followedUserIds);
            const savedItem = yield userSavedItems_1.default.findOne({ userId: userId });
            // console.log('saved item single data',savedItem)
            const posts = yield postModel_1.PostModel.aggregate([
                {
                    $match: {
                        userId: { $in: followedUserIds }, // Match posts created by followed users
                        isBlocked: { $ne: true }
                    },
                },
                {
                    $skip: skip, // Skip specified number of documents
                },
                {
                    $limit: limit, // Limit the number of documents
                },
                {
                    $lookup: {
                        from: "likes", // Lookup likes data
                        localField: "_id",
                        foreignField: "postId",
                        as: "likeData",
                    },
                },
                {
                    $lookup: {
                        from: "users", // Lookup user data for post owners
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $lookup: {
                        from: "comments", // Lookup comments data
                        localField: "_id",
                        foreignField: "postId",
                        as: "commentData",
                    },
                },
                {
                    $lookup: {
                        from: "saveditems", // Lookup saved items to check if the post is saved
                        let: { postId: "$_id" }, // Pass the current postId to the pipeline
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$userId", userIdObject] }, // Match the userId
                                            { $in: ["$$postId", "$items.itemId"] }, // Check if postId exists in items array
                                        ],
                                    },
                                },
                            },
                            {
                                $project: { _id: 1 }, // Project only the _id field
                            },
                        ],
                        as: "savedItemData", // Store the result of the saved items lookup
                    },
                },
                {
                    $addFields: {
                        likeCount: {
                            $cond: {
                                if: { $isArray: "$likeData" },
                                then: {
                                    $reduce: {
                                        input: "$likeData",
                                        initialValue: 0,
                                        in: { $add: ["$$value", { $size: "$$this.users" }] }, // Sum the size of 'users' arrays
                                    },
                                },
                                else: 0,
                            },
                        },
                        commentCount: {
                            $reduce: {
                                input: "$commentData",
                                initialValue: 0,
                                in: { $add: ["$$value", { $size: "$$this.comments" }] }, // Sum the size of 'comments' arrays
                            },
                        },
                        isLiked: {
                            $cond: {
                                if: { $gt: [{ $size: "$likeData" }, 0] },
                                then: {
                                    $reduce: {
                                        input: "$likeData",
                                        initialValue: false,
                                        in: {
                                            $or: ["$$value", { $in: [userIdObject, "$$this.users"] }],
                                        }, // Check if the user's ID is in the 'users' array
                                    },
                                },
                                else: false,
                            },
                        },
                        isSaved: {
                            $cond: {
                                if: { $gt: [{ $size: "$savedItemData" }, 0] },
                                then: true, // If savedItemData has items, the post is saved
                                else: false, // Otherwise, it's not saved
                            },
                        },
                        userId: { $arrayElemAt: ["$user._id", 0] }, // Extract userId
                        user_name: { $arrayElemAt: ["$user.user_name", 0] }, // Extract username
                        name: { $arrayElemAt: ["$user.name", 0] }, // Extract name
                        profileImage: { $arrayElemAt: ["$user.profileImage", 0] }, // Extract profile image
                    },
                },
                {
                    $project: {
                        _id: 1,
                        mediaUrls: 1,
                        content: 1,
                        createdAt: 1,
                        likeCount: 1,
                        commentCount: 1,
                        isLiked: 1,
                        isSaved: 1, // Include isSaved field
                        userId: 1,
                        user_name: 1,
                        name: 1,
                        profileImage: 1,
                    },
                },
                {
                    $sort: { createdAt: -1 }, // Sort posts by creation date (newest first)
                },
            ]);
            return posts;
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("request was reach in savcccccee here", postId);
                const result = yield postModel_1.PostModel.deleteOne({ _id: postId });
                console.log("deleted post", result);
                yield commentModel_1.CommentModel.deleteMany({ postId: postId });
            }
            catch (err) {
                console.error("Error deleting post:", err);
                throw err;
            }
        });
    }
    updatePost(userId, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield postModel_1.PostModel.findOne({ _id: postId });
            if (!post)
                throw new Error("post not found");
            if (post.userId.toString() !== userId.toString())
                throw new Error("you are not authorized to update this post");
            if (post) {
                post.content = content;
                yield post.save();
            }
        });
    }
    // report post
    reportPost(postId, userId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the user has already reported this post
                const existingReport = yield postReportModel_1.postReportModel.findOne({
                    postId,
                    "users.id": userId,
                });
                if (existingReport) {
                    // If the user has already reported, update the report by adding a new reason
                    existingReport.users.push({ id: userId, reason });
                    yield existingReport.save();
                    console.log("Updated report for user:", userId, "on post:", postId);
                }
                else {
                    // If no report exists for this user, create a new report
                    const newReport = new postReportModel_1.postReportModel({
                        postId,
                        users: [{ id: userId, reason }],
                        createdAt: new Date(),
                    });
                    yield newReport.save();
                    console.log("Created new report for user:", userId, "on post:", postId);
                }
            }
            catch (error) {
                console.error("Error reporting post:", error);
                throw new Error("Failed to report post.");
            }
        });
    }
    getReportedPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportedPosts = yield postReportModel_1.postReportModel.aggregate([
                    {
                        $lookup: {
                            from: "posts",
                            localField: "postId",
                            foreignField: "_id",
                            as: "postDetails",
                        },
                    },
                    {
                        $unwind: "$postDetails",
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "postDetails.userId",
                            foreignField: "_id",
                            as: "userDetails",
                        },
                    },
                    {
                        $unwind: "$userDetails",
                    },
                    {
                        $lookup: {
                            from: "likes",
                            localField: "postId",
                            foreignField: "postId",
                            as: "likeData",
                        },
                    },
                    {
                        $lookup: {
                            from: "comments",
                            localField: "postId",
                            foreignField: "postId",
                            as: "commentData",
                        },
                    },
                    {
                        $addFields: {
                            reportedCount: { $size: "$users" },
                            likeCount: {
                                $reduce: {
                                    input: "$likeData",
                                    initialValue: 0,
                                    in: { $add: ["$$value", { $size: "$$this.users" }] },
                                },
                            },
                            commentCount: {
                                $reduce: {
                                    input: "$commentData",
                                    initialValue: 0,
                                    in: { $add: ["$$value", { $size: "$$this.comments" }] },
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1, // Report ID
                            postId: 1,
                            "postDetails.mediaUrls": 1,
                            "postDetails.mediaType": 1,
                            "postDetails.content": 1,
                            "postDetails.createdAt": 1,
                            "postDetails.isBlocked": 1,
                            "userDetails.name": 1,
                            "userDetails.user_name": 1,
                            "userDetails.email": 1,
                            "userDetails.profileImage": 1,
                            users: 1, // Reported users and reasons
                            createdAt: 1, // Report creation timestamp
                            reportedCount: 1,
                            likeCount: 1,
                            commentCount: 1,
                            userId: "$userDetails._id",
                        },
                    },
                    {
                        $sort: { createdAt: -1 },
                    },
                ]);
                return reportedPosts;
            }
            catch (error) {
                console.error("Error fetching reported posts:", error);
                throw error;
            }
        });
    }
    getPost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postModel_1.PostModel.aggregate([
                    {
                        $match: { _id: postId }, // Match the specific post by its ID
                    },
                    {
                        $lookup: {
                            from: "users", // Reference the users collection
                            localField: "userId", // Field in the posts collection
                            foreignField: "_id", // Field in the users collection
                            as: "userDetails", // Output field name
                        },
                    },
                    {
                        $unwind: "$userDetails", // Unwind the userDetails array to get an object
                    },
                    {
                        $lookup: {
                            from: "likes",
                            localField: "_id",
                            foreignField: "postId",
                            as: "likeData",
                        },
                    },
                    {
                        $lookup: {
                            from: "comments",
                            localField: "_id",
                            foreignField: "postId",
                            as: "commentData",
                        },
                    },
                    {
                        $addFields: {
                            likeCount: {
                                $reduce: {
                                    input: "$likeData",
                                    initialValue: 0,
                                    in: { $add: ["$$value", { $size: "$$this.users" }] },
                                },
                            },
                            commentCount: {
                                $reduce: {
                                    input: "$commentData",
                                    initialValue: 0,
                                    in: { $add: ["$$value", { $size: "$$this.comments" }] },
                                },
                            },
                            isLiked: {
                                $reduce: {
                                    input: "$likeData",
                                    initialValue: false,
                                    in: {
                                        $or: ["$$value", { $in: [userId, "$$this.users"] }],
                                    },
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            mediaUrls: 1,
                            content: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            likeCount: 1,
                            commentCount: 1,
                            isLiked: 1,
                            userId: "$userDetails._id",
                            name: "$userDetails.name",
                            user_name: "$userDetails.user_name",
                            profileImage: "$userDetails.profileImage",
                        },
                    },
                ]);
                return post.length > 0 ? post[0] : null; // Return the post or null if not found
            }
            catch (error) {
                console.error("Error fetching post:", error);
                return null;
            }
        });
    }
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postModel_1.PostModel.find({ isBlocked: { $ne: true } });
        });
    }
    blockAndUnblockPost(postId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            // Perform the update
            const post = yield postModel_1.PostModel.findOne({ _id: postId });
            console.log('finded post in the block area', post);
            const updatedPost = yield postModel_1.PostModel.updateOne({ _id: postId }, { $set: { isBlocked: action } });
            console.log('updatedPost ', updatedPost);
            return updatedPost.modifiedCount > 0;
        });
    }
    getUserPostByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield postModel_1.PostModel.aggregate([
                    {
                        $match: { _id: postId }, // Match the post by its ID
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userDetails",
                        },
                    },
                    {
                        $unwind: "$userDetails", // Unwind the array to get a single user document
                    },
                    {
                        $project: {
                            _id: 1,
                            "userDetails.name": 1,
                            "userDetails.user_name": 1,
                            "userDetails.profileImage": 1,
                            "userDetails.email": 1,
                            mediaUrls: 1,
                            content: 1,
                            createdAt: 1,
                        }
                    }
                ]);
                if (result.length === 0) {
                    return null; // Return null if no result found
                }
                const post = result[0];
                return {
                    _id: post._id.toString(),
                    name: post.userDetails.name,
                    username: post.userDetails.user_name,
                    profileImage: post.userDetails.profileImage,
                    email: post.userDetails.email,
                    mediaUrls: post.mediaUrls,
                    content: post.content,
                    createdAt: post.createdAt,
                };
            }
            catch (error) {
                console.error("Error fetching user by postId:", error);
                throw error;
            }
        });
    }
}
exports.PostRepositoryImpl = PostRepositoryImpl;
