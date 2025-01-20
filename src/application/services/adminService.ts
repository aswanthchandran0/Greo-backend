import { SigninAdmin } from "../../domain/useCases/adminSignin";
import { Admin } from "../../domain/entities/admin";
import { AdminUserManagement } from "../../domain/useCases/adminUserManagement";
import { User } from "../../domain/entities/user";
import { adminResponse } from "../dto/adminDto";
import mongoose, { mongo, Schema, Types } from "mongoose";
import { TopFollowerUser, TopFollowerUserDto, UserDetails } from "../dto/userDto";
import { GetUserDetails } from "../../domain/useCases/getUserDetails";
import { FetchReportedPosts } from "../../domain/useCases/fetchReportedPost";
import { IpostReport } from "../../infrastructure/database/mongo/models/postReportModel";
import { FindStackOfUser } from "../../domain/useCases/findStackOfUser";
import { Iuser } from "../../infrastructure/database/mongo/models/userModel";
import { GetTopTenUsers } from "../../domain/useCases/getTop10Users";
import { FetchPostsAndRollsDto } from "../dto/postsAndRollsDto";
import { FetchPostsAndRolls } from "../../domain/useCases/fetchAllPostsAndRolls";
import { BlockPost } from "../../domain/useCases/blockPost";
export class AdminService {
  constructor(
    private signinAdmin: SigninAdmin,
    private adminUserManagement: AdminUserManagement,
    private getUserDetails: GetUserDetails,
    private fetchReportedPosts: FetchReportedPosts,
    private findStackOfUser:FindStackOfUser,
    private getTop10users:GetTopTenUsers,
    private fetchAllPostsAndRolls:FetchPostsAndRolls,
    private blockPost:BlockPost
  ) {}
  async signin(email: string, password: string): Promise<adminResponse> {
    const response = await this.signinAdmin.execute(email, password);
    if (!response) {
      throw new Error("Authentication failed");
    }
    return {
      admin: response.admin,
      tokens: response.tokens,
    };
  }

  // admin User mangement
  async getAllUser(): Promise<User[]> {
    return await this.adminUserManagement.getAllUsers();
  }
  async getUserById(user_id: mongoose.Types.ObjectId): Promise<User | null> {
    return await this.adminUserManagement.getUserById(user_id);
  }

  async updateUser(user: User): Promise<void> {
    await this.adminUserManagement.updateUser(user);
  }

  async suspendUser(user_id: mongoose.Types.ObjectId): Promise<void> {
    await this.adminUserManagement.suspendUser(user_id);
  }

  async unSuspendUser(user_id: mongoose.Types.ObjectId): Promise<void> {
    await this.adminUserManagement.unsuSpendUser(user_id);
  }

  async GetUserDetailsService(
    userId: mongoose.Types.ObjectId
  ): Promise<UserDetails | null> {
    return await this.getUserDetails.execute(userId);
  }

  async GetReportedPosts(): Promise<IpostReport[] | null> {
    return await this.fetchReportedPosts.execute();
  }

  async FindStackOfUser(userIds:mongoose.Types.ObjectId[]):Promise<Iuser[] | null>{
    return await this.findStackOfUser.execute(userIds)
  }

  async GetTop10Users():Promise<TopFollowerUserDto[]>{
    return await this.getTop10users.execute()
  }

  async getPostsAndRoll():Promise<FetchPostsAndRollsDto>{
    return await this.fetchAllPostsAndRolls.execute()
  }

  async blockUserPost(postId:Types.ObjectId,action:boolean):Promise<boolean>{
    return await this.blockPost.execute(postId,action)
  }
}
