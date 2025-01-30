import { userRepository } from "../../domain/repositories/userRepository";
import { User } from "../../domain/entities/user";
import { Iuser, UserModel } from "../database/mongo/models/userModel";
import { session } from "neo4j-driver";
import mongoose, { ClientSession, Mongoose } from "mongoose";
import { IFollowers, TopFollowerUserDto } from "../../application/dto/userDto";
import { getSession } from "../database/neo4j/neo4jConfig";

export class UserRepositoryImpl implements userRepository {
  async save(user: User, session?: ClientSession): Promise<User> {
    const userModel = new UserModel(user);
    const savedUserModel = await userModel.save({ session });
    return new User(
      savedUserModel._id,
      savedUserModel.name,
      savedUserModel.profileImage,
      savedUserModel.user_name,
      savedUserModel.email,
      savedUserModel.user_bio,
      savedUserModel.lastseen_online,
      savedUserModel.password,
      savedUserModel.user_gender,
      savedUserModel.private_account,
      savedUserModel.is_suspended,
      savedUserModel.is_verified,
    );
  }

  async findByEmail(
    email: string,
    session?: ClientSession
  ): Promise<User | null> {
    const userModel = await UserModel.findOne({ email })
      .session(session ?? null)
      .exec();
    return userModel
      ? new User(
          userModel._id,
          userModel.name,
          userModel.profileImage,
          userModel.user_name,
          userModel.email,
          userModel.user_bio,
          userModel.lastseen_online,
          userModel.password,
          userModel.user_gender,
          userModel.private_account,
          userModel.is_suspended,
          userModel.is_verified,
        )
      : null;
  }
  async findByUserName(
    userName: string,
    session?: ClientSession
  ): Promise<User | null> {
    const user = await UserModel.findOne({ user_name: userName })
      .session(session ?? null)
      .exec();

    return user
      ? new User(
          user._id,
          user.name,
          user.profileImage,
          user.user_name,
          user.email,
          user.user_bio,
          user.lastseen_online,
          user.password,
          user.user_gender,
          user.private_account,
          user.is_suspended,
          user.is_verified,
        )
      : null;
  }

  async findByUserId(userId: mongoose.Types.ObjectId): Promise<User | null> {
    const user = await UserModel.findById(userId).exec();
    return user
      ? new User(
          user._id,
          user.name,
          user.profileImage,
          user.user_name,
          user.email,
          user.user_bio,
          user.lastseen_online,
          user.password,
          user.user_gender,
          user.private_account,
          user.is_suspended,
          user.is_verified,
        )
      : null;
  }

  async updatePassword(userId: string, password:string): Promise<void> {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, { password }).exec();
}

async updateUser(userId: mongoose.Types.ObjectId, updateField: Partial<User>): Promise<User | null> {
  const  user  =    await UserModel.findByIdAndUpdate(userId, updateField,{new:true}).exec();
    return user
      ? new User(
          user._id,
          user.name,
          user.profileImage,
          user.user_name,
          user.email,
          user.user_bio,
          user.lastseen_online,
          user.password,
          user.user_gender,
          user.private_account,
          user.is_suspended,
          user.is_verified,
        )
      : null;
}

async deleteUser(userId: mongoose.Types.ObjectId): Promise<void> {
    await UserModel.findByIdAndDelete(userId).exec();
}


async getArrayOfUsers(followers: IFollowers[]): Promise<User[] | null> {
     const userObjIds = followers.map((follower) => new mongoose.Types.ObjectId(follower.id))
    const users = await UserModel.find({_id:{$in:userObjIds}})
    return users.length > 0
    ? users.map(
        (user) =>
          new User(
            user._id,
            user.name,
            user.profileImage,
            user.user_name,
            user.email,
            user.user_bio,
            user.lastseen_online,
            user.password,
            user.user_gender,
            user.private_account,
            user.is_suspended,
            user.is_verified,
          )
      )
    : null;
}

  async searchUsers(query: string): Promise<Iuser[]> {
    try {

      
     const users = await UserModel.find({
      $or:[
        { name: { $regex: query, $options: "i" } },
        { user_name: { $regex: query, $options: "i" } }, 
      ]
     })
     .select("-password")
     .exec()

     return users

    } catch (error) {
      console.error("Error searching users:", error);
      throw new Error("Something went wrong");
    }
     
  }


 async  findStackOfUser(userIds: mongoose.Types.ObjectId[]): Promise<Iuser[] | null> {

  console.log('user ids in repository',userIds)
        const users = await UserModel.find({_id:{$in:userIds}})
      return users 
  }



  async getUsersWithPagination(
    userId: mongoose.Types.ObjectId,
    page: number,
    limit: number = 8
  ): Promise<{ users: TopFollowerUserDto[]; totalUsers: number }> {
    try {
      const totalUsers = await UserModel.countDocuments();
  
      // Fetch users with pagination
      const users = await UserModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-password")
        .exec();
  
      // Create a session for the Neo4j queries
      const session = getSession(); // Assuming getSession is defined elsewhere
  
      // For each user, fetch the followers count and check if the current user is following them
      const userDtos: TopFollowerUserDto[] = [];
      for (const user of users) {
        // Query to get the followers count
        const followersQuery = `
          MATCH (u:User {id: $userId})<-[:FOLLOWS]-(f:User)
          RETURN COUNT(f) AS FollowersCount
        `;
        const followersResult = await session.run(followersQuery, { userId: user._id.toString() });
        const followersCount = followersResult.records.length > 0 ? followersResult.records[0].get('FollowersCount').toInt() : 0;
  
        // Query to check if the current user is following this user
        const isFollowingQuery = `
          MATCH (u:User {id: $currentUserId})-[:FOLLOWS]->(f:User {id: $targetUserId})
          RETURN COUNT(u) > 0 AS IsFollowing
        `;
        const isFollowingResult = await session.run(isFollowingQuery, {
          currentUserId: userId.toString(),
          targetUserId: user._id.toString(),
        });
        const isFollowing = isFollowingResult.records.length > 0 ? isFollowingResult.records[0].get('IsFollowing') : false;
  
        // Only include users that the current user is NOT following
        if (!isFollowing) {
          const userDto: TopFollowerUserDto = {
            _id: user._id,
            name: user.name,
            profileImage: user.profileImage,
            user_name: user.user_name,
            email: user.email,
            user_bio: user.user_bio,
            lastseen_online: user.lastseen_online,
            user_gender: user.user_gender,
            private_account: user.private_account,
            is_suspended: user.is_suspended,
            is_verified: user.is_verified,
            publicKey: user.publicKey,
            createdAt: user.createdAt,
            followersCount: followersCount,
          };
  
          userDtos.push(userDto);
        }
      }
  
      await session.close(); // Close session after processing all users
  
      // Return only the users that the current user is not following
      return { users: userDtos, totalUsers: totalUsers };
    } catch (error) {
      console.error("Error fetching paginated users with followers count:", error);
      throw new Error("Something went wrong");
    }
  }

}
