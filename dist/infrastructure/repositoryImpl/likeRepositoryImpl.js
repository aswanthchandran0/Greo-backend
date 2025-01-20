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
exports.LikeRepositoryImpl = void 0;
const likeMode_1 = require("../database/mongo/models/likeMode");
class LikeRepositoryImpl {
    likePosts(userId, postIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.all(postIds.map((postId) => __awaiter(this, void 0, void 0, function* () {
                    yield likeMode_1.LikeModel.updateOne({ postId: postId }, { $addToSet: { users: userId } }, { upsert: true });
                })));
            }
            catch (err) {
                console.log('Error in like posting', err);
            }
        });
    }
    unlikePosts(userId, postIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.all(postIds.map((postId) => __awaiter(this, void 0, void 0, function* () {
                    yield likeMode_1.LikeModel.updateOne({ postId }, { $pull: { users: userId } });
                })));
            }
            catch (err) {
                console.log("Error in unliking posts", err);
            }
        });
    }
    getLikedUsers(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield likeMode_1.LikeModel.aggregate([
                { $match: { postId } },
                {
                    $lookup: {
                        from: "users",
                        localField: "users",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                { $unwind: "$userDetails" },
                {
                    $project: {
                        "userDetails.password": 0,
                    },
                },
            ]);
            return result.map((item) => item.userDetails) || null;
        });
    }
}
exports.LikeRepositoryImpl = LikeRepositoryImpl;
