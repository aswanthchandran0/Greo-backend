import { Request, Response } from "express";
import { UserService } from "../../application/services/userService";
import {
  SignInResponse,
  GoogleSignUpResponse,
  GoogleSignInResponse,
} from "../../application/dto/userDto";
import { UserGraphService } from "../../application/services/userGraphService";
import tokenService from "../../application/services/tokenService";
import { token } from "morgan";
import { Post } from "../../domain/entities/post";
import { PostComment } from "../../domain/useCases/postComment";
import mongoose, { mongo, Mongoose, Types } from "mongoose";
import { RollDto } from "../../application/dto/rollDto";
import { ReasonType } from "../../infrastructure/database/mongo/models/postReportModel";
import { SavedItemArrayElement } from "../../domain/entities/saveItems";
import { Notification } from "../../domain/entities/notification";
// // import { UserProfile } from "../../domain/entities/user";
// import { error } from "console";
// import { PostRepositoryImpl } from "../../infrastructure/repositoryImpl/postRepositoryImpl";
// import mongoose from "mongoose";
// import { Schema } from "mongoose";
export class UserController {
  constructor(
    private userService: UserService,
    private userGraphService: UserGraphService
  ) {}
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const signupResponse = await this.userService.signup(userData);
      res.status(201).json({
        user: {
          id: signupResponse.user.id,
          name: signupResponse.user.name,
          email: signupResponse.user.email,
          user_name: signupResponse.user.user_name,
        },
        otpSent: signupResponse.otpSent,
      });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { userId, otpCode } = req.body;
      const isValid = await this.userService.verifyOtp(userId, otpCode);

      if (isValid) {
        const accessToken = tokenService.generateAccessToken(userId);
        const refreshToken = tokenService.generateRefreshToken(userId);
        res.status(200).json({
          token: { accessToken: accessToken, refreshToken: refreshToken },
        });
      } else {
        res.status(400).json({ error: "Invalid OTP" });
      }
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async signin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (
        !email ||
        !password ||
        email.trim() === "" ||
        password.trim() === ""
      ) {
        throw new Error("email or password cannot be empty");
      }
      const SigninResponse: SignInResponse = await this.userService.signin(
        email,
        password
      );
      res.status(200).json({
        user: {
          id: SigninResponse.user.id,
          name: SigninResponse.user.name,
          profileImage: SigninResponse.user.profileImage,
          user_name: SigninResponse.user.user_name,
          email: SigninResponse.user.email,
          user_bio: SigninResponse.user.user_bio,
          lastseen_online: SigninResponse.user.lastseen_online,
          password: SigninResponse.user.password,
          user_gender: SigninResponse.user.user_gender,
          private_account: SigninResponse.user.private_account,
        },
        tokens: SigninResponse.tokens,
      });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async signUpWithGoogle(req: Request, res: Response): Promise<void> {
    try {
      const { token, publicKey } = req.body;
      console.log(token);
      console.log(publicKey);
      const googleSignUpResponse: GoogleSignUpResponse =
        await this.userService.googleSignup(token, publicKey);
      console.log("google sign up response", googleSignUpResponse);
      res.status(200).json({
        user: {
          id: googleSignUpResponse.user.id,
          user_name: googleSignUpResponse.user.user_name,
          name: googleSignUpResponse.user.name,
          profileImage: googleSignUpResponse.user.profileImage,
          email: googleSignUpResponse.user.email,
        },
        tokens: googleSignUpResponse.tokens,
      });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async signInWithGoogle(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      const googleSignInResponse: GoogleSignInResponse =
        await this.userService.googleSignin(token);
      console.log("google sign in response", googleSignInResponse);
      res.status(200).json({
        user: {
          id: googleSignInResponse.user.id,
          name: googleSignInResponse.user.name,
          profileImage: googleSignInResponse.user.profileImage,
          user_name: googleSignInResponse.user.user_name,
          email: googleSignInResponse.user.email,
          userBio: googleSignInResponse.user.user_bio,
          lastseen_online: googleSignInResponse.user.lastseen_online,
        },
        tokens: googleSignInResponse.tokens,
      });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.userService.refreshToken(refreshToken);
      res.status(200).json(tokens);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async generateForgotPasswordToken(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { email } = req.body;
      await this.userService.GenerateForgotPasswordToken(email);
      res.status(200).json({
        sucess: true,
        message: "Reset password link has been sent to your email.",
      });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;
      console.log('token password',token,password)
      await this.userService.UpdatePassword(token, password);
      res
        .status(200)
        .json({ sucess: true, message: "Password updated successfully" });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async ResentOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.userService.ResentOtp(email);
      res.status(200).json({ sucess: true, message: "Otp sent successfully" });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const username = req.params.username;
      const userId = (req as any).user.userId;
      const profile = await this.userService.GetUserProfile(userId, username);
      console.log("user profile", profile);
      res.status(200).json(profile);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const userId = (req as any).user.userId;
      userData.id = userId;
      const response = await this.userService.updateUserProfile(userData);
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async checkUsernameAvailability(req: Request, res: Response): Promise<void> {
    try {
      const username = req.params.username;
      const userId = (req as any).user.userId;
      const response = await this.userService.CheckUserNameAvailabilty(
        userId,
        username
      );
      if (response.exist)
        res.status(409).json({ message: "Username already exists." });
      else res.status(200).json({ message: "Username is available." });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async followUser(req: Request, res: Response): Promise<void> {
    try {
      const { followerId, followeeId } = req.body;
      if (!followerId || !followeeId) {
        throw new Error("failed to follow user");
      }
      await this.userGraphService.followUser(followerId, followeeId);
      res.sendStatus(200);
    } catch (err) {
      console.log("error", err);
    }
  }

  async unfollowUser(req: Request, res: Response): Promise<void> {
    const { followerId, followeeId } = req.body;
    await this.userGraphService.unFollowUser(followerId, followeeId);
    res.sendStatus(200);
  }

  async getFollowers(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    const followers = await this.userGraphService.getFollowers(username);
    const users = await this.userService.getFollowerFollowings(followers);

    res.json(users);
  }

  async getFollowing(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    const following = await this.userGraphService.getFollowing(username);
    const users = await this.userService.getFollowerFollowings(following);
    res.json(users);
  }

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      let paths = [];
      const userId = req.body.userId;
      const mediaType = req.body.mediaType;
      const comment = req.body.comment;

      const files = req.files as Express.Multer.File[];
      paths = files.map((file) => file.path);
      const result = await this.userService.postUpload(
        paths,
        "posts",
        userId,
        mediaType,
        comment
      );

      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async getUserfeed(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const skip = parseInt(req.params.skip, 10);
      const limit = parseInt(req.params.limit, 10);
      console.log("skip", skip);
      const feed = await this.userService.GetUserFeed(userId, skip, limit);
      res.status(200).json(feed);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async LikeUnLikePost(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { likeIds, unlikeIds } = req.body;
      console.log("likesIds,", likeIds);
      console.log("unlike ids,", unlikeIds);
      if (likeIds && likeIds.length > 0) {
        await this.userService.LikePosts(userId, likeIds);
      }

      if (unlikeIds && unlikeIds.length > 0) {
        await this.userService.UnlikePosts(userId, unlikeIds);
      }

      res.status(200).json({ message: "Like/Unlike successful" });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async PostComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      console.log("user id in controller", userId);
      const { postId, content } = req.body;
      const comment = await this.userService.PostComment(
        userId,
        postId,
        content
      );
      res.status(200).json(comment);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async GetComments(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.postId;
      console.log("post id in get comments in user controller", postId);
      const ObjectPostId = new mongoose.Types.ObjectId(postId);
      const comments = await this.userService.GetComments(ObjectPostId);
      res.status(200).json(comments);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async getUserByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const ObjectUserId = new mongoose.Types.ObjectId(userId);
      const response = await this.userService.getUserByUserId(ObjectUserId);
      res.status(200).json({
        ...response,
      });
    } catch (err) {
      console.log("error", err);
      res.status(400).json({ message: "failed to load the userDetails" });
    }
  }

  async rollUpload(req: Request, res: Response): Promise<void> {
    try {
      console.log("request from body", req.body);
      const { thumbnail, mediaUrl, content } = req.body;
      const userId = (req as any).user.userId;
      const response = await this.userService.rollUploadService(
        userId,
        thumbnail,
        mediaUrl,
        content
      );
      res.status(200).json(response);
    } catch (err) {
      console.log("error", err);
      res.status(400).json({ message: "failed to load the userDetails" });
    }
  }

  async getUserRoll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      console.log("user id", userId);
      console.log("user id length:", userId.length); // Should be 24
      console.log("user id:", JSON.stringify(userId));
      const userObjId = new mongoose.Types.ObjectId(userId);
      const response = await this.userService.getUserRollService(userObjId);
      res.status(200).json(response);
    } catch (err) {
      console.log("error", err);
      res.status(400).json({ message: "failed to load the userDetails" });
    }
  }

  async RollPostComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { rollId, content } = req.body;
      const rollComment = await this.userService.RollPostComment(
        userId,
        rollId,
        content
      );
      res.status(200).json(rollComment);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async RollGetComments(req: Request, res: Response): Promise<void> {
    try {
      const rollId = req.params.rollId;
      console.log("rollId ", rollId);
      const ObjectRollId = new mongoose.Types.ObjectId(rollId);
      const rollComments = await this.userService.RollGetComments(ObjectRollId);
      res.status(200).json(rollComments);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async RollLikeUnLikePost(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { likeIds, unlikeIds } = req.body;
      console.log("likesIds,", likeIds);
      console.log("unlike ids,", unlikeIds);
      if (likeIds && likeIds.length > 0) {
        await this.userService.RollLikePosts(userId, likeIds);
      }

      if (unlikeIds && unlikeIds.length > 0) {
        await this.userService.RollUnlikePosts(userId, unlikeIds);
      }

      res.status(200).json({ message: "Like/Unlike successful" });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async fetchLatesRoll(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const ObjectUserId = new mongoose.Types.ObjectId(userId);
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const rolls = await this.userService.FetchLatesRoll(
        ObjectUserId,
        page,
        pageSize
      );
      res.status(200).json({ success: true, data: rolls });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async deleteUserPost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.postId;
      console.log("post id", postId);
      const ObjectPostId = new mongoose.Types.ObjectId(postId);
      await this.userService.deleteUserPost(ObjectPostId);
      res.status(200).json("post deleted");
    } catch (err) {
      res.status(400).json({ message: "failed to delete post" });
    }
  }

  async updateUserPost(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { postId, content } = req.body;
      const ObjectUserId = new mongoose.Types.ObjectId(userId);
      const ObjectPostId = new mongoose.Types.ObjectId(postId);
      const response = await this.userService.updateUserPost(
        ObjectUserId,
        ObjectPostId,
        content
      );
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "failed to update post" });
    }
  }

  async reportPost(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const { postId, reason } = req.body;
      const ObjectUserId = new mongoose.Types.ObjectId(userId);
      const ObjectPostId = new mongoose.Types.ObjectId(postId);
      const validReasons: ReasonType[] = [
        "dislike",
        "bullying",
        "self_harm",
        "violence",
        "nudity",
        "fraud",
        "false_info",
      ];

      if (!validReasons.includes(reason as ReasonType)) {
        res.status(400).json({ message: "Invalid report reason" });
      }
      const validReason = reason as ReasonType;
      this.userService.postReportingService(
        ObjectPostId,
        ObjectUserId,
        validReason
      );
      res.status(200).json({ message: "Post reported successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "failed to update post" });
    }
  }

  async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.params;
      const response = await this.userService.SearchUsers(query);
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "failed to update post" });
    }
  }

  async getLikedUsers(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const response = await this.userService.GetLikedUsers(
        new mongoose.Types.ObjectId(postId)
      );
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "failed to update post" });
    }
  }

  async ExploreFetch(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const page = parseInt(req.params.page, 10);
      const pageSize = parseInt(req.params.pageSize, 10);
      console.log("userid", userId);
      console.log("page", page);
      console.log("page size", pageSize);

      const response = await this.userService.ExploreFetchservice(
        new mongoose.Types.ObjectId(userId),
        page,
        pageSize
      );
      console.log("response from there",response)
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "failed to update post" });
    }
  }

  async GetSinglePost(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const postId = req.params.postId;
      const response = await this.userService.GetSinglePost(
        new mongoose.Types.ObjectId(postId),
        new mongoose.Types.ObjectId(userId)
      );
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "failed to update post" });
    }
  }

  async saveUserItems(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const item = req.body;
      console.log("req ", req.body);
      const typedItem: SavedItemArrayElement = {
        itemId: item.itemId,
        type: item.type,
        collectionName: item.collectionName,
      };

      const response = await this.userService.SaveItems(userId, typedItem);
      console.log("response", response);
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err });
    }
  }

  async deleteUserItems(req: Request, res: Response): Promise<void> {
    try {
      type ItemType = "post" | "roll";
      const userId = (req as any).user.userId; // Extract the userId from the request (authentication)
      const { itemId, type } = req.query; // Destructure the itemId and type (post or roll) from the request body

      // Validate input
      if (!itemId || !type) {
        res.status(400).json({ message: "ItemId and type are required" });
        return;
      }

      const itemType: ItemType = type as ItemType;
      // Check if type is either 'post' or 'roll'
      if (typeof type !== "string" || (type !== "post" && type !== "roll")) {
        res
          .status(400)
          .json({ message: "Invalid type, must be 'post' or 'roll'" });
      }

      // Call the use case to delete the item
      const result = await this.userService.DeleteSavedItem(
        userId,
        itemId.toString(),
        itemType
      );

      if (result) {
        res.status(200).json({ message: "Item deleted successfully" });
      } else {
        res.status(404).json({ message: "Item not found or already deleted" });
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the item" });
    }
  }

  async findSavedItems(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const response = await this.userService.FindSavedItems(
        new mongoose.Types.ObjectId(userId)
      );
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the item" });
    }
  }

  async SaveNotification(req: Request, res: Response): Promise<void> {
    try {
      const initiatorId = (req as any).user.userId;
      const { userId, mediaUrl, entityId, message, type, isRead } = req.body;

      if(initiatorId === userId){
       res.status(200).json(null)
       return
      }
      const firstMediaUrl = Array.isArray(mediaUrl) && mediaUrl.length > 0 ? mediaUrl[0] : mediaUrl;

      const notificationEntity = new Notification(
        new mongoose.Types.ObjectId(userId),
        new mongoose.Types.ObjectId(initiatorId),
        firstMediaUrl,
        new mongoose.Types.ObjectId(entityId),
        message,
        type,
        isRead || false
      );

      console.log("notification entity", notificationEntity);

      const response = await this.userService.SaveNotification(
        notificationEntity
      );
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the item" });
    }
  }

  async DeleteNotfication(req: Request, res: Response): Promise<void> {
    try {
      const initiatorId = (req as any).user.userId;
      const { userId, entityId,type } = req.body;
      const response = await this.userService.DeleteNotifcation(
        new Types.ObjectId(userId),
        new Types.ObjectId(entityId),
        new Types.ObjectId(initiatorId),
        type
      );

      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the item" });
    }
  }

  async getUserNotification(req:Request,res:Response):Promise<void>{
    try {
      const userId = (req as any).user.userId
      const response = await this.userService.GetUserNotification(userId)
      console.log('users notification',response)
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "An error occurred while deleting the item" });
    }
  }

  async updateNotification(req:Request,res:Response):Promise<void>{
  try {
    const userId = (req as any).user.userId
     const response = await this.userService.updateNotification(new Types.ObjectId(userId))
     res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the item" });
  }
}

async deleteRoll(req:Request,res:Response):Promise<void>{
  try{
     const rollId = req.params.rollId
     const response = await this.userService.DeleteRoll(new Types.ObjectId(rollId))
     res.status(200).json(response)
  }catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the item" });
  }
}
  //    async getProfile(req:Request,res:Response):Promise<void>{
  //       try{

  //        const userId = (req as any).user.userId
  //        const ObjectId = mongoose.Types.ObjectId;
  //        const objectIdUserId = new ObjectId(userId);
  //        const profile =  await this.userService.getProfile(objectIdUserId)
  //        if(profile){
  //          res.status(200).json(profile)
  //        }else{
  //          res.status(404).json({error: 'Profile not found'})
  //        }
  //       }catch(err){
  //          res.status(400).json({error:(err as Error).message})
  //       }
  //    }

  //     async GetPosts(req:Request,res:Response):Promise<void>{
  //        try{
  //          const userId = (req as any).user.userId
  //          const ObjectUserId =  new mongoose.Types.ObjectId(userId)

  //         const posts = await this.userService.GetPosts(ObjectUserId)
  //         res.status(200).json(posts)

  //        }catch(err){
  //           res.status(400).json({error:(err as Error).message})
  //        }
  //     }

  //     async SentComment(req:Request,res:Response):Promise<void>{
  //       try{
  //          const userId = (req as any).user.userId
  //          const postId = req.body.postId
  //         const content = req.body.content
  //         const ObjectPostId = new mongoose.Types.ObjectId(postId);
  //         const ObjectUserId = new mongoose.Types.ObjectId(userId);
  //         const comment = await this.userService.SentComment(ObjectPostId,ObjectUserId,content)
  //         console.log('sented comment',comment)
  //         res.status(200).json(comment)
  //       }catch(err){
  //         res.status(400).json({error:(err as Error).message})
  //       }
  //     }

  //     async getPostsByUserName(req: Request, res: Response): Promise<void> {
  //       const { username } = req.params;
  //       console.log('user name in controller',username)
  //       const posts = await this.userService.GetPostsByUserName(username);
  //       res.json(posts);
  //     }

  //     async updateUserProfie(req: Request, res: Response): Promise<Response> {
  //       try{
  //         const userId = (req as any).user.userId
  //         const userData = req.body
  //         const profileImage = req.file as Express.Multer.File | undefined

  //         const result = await this.userService.updateProfile(userId, userData, profileImage);

  //         if (!result.success) {
  //           console.log(
  //             'request was reaching in result.success'
  //             , result.error
  //           )
  //           return  res.status(400).json({ message: result.error });
  //       }

  //        return res.status(200).json({message:'profile updated sucessfully', user:result.data})
  //       }catch (error) {
  //          console.log(
  //           'request was reaching inside the catch block',
  //           error
  //          )
  //         return      res.status(400).json({ message: 'Failed to update profile' });
  //     }
  // }
}
