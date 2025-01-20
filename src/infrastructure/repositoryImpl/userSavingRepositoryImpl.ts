import mongoose, { Collection, Types } from "mongoose";
import { SavedItemDto } from "../../application/dto/savedItemDto";
import SavedItemModel from "../database/mongo/models/userSavedItems"; // Assuming this is the model for saving items
import { UserSavingRepository } from "../../domain/repositories/userSavingRepository";
import { SavedItemArrayElement } from "../../domain/entities/saveItems";
import { PostModel } from "../database/mongo/models/postModel";
import { RollModel } from "../database/mongo/models/rollModel";

export class UserSavingRepositoryImpl implements UserSavingRepository {
  // Save Post or Roll Item and Aggregate Related Data
  async save(userId: Types.ObjectId, item: SavedItemArrayElement): Promise<SavedItemDto | null> {
      try {
          // Check if the item already exists
          const alreadyExist = await SavedItemModel.findOne({
              userId: userId,
              "items.itemId": item.itemId, // Check if the itemId already exists in the user's saved items
              "items.type": item.type,    // Check if the type (post or reel) matches
          });

          if (alreadyExist) {
              console.log("Item already exists in the saved items list");
              return null;
          }

          // Add the item to the saved items list
          await SavedItemModel.findOneAndUpdate(
              { userId: userId },
              { $push: { items: item } },
              { upsert: true, new: true }
          );

          const itemObjectId = new mongoose.Types.ObjectId(item.itemId);

          // Define result type as any[] | null for aggregation results
          let result: any[] | null = null;

          // Aggregate data for Post
          if (item.type === "post") {
              result = await PostModel.aggregate([
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
          } else if (item.type === "roll") {
              // Aggregate data for Roll (Reel)
              result = await RollModel.aggregate([
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
                            isLikedByViewingUser:{
                            $in:[userId,{
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
          const savedItemDto: SavedItemDto = {
              userId: userId.toString(),
              items: [
                  {
                      itemId: item.itemId.toString(),
                      type: item.type as "post" | "roll",
                      collectionName: item.collectionName,
                      postData: item.type === "post" ? result[0] : undefined,
                      rollData: item.type === "roll" ? result[0] : undefined,
                  },
              ],
          };

          return savedItemDto;
      } catch (error) {
          console.error("Error saving item and fetching related data:", error);
          throw error;
      }
  }


  async delete(userId: Types.ObjectId, itemId: string, type: "post" | "roll"): Promise<boolean> {
    try {
        // Find and update the document by pulling the item from the items array
        const result = await SavedItemModel.updateOne(
            { userId: userId }, // Match the userId
            { $pull: { items: { itemId: itemId, type: type } } } // Remove the specific item based on itemId and type
        );

        if (result.modifiedCount > 0) {
            console.log(`Item with ID ${itemId} successfully deleted.`);
            return true; // Successfully deleted
        } else {
            console.log(`No item with ID ${itemId} found for deletion.`);
            return false; // Item not found
        }
    } catch (error) {
        console.error("Error deleting item:", error);
        throw error; // Re-throw the error for further handling
    }
}


   // Find All Saved Items by User ID
   async findAllSavedItems(userId: mongoose.Types.ObjectId): Promise<SavedItemDto[] | null> {
    try {
        const savedItems = await SavedItemModel.find({ userId: userId }).lean();

        if (!savedItems || savedItems.length === 0) {
            return null;
        }

        const result = await Promise.all(savedItems.map(async (savedItem) => {
            // Iterate over all items in the savedItem
            const processedItems = await Promise.all(savedItem.items.map(async (item) => {
                const itemObjectId = new mongoose.Types.ObjectId(item.itemId);
                let resultData: any[] | null = null;

                if (item.type === "post") {
                    resultData = await PostModel.aggregate([
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
                } else if (item.type === "roll") {
                    resultData = await RollModel.aggregate([
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
                    type: item.type as "post" | "roll",
                    collectionName: item.collectionName,
                    postData: item.type === "post" ? resultData && resultData[0] : undefined,
                    rollData: item.type === "roll" ? resultData && resultData[0] : undefined,
                };
            }));

            // Construct the final result for this savedItem
            return {
                userId: userId.toString(),
                items: processedItems,
            } as SavedItemDto;
        }));

        return result;
    } catch (error) {
        console.error("Error fetching saved items:", error);
        throw error;
    }
}


}