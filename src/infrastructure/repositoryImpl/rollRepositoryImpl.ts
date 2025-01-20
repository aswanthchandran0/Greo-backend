import mongoose, { Types } from "mongoose";
import { Roll } from "../../domain/entities/roll";
import { RollRepository } from "../../domain/repositories/rollRepository";
import { IrollModel, RollModel } from "../database/mongo/models/rollModel";
import { RollDto } from "../../application/dto/rollDto";


export class RollRepositoryImpl implements RollRepository{
    async save(userId:string, thumbnail:string,mediaUrl: string, content: string): Promise<RollDto> {
        try{
            const rollModel = new RollModel({userId,thumbnail,mediaUrl,content})
            const savedRoll = await rollModel.save()
            return savedRoll
        }catch(err){
            console.log(err)
            throw err
        }
    }

    async getUserRoll(userId: mongoose.Types.ObjectId): Promise<RollDto[] | null> {
        const userRoll = await RollModel.aggregate([
            {
                $match: {
                    userId: userId,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData",
                },
            },
            {
                $lookup: {
                    from: "rollLike",
                    localField: "_id",
                    foreignField: "rollId",
                    as: "rollData",
                },
            },
            {
                $lookup: {
                    from: "rollComment",
                    localField: "_id",
                    foreignField: "rollId",
                    as: "commentData",
                },
            },
            // Lookup saved items for the user
            {
                $lookup: {
                    from: "saveditems",
                    let: { rollId: "$_id" }, // Pass the current rollId to the pipeline
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", userId] }, // Match the userId
                                        { $in: ["$$rollId", "$items.itemId"] }, // Check if rollId exists in items array
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
                $unwind: {
                    path: "$userData", // Deconstruct `userData` array to an object
                    preserveNullAndEmptyArrays: true, // Include results even if no user is found
                },
            },
            {
                $project: {
                    userId: 1,
                    thumbnail: 1,
                    mediaUrl: 1,
                    content: 1,
                    createdAt: 1,
                    name: "$userData.name",
                    userName: "$userData.user_name",
                    profileImage: "$userData.profileImage",
                    likeCount: {
                        $size: {
                            $ifNull: ["$rollData.users", []],
                        },
                    },
                    // Add the isSaved field
                    isSaved: {
                        $cond: {
                            if: { $gt: [{ $size: "$savedItemData" }, 0] },
                            then: true, // If savedItemData has items, the roll is saved
                            else: false, // Otherwise, it's not saved
                        },
                    },
                },
            },
        ]);
    
        console.log("user roll", userRoll);
        return userRoll;
    }
    

    async fetchLatestRolls(
        viewingUserId: mongoose.Types.ObjectId, 
        page: number, 
        pageSize: number
    ): Promise<RollDto[]> {
        try {
            const rolls = await RollModel.aggregate([
                { $sort: { createdAt: -1 } },
                { $skip: (page - 1) * pageSize },
                { $limit: pageSize },
                // Lookup user details
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userData",
                    },
                },
                // Lookup likes for the roll
                {
                    $lookup: {
                        from: "rolllikes",
                        localField: "_id",
                        foreignField: "rollId",
                        as: "likeData",
                    },
                },
                // Lookup comments for the roll
                {
                    $lookup: {
                        from: "rollcomments",
                        localField: "_id",
                        foreignField: "rollId",
                        as: "commentData",
                    },
                },
                // Lookup saved items for the viewing user
                {
                    $lookup: {
                        from: "saveditems",
                        let: { rollId: "$_id" }, // Pass the current rollId to the pipeline
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$userId", viewingUserId] }, // Match the viewingUserId
                                            { $in: ["$$rollId", "$items.itemId"] }, // Check if rollId exists in items array
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
                // Unwind user data to include the user details
                {
                    $unwind: {
                        path: "$userData",
                        preserveNullAndEmptyArrays: true,
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
                                        in: { $add: ["$$value", { $size: "$$this.users" }] },
                                    },
                                },
                                else: 0,
                            },
                        },
    
                        commentCount: {
                            $cond: {
                                if: { $isArray: "$commentData" },
                                then: {
                                    $reduce: {
                                        input: "$commentData",
                                        initialValue: 0,
                                        in: { $add: ["$$value", { $size: "$$this.comments" }] },
                                    },
                                },
                                else: 0,
                            },
                        },
                        isLikedByViewingUser: {
                            $in: [
                                viewingUserId,
                                { $ifNull: [{ $arrayElemAt: ["$likeData.users", 0] }, []] },
                            ],
                        },
                        isSaved: {
                            $cond: {
                                if: { $gt: [{ $size: "$savedItemData" }, 0] },
                                then: true, // If savedItemData has items, the roll is saved
                                else: false, // Otherwise, it's not saved
                            },
                        },
                    },
                },
                // Project the final fields
                {
                    $project: {
                        userId: 1,
                        thumbnail: 1,
                        mediaUrl: 1,
                        content: 1,
                        createdAt: 1,
                        likeCount: 1,
                        commentCount: 1,
                        isLikedByViewingUser: 1,
                        isSaved: 1, // Include isSaved field
                        userName: "$userData.user_name",
                        profileImage: "$userData.profileImage",
                    },
                },
            ]);
            console.log('rolls', rolls);
            return rolls;
        } catch (err) {
            console.error("Error fetching latest rolls:", err);
            throw err;
        }
    }

async getAllRoll():Promise<IrollModel[] |null>{
    return await RollModel.find()
}

async delete(rollId: mongoose.Types.ObjectId): Promise<boolean> {
    const result = await RollModel.deleteOne({_id:rollId})
    return result.deletedCount === 1
}
    }