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
exports.UserSavingRepositoryImpl = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSavedItems_1 = __importDefault(require("../database/mongo/models/userSavedItems")); // Assuming this is the model for saving items
const postModel_1 = require("../database/mongo/models/postModel");
const rollModel_1 = require("../database/mongo/models/rollModel");
class UserSavingRepositoryImpl {
    // Save Post or Roll Item and Aggregate Related Data
    save(userId, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the item already exists
                const alreadyExist = yield userSavedItems_1.default.findOne({
                    userId: userId,
                    "items.itemId": item.itemId, // Check if the itemId already exists in the user's saved items
                    "items.type": item.type, // Check if the type (post or reel) matches
                });
                if (alreadyExist) {
                    console.log("Item already exists in the saved items list");
                    return null;
                }
                // Add the item to the saved items list
                yield userSavedItems_1.default.findOneAndUpdate({ userId: userId }, { $push: { items: item } }, { upsert: true, new: true });
                const itemObjectId = new mongoose_1.default.Types.ObjectId(item.itemId);
                // Define result type as any[] | null for aggregation results
                let result = null;
                // Aggregate data for Post
                if (item.type === "post") {
                    result = yield postModel_1.PostModel.aggregate([
                        { $match: { _id: itemObjectId } },
                        {
                            $lookup: {
                                from: "users",
                                localField: "userId",
                                foreignField: "_id",
                                as: "userDetails",
                            },
                        },
                        { $unwind: "$userDetails" },
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
                                likeCount: { $size: "$likeData" },
                                commentCount: { $size: "$commentData" },
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
                                userName: "$userDetails.user_name",
                                profileImage: "$userDetails.profileImage",
                            },
                        },
                    ]);
                }
                else if (item.type === "roll") {
                    // Aggregate data for Roll (Reel)
                    result = yield rollModel_1.RollModel.aggregate([
                        { $match: { _id: itemObjectId } },
                        {
                            $lookup: {
                                from: "users",
                                localField: "userId",
                                foreignField: "_id",
                                as: "userData",
                            },
                        },
                        { $unwind: "$userData" },
                        {
                            $lookup: {
                                from: "rollLikes",
                                localField: "_id",
                                foreignField: "rollId",
                                as: "rollLikeData",
                            },
                        },
                        {
                            $lookup: {
                                from: "rollComments",
                                localField: "_id",
                                foreignField: "rollId",
                                as: "rollCommentData",
                            },
                        },
                        {
                            $addFields: {
                                likeCount: { $size: "$rollLikeData" },
                                commentCount: { $size: "$rollCommentData" },
                                isLikedByViewingUser: {
                                    $in: [userId, {
                                            $ifNull: [{ $arrayElemAt: ["$likeData.users", 0] }, []]
                                        },]
                                }
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                thumbnail: 1,
                                mediaUrl: 1,
                                content: 1,
                                createdAt: 1,
                                likeCount: 1,
                                commentCount: 1,
                                isLikedByViewingUser: 1,
                                userName: "$userData.user_name",
                                profileImage: "$userData.profileImage",
                            },
                        },
                    ]);
                }
                // Ensure result exists and is not empty
                if (!result || result.length === 0) {
                    console.error("No data found for item ID:", item.itemId);
                    return null;
                }
                // Prepare the SavedItemDto
                const savedItemDto = {
                    userId: userId.toString(),
                    items: [
                        {
                            itemId: item.itemId.toString(),
                            type: item.type,
                            collectionName: item.collectionName,
                            postData: item.type === "post" ? result[0] : undefined,
                            rollData: item.type === "roll" ? result[0] : undefined,
                        },
                    ],
                };
                return savedItemDto;
            }
            catch (error) {
                console.error("Error saving item and fetching related data:", error);
                throw error;
            }
        });
    }
    delete(userId, itemId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find and update the document by pulling the item from the items array
                const result = yield userSavedItems_1.default.updateOne({ userId: userId }, // Match the userId
                { $pull: { items: { itemId: itemId, type: type } } } // Remove the specific item based on itemId and type
                );
                if (result.modifiedCount > 0) {
                    console.log(`Item with ID ${itemId} successfully deleted.`);
                    return true; // Successfully deleted
                }
                else {
                    console.log(`No item with ID ${itemId} found for deletion.`);
                    return false; // Item not found
                }
            }
            catch (error) {
                console.error("Error deleting item:", error);
                throw error; // Re-throw the error for further handling
            }
        });
    }
    // Find All Saved Items by User ID
    findAllSavedItems(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedItems = yield userSavedItems_1.default.find({ userId: userId }).lean();
                if (!savedItems || savedItems.length === 0) {
                    return null;
                }
                const result = yield Promise.all(savedItems.map((savedItem) => __awaiter(this, void 0, void 0, function* () {
                    // Iterate over all items in the savedItem
                    const processedItems = yield Promise.all(savedItem.items.map((item) => __awaiter(this, void 0, void 0, function* () {
                        const itemObjectId = new mongoose_1.default.Types.ObjectId(item.itemId);
                        let resultData = null;
                        if (item.type === "post") {
                            resultData = yield postModel_1.PostModel.aggregate([
                                { $match: { _id: itemObjectId } },
                                {
                                    $lookup: {
                                        from: "users",
                                        localField: "userId",
                                        foreignField: "_id",
                                        as: "userDetails",
                                    },
                                },
                                { $unwind: "$userDetails" },
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
                                        likeCount: { $size: "$likeData" },
                                        commentCount: { $size: "$commentData" },
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
                                        userName: "$userDetails.user_name",
                                        profileImage: "$userDetails.profileImage",
                                    },
                                },
                            ]);
                        }
                        else if (item.type === "roll") {
                            resultData = yield rollModel_1.RollModel.aggregate([
                                { $match: { _id: itemObjectId } },
                                {
                                    $lookup: {
                                        from: "users",
                                        localField: "userId",
                                        foreignField: "_id",
                                        as: "userData",
                                    },
                                },
                                { $unwind: "$userData" },
                                {
                                    $lookup: {
                                        from: "rollLikes",
                                        localField: "_id",
                                        foreignField: "rollId",
                                        as: "rollLikeData",
                                    },
                                },
                                {
                                    $lookup: {
                                        from: "rollComments",
                                        localField: "_id",
                                        foreignField: "rollId",
                                        as: "rollCommentData",
                                    },
                                },
                                {
                                    $addFields: {
                                        likeCount: { $size: "$rollLikeData" },
                                        commentCount: { $size: "$rollCommentData" },
                                        isLikedByViewingUser: {
                                            $in: [
                                                userId,
                                                {
                                                    $ifNull: [{ $arrayElemAt: ["$rollLikeData.users", 0] }, []],
                                                },
                                            ],
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        thumbnail: 1,
                                        mediaUrl: 1,
                                        content: 1,
                                        createdAt: 1,
                                        likeCount: 1,
                                        commentCount: 1,
                                        isLikedByViewingUser: 1,
                                        userName: "$userData.user_name",
                                        profileImage: "$userData.profileImage",
                                    },
                                },
                            ]);
                        }
                        return {
                            itemId: item.itemId.toString(),
                            type: item.type,
                            collectionName: item.collectionName,
                            postData: item.type === "post" ? resultData && resultData[0] : undefined,
                            rollData: item.type === "roll" ? resultData && resultData[0] : undefined,
                        };
                    })));
                    // Construct the final result for this savedItem
                    return {
                        userId: userId.toString(),
                        items: processedItems,
                    };
                })));
                return result;
            }
            catch (error) {
                console.error("Error fetching saved items:", error);
                throw error;
            }
        });
    }
}
exports.UserSavingRepositoryImpl = UserSavingRepositoryImpl;
