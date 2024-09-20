import { SignupUser } from "../../domain/useCases/signupUser";
import { User, UserProfile } from "../../domain/entities/user";
import { SigninUser } from "../../domain/useCases/signinUser";
import { GetUserProfile } from "../../domain/useCases/getUserProfile";
import { SendOtp } from "../../domain/useCases/sentOtp";
import { VerifyOtp } from "../../domain/useCases/verifiOtp";
import { SignUpWithGoogle } from "../../domain/useCases/signUpWithGoogle";
import { SignInWithGoogle } from "../../domain/useCases/signInWithGoogle";
import { CloudinaryService } from "./cloudnaryService"
import { UploadPost } from "../../domain/useCases/uploadPost";
import { GetPosts } from "../../domain/useCases/getPosts";
import { LikePost } from "../../domain/useCases/likePost";
import { UnlikePost } from "../../domain/useCases/unlikePost";
import { GetComments } from "../../domain/useCases/getComments";
import { SentComment } from "../../domain/useCases/sentComment";
import { PostRepository } from "../../domain/repositories/postRepository";
import { ClientSession, Schema } from "mongoose";
import { UpdateUserProfile } from "../../domain/useCases/updateUserProfile";
import { getPostsWithUserByUserName } from "../../domain/useCases/getPostsWithUserByUsername";
import { GetUserByUserId } from "../../domain/useCases/getUserByUserId";
import { SignUpResponse, SignInResponse, GoogleSignUpResponse, GoogleSignInResponse, userWithPosts } from "../dto/userDto";
import tokenService from "./tokenService";
import mongoose from "mongoose";
import { userRepository } from "../../domain/repositories/userRepository";
import { UserGraphService } from "./userGraphService";
import { Post } from "../../domain/entities/post";
export class UserService{
    constructor(
        private signupUser:SignupUser,
        private signinUser:SigninUser,
        private getUserProfile:GetUserProfile,
        private sentOtp:SendOtp,
        private verifyUserOtp:VerifyOtp,
        private signupWithGoogle:SignUpWithGoogle,
        private signinWithGoogle:SignInWithGoogle,
        private cloudinaryService:CloudinaryService,
        private uploadPost:UploadPost,
        private getPosts:GetPosts,
        private likePostUseCase: LikePost,
        private unlikePostUseCase: UnlikePost,
        private getComments:GetComments,
        private sentComment:SentComment,
        private userReposiory:userRepository,
        private userGraphService:UserGraphService,
        private postRepository:PostRepository,
        private updateUserProfile: UpdateUserProfile,
        private getPostsWithUserByUserName:getPostsWithUserByUserName,
        private getUserByUserid:GetUserByUserId
    ){}

    async signup(userData:{user_name:string;email:string;password:string,publicKey:string}):Promise<SignUpResponse>{
      const session:ClientSession = await mongoose.startSession();
       session.startTransaction()
       try{

        const signUpResponse = await this.signupUser.execute(userData,session);
        if (signUpResponse && signUpResponse.user.id) {
            await this.userGraphService.createUser(signUpResponse.user.id.toString(), userData.user_name);
      }
   await session.commitTransaction()
      return signUpResponse;

       }catch(error){
        await session.abortTransaction()
        console.error('failed signup process, rolling back:',error);
        throw error
       }finally{
        session.endSession()
       }
    }
    async verifyOtp(userId:Schema.Types.ObjectId,otpCode:string):Promise<boolean>{
        return await this.verifyUserOtp.execute(userId,otpCode)
    }
    
   async signin(email:string,password:string):Promise<SignInResponse>{
        return  await this.signinUser.execute(email,password)
   }
   async getProfile(user_id:Schema.Types.ObjectId):Promise<UserProfile |null>{
       return this.getUserProfile.execute(user_id)
   }

   async googleSignup(token:string,publicKey:string):Promise<GoogleSignUpResponse>{
    const session:ClientSession = await mongoose.startSession();
    session.startTransaction()
    try{
    const googleSignUpResponse = await this.signupWithGoogle.execute(token,session,publicKey)

   if(googleSignUpResponse && googleSignUpResponse.user.id){
            await this.userGraphService.createUser(googleSignUpResponse.user.id.toString(),googleSignUpResponse.user.user_name)
        }

        await session.commitTransaction()
      return googleSignUpResponse
    }catch(error){
      await session.abortTransaction()
      console.error('failed google signup process, rolling back:',error);
      throw error;
    }finally{
      session.endSession()
    }
   }
    async googleSignin(token:string):Promise<GoogleSignInResponse>{
        return await this.signinWithGoogle.execute(token)
    }

    
    async refreshToken(refreshToken:string){
        return tokenService.refreshTokens(refreshToken)
    }

    async postUpload(filesPaths: string [],folderName:string,userId:Schema.Types.ObjectId,mediaType:string,comment:string){
   const mediaUrls = await  this.cloudinaryService.uploadToCloundinary(filesPaths,folderName)
   const secureUrl =mediaUrls.map((file: { secure_url: any; })=>file.secure_url)
     return this.uploadPost.execute(secureUrl,filesPaths,userId,mediaType,comment)
  }
   async GetPosts(ObjectUserId:mongoose.Types.ObjectId){
    return this.getPosts.execute(ObjectUserId)
   }

   async GetPostsByUserName(userName: string): Promise<Post[] | null> {
    return this.postRepository.getPostsByUserName(userName);
  }

   async LikePosts(userId: Schema.Types.ObjectId, postIds: Schema.Types.ObjectId[]): Promise<void> {
    return this.likePostUseCase.execute(userId, postIds);
  }

  async UnlikePosts(userId: Schema.Types.ObjectId, postIds: Schema.Types.ObjectId[]): Promise<void> {
    return this.unlikePostUseCase.execute(userId, postIds);
  }

  async GetComments(postId:mongoose.Types.ObjectId){
    return this.getComments.execute(postId)
  }

  async SentComment(postId:mongoose.Types.ObjectId,userId:mongoose.Types.ObjectId,content:string){
    return this.sentComment.execute(postId,userId,content)
  }

  async updateProfile(userId: Schema.Types.ObjectId, userData: Partial<User>,profileImage:File| undefined): Promise<void> {
    await this.updateUserProfile.execute(userId, userData);
}

async getPostWithUserByUserName(userName: string,userId:Schema.Types.ObjectId): Promise<userWithPosts | null> {
    const response = await  this.getPostsWithUserByUserName.execute(userName)
    if(response && response.user.id){ 
       const followersCount = await this.userGraphService.getFollowersCount(response.user.id.toString())
       const followingCount = await this.userGraphService.getFollowingCount(response.user.id.toString())
       const isFollowing = await this.userGraphService.isFollowing(userId.toString(),response.user.id.toString())
       const newUser = new User(
        response.user.id,
        response.user.profileImage || '',
        response.user.name || '',
        response.user.user_name,
        response.user.email,
        response.user.user_bio,
        response.user.lastseen_online,
        '', // Assuming password is empty
        response.user.is_suspended,
        response.user.publicKey,
        followersCount,
        followingCount,
        isFollowing
      
       )

       console.log('new user',newUser)
      return {
        ...response,
        user:newUser
      }
    }
    return null
}

async getUserByUserId(userId:mongoose.Types.ObjectId):Promise<User | null>{
    return await this.getUserByUserid.execute(userId)
}
}   