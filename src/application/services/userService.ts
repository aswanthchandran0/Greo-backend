import mongoose, { mongo, Types } from "mongoose";
import { ClientSession, Schema } from "mongoose";
import { SignupUser } from "../../domain/useCases/signupUser";
import { UserGraphService } from "./userGraphService";
import {
  SignInResponse,
  GoogleSignUpResponse,
  GoogleSignInResponse,
  userWithPosts,
  Result,
  SignUpResponse,
  IFollowers,
  SinglePost,
} from "../dto/userDto";
import { userRepository } from "../../domain/repositories/userRepository";
import { User } from "../../domain/entities/user";
import { VerifyOtp } from "../../domain/useCases/verifiOtp";
import { SigninUser } from "../../domain/useCases/signinUser";
import { SignUpWithGoogle } from "../../domain/useCases/signUpWithGoogle";
import { SignInWithGoogle } from "../../domain/useCases/signInWithGoogle";
import tokenService from "./tokenService";
import { GenerateForgotPasswordToken } from "../../domain/useCases/generateForgotPasswordToken";
import { UpdatePassword } from "../../domain/useCases/UpdatePassword";
import { ResentOtp } from "../../domain/useCases/resentOtp";
import { GetUserProfile } from "../../domain/useCases/getUserProfile";
import { UpdateProfile } from "../../domain/useCases/updateProfile";
import { CheckUserNameAvailabilty } from "../../domain/useCases/userNameAvailabilty";
import { CloudinaryService } from "./cloudnaryService";
import { UploadPost } from "../../domain/useCases/uploadPost";
import { GetUserFeed } from "../../domain/useCases/getUserFeed";
import { LikePost } from "../../domain/useCases/likePost";
import { UnlikePost } from "../../domain/useCases/unlikePost";
import { PostComment } from "../../domain/useCases/postComment";
import { PostRepository } from "../../domain/repositories/postRepository";
import { CommentDto, RollCommentDto } from "../dto/commentDto";
import { GetComments } from "../../domain/useCases/getComments";
import { GetUserByUserId } from "../../domain/useCases/getUserByUserId";
import { getFollowers } from "../../domain/useCases/getFollowers";
import { RollUpload } from "../../domain/useCases/rollUpload";
import { RollDto } from "../dto/rollDto";
import { GetUserRoll } from "../../domain/useCases/getUserRoll";
import { RollPostComment } from "../../domain/useCases/rollPostComment";
import { RollGetComments } from "../../domain/useCases/rollGetComments";
import { RollLikePost } from "../../domain/useCases/rollLikePost";
import { RollUnlikePost } from "../../domain/useCases/rollUnlikePost";
import { fetchLatestRolls } from "../../domain/useCases/fetchLatestRoll";
import { DeletePost } from "../../domain/useCases/deletePost";
import { UpdatePost } from "../../domain/useCases/updatePost";
import { ReportPost } from "../../domain/useCases/reportPost";
import { ReasonType } from "../../infrastructure/database/mongo/models/postReportModel";
import { searchUsers } from "../../domain/useCases/searchUsers";
import { GetLikedUsers } from "../../domain/useCases/getLikedUsers";
import { FetchForExpolore } from "../../domain/useCases/fetchForExplore";
import { GetSingelPost } from "../../domain/useCases/getSingelPost";
import { IPost } from "../../infrastructure/database/mongo/models/postModel";
import { UserSaveItem } from "../../domain/useCases/userSaveItems";
import { SavedItemArrayElement } from "../../domain/entities/saveItems";
import { SavedItemDto } from "../dto/savedItemDto";
import { DeleteSavedItem } from "../../domain/useCases/deleteSavedItem";
import { FindSavedItems } from "../../domain/useCases/findSavedItems";
import { SaveNotifcation } from "../../domain/useCases/saveNotification";
import { Notification } from "../../domain/entities/notification";
import { NotificationDto } from "../dto/notificationDto";
import { DeleteNotification } from "../../domain/useCases/deleteNotification";
import { GetUserNotification } from "../../domain/useCases/getUserNotification";
import { NotificationUpdate } from "../../domain/useCases/notificationUpdate";
import { DeleteRoll } from "../../domain/useCases/deleteRoll";
// import { User, UserProfile } from "../../domain/entities/user";
// import { GetUserProfile } from "../../domain/useCases/getUserProfile";
// import { SendOtp } from "../../domain/useCases/sentOtp";
// import { GetPosts } from "../../domain/useCases/getPosts";
// import { SentComment } from "../../domain/useCases/sentComment";
// import { PostRepository } from "../../domain/repositories/postRepository";
// import { UpdateUserProfile } from "../../domain/useCases/updateUserProfile";
// import tokenService from "./tokenService";
// import { Post } from "../../domain/entities/post";
// import { UpdatePost } from "../../domain/useCases/updatePost";
// import { DeletePost } from "../../domain/useCases/deletePost";

export class UserService {
  constructor(
    private userReposiory: userRepository,
    private signupUser: SignupUser,
    private userGraphService: UserGraphService,
    private verifyUserOtp: VerifyOtp,
    private signinUser: SigninUser,
    private signupWithGoogle: SignUpWithGoogle,
    private signinWithGoogle: SignInWithGoogle,
    private generateForgotPasswordToken: GenerateForgotPasswordToken,
    private updatePassword: UpdatePassword,
    private resentOtp: ResentOtp,
    private getUserProfile: GetUserProfile,
    private updateProfile: UpdateProfile,
    private checkUserNameAvailabilty: CheckUserNameAvailabilty,
    private cloudinaryService: CloudinaryService,
    private uploadPost: UploadPost,
    private getUserFeed: GetUserFeed,
    private likePostUseCase: LikePost,
    private unlikePostUseCase: UnlikePost,
    private postComment: PostComment,
    private getComments: GetComments,
    private getUserByUserid: GetUserByUserId,
    private getFollowers: getFollowers,
    private rollUpload: RollUpload,
    private getUserRoll: GetUserRoll,
    private rollPostComment: RollPostComment,
    private rollGetComment: RollGetComments,
    private rollLikePosts: RollLikePost,
    private rollUnlikePosts: RollUnlikePost,
    private fetchLatesRolls: fetchLatestRolls,
    private deletePost: DeletePost,
    private updatePost: UpdatePost,
    private reportPost: ReportPost,
    private searchUsers: searchUsers,
    private getLikedUsers: GetLikedUsers ,
    private fetchForExplore:FetchForExpolore,
    private getSinglePost:GetSingelPost,
    private userSaveItems:UserSaveItem,
    private deleteSavedItem:DeleteSavedItem,
    private findSavedItems:FindSavedItems,
    private saveNotification:SaveNotifcation,
    private deleteNotification:DeleteNotification,
    private getUserNotification:GetUserNotification,
    private notificationUpdate:NotificationUpdate,
    private delteRoll:DeleteRoll
    //         private getUserProfile:GetUserProfile,
  ) //  private postRepository:PostRepository,
  //         private sentOtp:SendOtp,
  //         private getPosts:GetPosts,
  //         private sentComment:SentComment,
  //         private updateUserProfile: UpdateUserProfile,
  {}

  async signup(userData: {
    name: string;
    email: string;
    password: string;
    publicKey: string;
  }): Promise<SignUpResponse> {
    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();
    try {
      const signUpResponse = await this.signupUser.execute(userData);
      if (signUpResponse && signUpResponse.user.id) {
        await this.userGraphService.createUser(
          signUpResponse.user.id.toString(),
          userData.name
        );
      }
      await session.commitTransaction();
      return signUpResponse;
    } catch (error) {
      await session.abortTransaction();
      console.error("failed signup process, rolling back:", error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async verifyOtp(
    userId: mongoose.Types.ObjectId,
    otpCode: string
  ): Promise<boolean> {
    return await this.verifyUserOtp.execute(userId, otpCode);
  }

  async signin(email: string, password: string): Promise<SignInResponse> {
    return await this.signinUser.execute(email, password);
  }
  async googleSignup(
    token: string,
    publicKey: string
  ): Promise<GoogleSignUpResponse> {
    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();
    try {
      const googleSignUpResponse = await this.signupWithGoogle.execute(
        token,
        session,
        publicKey
      );

      if (googleSignUpResponse && googleSignUpResponse.user.id) {
        await this.userGraphService.createUser(
          googleSignUpResponse.user.id.toString(),
          googleSignUpResponse.user.user_name
        );
      }
      await session.commitTransaction();
      return googleSignUpResponse;
    } catch (error) {
      await session.abortTransaction();
      console.error("failed google signup process, rolling back:", error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async googleSignin(token: string): Promise<GoogleSignInResponse> {
    return await this.signinWithGoogle.execute(token);
  }

  async refreshToken(refreshToken: string) {
    return tokenService.refreshTokens(refreshToken);
  }

  async GenerateForgotPasswordToken(email: string) {
    return this.generateForgotPasswordToken.execute(email);
  }

  async UpdatePassword(token: string, password: string) {
    return this.updatePassword.execute(token, password);
  }

  async ResentOtp(email: string): Promise<void> {
    await this.resentOtp.execute(email);
  }

  async GetUserProfile(userId: mongoose.Types.ObjectId, username: string) {
    return this.getUserProfile.execute(userId, username);
  }
  async updateUserProfile(userData: Partial<User>): Promise<User | null> {
    return await this.updateProfile.execute(userData);
  }

  async CheckUserNameAvailabilty(
    userId: mongoose.Types.ObjectId,
    userName: string
  ) {
    return await this.checkUserNameAvailabilty.execute(userId, userName);
  }

  async postUpload(
    filesPaths: string[],
    folderName: string,
    userId: Schema.Types.ObjectId,
    mediaType: string,
    comment: string
  ) {
    const mediaUrls = await this.cloudinaryService.uploadToCloudinary(
      filesPaths,
      folderName
    );
    const secureUrl = mediaUrls.map(
      (file: { secure_url: any }) => file.secure_url
    );
    return this.uploadPost.execute(
      secureUrl,
      filesPaths,
      userId,
      mediaType,
      comment
    );
  }

  async GetUserFeed(userId: mongoose.Types.ObjectId,skip: number, limit: number) {
    return this.getUserFeed.execute(userId,skip,limit);
  }

  async LikePosts(
    userId: mongoose.Types.ObjectId,
    postIds: mongoose.Types.ObjectId[]
  ): Promise<void> {
    return this.likePostUseCase.execute(userId, postIds);
  }

  async UnlikePosts(
    userId: mongoose.Types.ObjectId,
    postIds: mongoose.Types.ObjectId[]
  ): Promise<void> {
    return this.unlikePostUseCase.execute(userId, postIds);
  }

  async PostComment(
    userId: mongoose.Types.ObjectId,
    postId: mongoose.Types.ObjectId,
    content: string
  ): Promise<CommentDto | null> {
    return this.postComment.execute(userId, postId, content);
  }

  async GetComments(postId: mongoose.Types.ObjectId) {
    return this.getComments.execute(postId);
  }

  async getUserByUserId(userId: mongoose.Types.ObjectId): Promise<User | null> {
    return await this.getUserByUserid.execute(userId);
  }

  async getFollowerFollowings(followers: IFollowers[]): Promise<User[] | null> {
    return await this.getFollowers.execute(followers);
  }

  async rollUploadService(
    userId: string,
    thumbnail: string,
    mediaUrl: string,
    content: string
  ): Promise<RollDto> {
    return await this.rollUpload.execute(userId, thumbnail, mediaUrl, content);
  }

  async getUserRollService(
    userId: mongoose.Types.ObjectId
  ): Promise<RollDto[] | null> {
    return await this.getUserRoll.execute(userId);
  }

  async RollPostComment(
    userId: mongoose.Types.ObjectId,
    rollId: mongoose.Types.ObjectId,
    content: string
  ): Promise<RollCommentDto | null> {
    return this.rollPostComment.execute(userId, rollId, content);
  }

  async RollGetComments(rollId: mongoose.Types.ObjectId) {
    return this.rollGetComment.execute(rollId);
  }

  async RollLikePosts(
    userId: mongoose.Types.ObjectId,
    rollIds: mongoose.Types.ObjectId[]
  ): Promise<void> {
    return this.rollLikePosts.execute(userId, rollIds);
  }

  async RollUnlikePosts(
    userId: mongoose.Types.ObjectId,
    rollIds: mongoose.Types.ObjectId[]
  ): Promise<void> {
    return this.rollUnlikePosts.execute(userId, rollIds);
  }

  async FetchLatesRoll(
    viewingUserId: mongoose.Types.ObjectId,
    page: number,
    pageSize: number
  ): Promise<RollDto[]> {
    return await this.fetchLatesRolls.execute(viewingUserId, page, pageSize);
  }

  async deleteUserPost(postId: mongoose.Types.ObjectId): Promise<void> {
    return await this.deletePost.execute(postId);
  }

  async updateUserPost(
    userId: mongoose.Types.ObjectId,
    postId: mongoose.Types.ObjectId,
    content: string
  ): Promise<void> {
    return await this.updatePost.execute(userId, postId, content);
  }

  async postReportingService(
    postId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    reason: ReasonType
  ) {
    return await this.reportPost.execute(postId, userId, reason);
  }

  async SearchUsers(query: string) {
    return await this.searchUsers.execute(query);
  }

  async GetLikedUsers(productId: mongoose.Types.ObjectId) {
    return await this.getLikedUsers.execute(productId);
  }

  async ExploreFetchservice(viewingUserId: mongoose.Types.ObjectId, page: number, pageSize: number){
    console.log('userid',viewingUserId)
    console.log('page',page)
    console.log('page size',pageSize)
     return await this.fetchForExplore.execute(viewingUserId,page,pageSize)
  }

  async GetSinglePost(postId:mongoose.Types.ObjectId,userId: mongoose.Types.ObjectId):Promise<IPost | null>{
    return await this.getSinglePost.execute(postId,userId)
  }

  async SaveItems(userId:mongoose.Types.ObjectId,item:SavedItemArrayElement): Promise<SavedItemDto | null>{
  return await this.userSaveItems.execute(userId,item)
  }

  async DeleteSavedItem( userId: mongoose.Types.ObjectId,itemId: string,type: "post" | "roll"): Promise<boolean> {
             return await this.deleteSavedItem.execute(userId, itemId, type)
          }

  async FindSavedItems(userId:mongoose.Types.ObjectId):Promise<SavedItemDto[] | null>{
    return await this.findSavedItems.execute(userId)
  }

  async SaveNotification(notificationData:Notification):Promise<NotificationDto>{
    return await this.saveNotification.execute(notificationData)
  }

  async DeleteNotifcation(userId: Types.ObjectId, entityId: Types.ObjectId, initiatorId: Types.ObjectId,type:string){
       return await this.deleteNotification.execute(userId,entityId,initiatorId,type)
  }

  async GetUserNotification(userId:Types.ObjectId){
    return await this.getUserNotification.execute(userId)
  }

  async updateNotification(userId:Types.ObjectId){
    return await this.notificationUpdate.execute(userId)
  }

  async DeleteRoll(rollId:Types.ObjectId){
    return await this.delteRoll.execute(rollId)
  }
  //    async getProfile(user_id:mongoose.Types.ObjectId):Promise<UserProfile |null>{
  //        return this.getUserProfile.execute(user_id)
  //    }

  //    async GetPosts(ObjectUserId:mongoose.Types.ObjectId){
  //     return this.getPosts.execute(ObjectUserId)
  //    }

  //    async GetPostsByUserName(userName: string): Promise<Post[] | null> {
  //     return this.postRepository.getPostsByUserName(userName);
  //   }

  //   async SentComment(postId:mongoose.Types.ObjectId,userId:mongoose.Types.ObjectId,content:string){
  //     return this.sentComment.execute(postId,userId,content)
  //   }

  //   async updateProfile(userId: Schema.Types.ObjectId, userData: Partial<User>,profileImage:Express.Multer.File| undefined): Promise<Result<User>>  {
  //    let profileImageUrl
  //     if(profileImage){
  //        profileImageUrl = await this.cloudinaryService.uploadToCloundinary([profileImage.path], 'profile')
  //        profileImageUrl = profileImage?profileImageUrl[0].secure_url:null
  //     }
  //    return await this.updateUserProfile.execute(userId,userData,profileImageUrl);
  // }
}
