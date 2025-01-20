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
exports.RollCommentRepositoryImpl = void 0;
const userModel_1 = require("../database/mongo/models/userModel");
const rollCommentModel_1 = require("../database/mongo/models/rollCommentModel");
class RollCommentRepositoryImpl {
    save(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingComments = yield rollCommentModel_1.RollCommentModel.findOne({ rollId: comment.rollId }).exec();
                const user = yield userModel_1.UserModel.findById(comment.comments[0].userId).exec();
                if (existingComments && user) {
                    existingComments.comments.push(...comment.comments);
                    const savedPost = yield existingComments.save();
                    const savedComment = comment.comments[0];
                    const RollCommentDto = {
                        rollId: savedPost.rollId,
                        userId: savedComment.userId,
                        content: savedComment.content,
                        createdAt: savedComment.createdAt,
                        userDetails: {
                            _id: user._id,
                            user_name: user.user_name,
                            profileImage: user.profileImage
                        },
                    };
                    return RollCommentDto;
                }
                else if (!existingComments) {
                    if (user) {
                        const newCommentModel = new rollCommentModel_1.RollCommentModel({
                            rollId: comment.rollId,
                            comments: comment.comments,
                            createdAt: new Date(),
                        });
                        const savedNewComment = yield newCommentModel.save();
                        const savedComment = savedNewComment.comments[0];
                        const RollCommentDto = {
                            rollId: savedNewComment.rollId,
                            userId: savedComment.userId,
                            content: savedComment.content,
                            createdAt: savedComment.createdAt || new Date(),
                            userDetails: {
                                _id: user._id,
                                user_name: user.user_name,
                                profileImage: user.profileImage
                            },
                        };
                        return RollCommentDto;
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
    findByRollId(rollId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('rollid in roll finding', rollId);
            const rollComments = yield rollCommentModel_1.RollCommentModel.aggregate([
                {
                    $match: {
                        rollId: rollId
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
                        rollId: { $first: "$rollId" },
                        comments: { $push: "$comments" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" },
                    },
                },
            ]);
            return rollComments;
        });
    }
}
exports.RollCommentRepositoryImpl = RollCommentRepositoryImpl;
