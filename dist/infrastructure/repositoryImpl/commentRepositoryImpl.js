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
exports.commentRepositoryImpl = void 0;
const commentModel_1 = require("../database/mongo/models/commentModel");
const userModel_1 = require("../database/mongo/models/userModel");
class commentRepositoryImpl {
    save(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('comment in saved repo', comment);
            try {
                const existingComments = yield commentModel_1.CommentModel.findOne({ postId: comment.postId }).exec();
                const user = yield userModel_1.UserModel.findById(comment.comments[0].userId).exec();
                console.log('comment', comment);
                console.log('user ', user);
                if (existingComments && user) {
                    existingComments.comments.push(...comment.comments);
                    const savedPost = yield existingComments.save();
                    const savedComment = comment.comments[0];
                    const commentDto = {
                        postId: savedPost.postId,
                        userId: savedComment.userId,
                        content: savedComment.content,
                        createdAt: savedComment.createdAt,
                        userDetails: {
                            _id: user._id,
                            user_name: user.user_name,
                            profileImage: user.profileImage
                        },
                    };
                    return commentDto;
                }
                else if (!existingComments) {
                    if (user) {
                        const newCommentModel = new commentModel_1.CommentModel({
                            postId: comment.postId,
                            comments: comment.comments,
                            createdAt: new Date(),
                        });
                        const savedNewComment = yield newCommentModel.save();
                        const savedComment = savedNewComment.comments[0];
                        const commentDto = {
                            postId: savedNewComment.postId,
                            userId: savedComment.userId,
                            content: savedComment.content,
                            createdAt: savedComment.createdAt || new Date(),
                            userDetails: {
                                _id: user._id,
                                user_name: user.user_name,
                                profileImage: user.profileImage
                            },
                        };
                        return commentDto;
                    }
                    else {
                        console.log("User not found");
                        return null;
                    }
                }
                else {
                    console.log("Post or User not found");
                    return null;
                }
            }
            catch (err) {
                console.log('Error:', err);
                return null;
            }
        });
    }
    findByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield commentModel_1.CommentModel.aggregate([
                {
                    $match: {
                        postId: postId
                    }
                },
                { $unwind: "$comments" },
                {
                    $lookup: {
                        from: "users", // Collection name for UserModel
                        localField: "comments.userId",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                {
                    $addFields: {
                        "comments.userDetails": { $arrayElemAt: ["$userDetails", 0] },
                    },
                },
                {
                    $sort: { "comments.createdAt": -1 }
                },
                // Re-group the comments back into an array
                {
                    $group: {
                        _id: "$_id",
                        postId: { $first: "$postId" },
                        comments: { $push: "$comments" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" },
                    },
                },
            ]);
            console.log('comment in model', ...comments);
            return comments;
        });
    }
}
exports.commentRepositoryImpl = commentRepositoryImpl;
