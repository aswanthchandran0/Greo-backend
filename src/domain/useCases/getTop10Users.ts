import { IUserGraphRepository } from "../../domain/repositories/userGraphRepository";
import mongoose from "mongoose";
import { TopFollowerUser, TopFollowerUserDto } from "../../application/dto/userDto";
import { Iuser } from "../../infrastructure/database/mongo/models/userModel";
import { userRepository } from "../repositories/userRepository";
import { UserGraphService } from "../../application/services/userGraphService";

export class GetTopTenUsers {
  constructor( 
    private userRepository: userRepository,
    private userGraphService:UserGraphService
  ) {}

  async execute(): Promise<TopFollowerUserDto[]> {
    // Step 1: Get top 10 users by follower count
    const topUsers = await this.userGraphService.getTop10Users()
    
    // Step 2: Extract user IDs from top users
    const userIds = topUsers.map(user => new mongoose.Types.ObjectId(user.id));

    // Step 3: Fetch user details for these IDs
    const usersDetails = await this.userRepository.findStackOfUser(userIds);

    // Step 4: Merge the follower count with the user details
    const result = topUsers.map(user => {
      const userDetails = usersDetails?.find(u => u.id.toString() === user.id);
 
      return {
        _id: userDetails?._id || new mongoose.Types.ObjectId(), // Provide a default value
        name: userDetails?.name || "Unknown User", // Default to a string
        profileImage: userDetails?.profileImage || "",
        user_name: userDetails?.user_name || "",
        email: userDetails?.email || "",
        user_bio: userDetails?.user_bio || "",
        lastseen_online: userDetails?.lastseen_online || "Offline",
        user_gender: userDetails?.user_gender || "prefer not to say",
        private_account: userDetails?.private_account || false,
        is_suspended: userDetails?.is_suspended || false,
        is_verified: userDetails?.is_verified || false,
        createdAt: userDetails?.createdAt || new Date(),
        followersCount: user.followersCount || 0, // Ensure it's a number
      };
      
    });

    const filteredResult = result.filter(user => {
      return (
        user.name !== "Unknown User" && // Exclude users with placeholder name
        user.followersCount > 0
      );
    });

    console.log("Filtered result", filteredResult);
    return filteredResult;

  }

}