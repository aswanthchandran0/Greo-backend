import { Request,Response } from "express";
import { UserService } from "../../application/services/userService";
import { UserProfile } from "../../domain/entities/user";
import { SignUpResponse, SignInResponse, GoogleSignUpResponse, GoogleSignInResponse } from "../../application/dto/userDto";
import { error } from "console";
import { PostRepositoryImpl } from "../../infrastructure/repositoryImpl/postRepositoryImpl";
import mongoose from "mongoose";
import { Schema } from "mongoose";
import { UserGraphService } from "../../application/services/userGraphService";
export class UserController{
   constructor(
     private userService:UserService,
     private userGraphService:UserGraphService
   ){}
   async signup(req:Request,res:Response):Promise<void>{
    try{
        const userData = req.body
        console.log('signup user data',userData)
        const signupResponse: SignUpResponse = await this.userService.signup(userData);
        res.status(201).json({
         user: {
             id: signupResponse.user.id,
             user_name: signupResponse.user.user_name,
             email: signupResponse.user.email
         },
         tokens: signupResponse.tokens
     });

    }catch(err){
       res.status(400).json({error:(err as Error).message})
    }
   }
   async veryOtp(req:Request,res:Response):Promise<void>{
      try{
           const {userId,otpCode} = req.body
           const isValid = await this.userService.verifyOtp(userId,otpCode)
           if(isValid){
            res.status(200).json({message:'otp verified sucessfully'})
           }else{
            res.status(400).json({error:'Invalid OTP'})
           }
      }catch(err){
         res.status(400).json({error:(err as Error).message})
      }
   }
   async signin (req:Request,res:Response):Promise<void>{
try{
   const {email,password} = req.body

   if(email === '' || password === ''){
     throw new Error('email or password cannot be empty')
   }
   const SigninResponse:SignInResponse = await this.userService.signin(email,password)
   res.status(200).json({
      user: {
          id: SigninResponse.user.id,
          user_name: SigninResponse.user.user_name,
          email: SigninResponse.user.email
      },
      tokens: SigninResponse.tokens
  });
}catch(err){
   res.status(400).json({error:(err as Error).message})
}
   }


   async getProfile(req:Request,res:Response):Promise<void>{
      try{

       const userId = req.params.user_id
       const ObjectId = Schema.Types.ObjectId;
       const objectIdUserId = new ObjectId(userId);
       const profile =  await this.userService.getProfile(objectIdUserId)
       if(profile){
         res.status(200).json(profile)
       }else{
         res.status(404).json({error: 'Profile not found'})
       }
      }catch(err){
         res.status(400).json({error:(err as Error).message})
      }
   }

   async signUpWithGoogle(req:Request,res:Response):Promise<void>{
      try{
            const {token,publicKey} = req.body
            console.log(publicKey)
         const googleSignUpResponse: GoogleSignUpResponse = await this.userService.googleSignup(token,publicKey);
          console.log('google sign up response',googleSignUpResponse)
            res.status(200).json({
               user: {
                   id: googleSignUpResponse.user.id,
                   user_name: googleSignUpResponse.user.user_name,
                   name:googleSignUpResponse.user.name,
                   profileImage:googleSignUpResponse.user.profileImage,
                   email: googleSignUpResponse.user.email,
                   publicKey:googleSignUpResponse.user.publicKey
               },
               tokens: googleSignUpResponse.tokens
           });
      }catch(err){
         res.status(400).json({error:(err as Error).message})
      }
   }

   async signInWithGoogle (req:Request,res:Response):Promise<void>{
      try{
        const {token} = req.body
        const googleSignInResponse: GoogleSignInResponse = await this.userService.googleSignin(token);
       console.log('google sign in response',googleSignInResponse)
        res.status(200).json({
         user: {
             id: googleSignInResponse.user.id,
             user_name: googleSignInResponse.user.user_name,
             name:googleSignInResponse.user.name,
             profileImage:googleSignInResponse.user.profileImage,
             email: googleSignInResponse.user.email,
             userBio:googleSignInResponse.user.user_bio,
             lastseen_online:googleSignInResponse.user.lastseen_online
         },
         tokens: googleSignInResponse.tokens
     })
      }catch(err){
         res.status(400).json({error:(err as Error).message})
      }
   }

   async refreshToken(req:Request,res:Response):Promise<void>{
      try{
        const {refreshToken} = req.body
        const tokens = await this.userService.refreshToken(refreshToken)
        res.status(200).json(tokens)
      }catch(err){
         res.status(400).json({error:(err as Error).message})
      }
   }

   async createPost(req:Request,res:Response):Promise<void>{
      try{
         let paths = []
         const userId = req.body.userId
         const mediaType = req.body.mediaType
         const comment = req.body.comment
       
         const files = req.files as Express.Multer.File[]
        paths = files.map(file => file.path)
      
        const result  = await this.userService.postUpload(paths,'posts',userId,mediaType,comment)

         res.status(201).json(result)
      }catch(err){
        res.status(400).json({error:(err as Error).message})
      }
    }
  
    async GetPosts(req:Request,res:Response):Promise<void>{
       try{
         const userId = (req as any).user.userId
         const ObjectUserId =  new mongoose.Types.ObjectId(userId) 

        const posts = await this.userService.GetPosts(ObjectUserId)
        res.status(200).json(posts)

       }catch(err){
          res.status(400).json({error:(err as Error).message})
       }
    }

    async LikeUnLikePost(req: Request, res: Response): Promise<void> {
      try {
        const userId = (req as any).user.userId;
        const { likeIds, unlikeIds } = req.body;
         console.log('likesIds,',likeIds)
         console.log('unlike ids,',unlikeIds)
        if (likeIds && likeIds.length > 0) {
          await this.userService.LikePosts(userId, likeIds);
        }
    
        if (unlikeIds && unlikeIds.length > 0) {
          await this.userService.UnlikePosts(userId, unlikeIds);
        }
    
        res.status(200).json({ message: 'Like/Unlike successful' });
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    }


    async GetComments(req:Request,res:Response):Promise<void>{
      try{
        const postId = req.params.postId
        console.log('post id in get comments in user controller',postId)
        const ObjectPostId = new mongoose.Types.ObjectId(postId);
        const comments = await this.userService.GetComments(ObjectPostId)
        res.status(200).json(comments)
      }catch(err){
        res.status(400).json({error:(err as Error).message})
      }
    }

    async SentComment(req:Request,res:Response):Promise<void>{
      try{
         const userId = (req as any).user.userId 
         const postId = req.body.postId
        const content = req.body.content
        const ObjectPostId = new mongoose.Types.ObjectId(postId);
        const ObjectUserId = new mongoose.Types.ObjectId(userId);
        const comment = await this.userService.SentComment(ObjectPostId,ObjectUserId,content)
        console.log('sented comment',comment)
        res.status(200).json(comment)
      }catch(err){
        res.status(400).json({error:(err as Error).message})
      }
    }

    async followUser(req:Request,res:Response):Promise<void>{
      try{

        const {followerId,followeeId} = req.body
        if(!followerId || !followeeId){
          throw new Error('failed to follow user')
        }
        console.log('followeId',followerId)
        console.log('followee id',followeeId)
        await this.userGraphService.followUser(followerId,followeeId)
        res.sendStatus(200)
    
      }catch(err){
        console.log('error',err)
      }
     
    }  

    async unfollowUser(req:Request,res:Response):Promise<void>{
      const {followerId,followeeId} = req.body
      await this.userGraphService.unFollowUser(followerId,followeeId)
      res.sendStatus(200)
    }

    async getFollowers(req: Request, res: Response): Promise<void> {
      const userId = (req as any).user.userId
      const followers = await this.userGraphService.getFollowers(userId);
      res.json(followers);
    }
  
    async getFollowing(req: Request, res: Response): Promise<void> {
      const userId = (req as any).user.userId
      const following = await this.userGraphService.getFollowing(userId);
      res.json(following);
    }
 
    async getPostsByUserName(req: Request, res: Response): Promise<void> {
      const { username } = req.params;
      console.log('user name in controller',username)
      const posts = await this.userService.GetPostsByUserName(username);
      res.json(posts);
    }

    async updateUserProfie(req: Request, res: Response): Promise<void> {
      try{
        const userId = (req as any).user.userId
        const userData = req.body.userData
        const profileImage = req.file as File | undefined
        console.log('profile image',profileImage)
        this.userService.updateProfile(userId,userData,profileImage)
        res.json('profile updated sucessfully')
      }catch(err){
          res.status(400).json({message:'failed to update profile'})
      }
   
    }

    async getUserProfileWithUser(req: Request, res: Response): Promise<void> {
    try{
        const userId = (req as any).user.userId
        const userName = req.params.username
        const userProfile = await this.userService.getPostWithUserByUserName(userName,userId)
        console.log('user profile',userProfile)
        res.status(200).json(userProfile)
    }catch(err){
      console.log(err)
      res.status(400).json({message:'failed to get profile'})
    }
    }

    async getUserByUserId(req:Request,res:Response):Promise<void>{
      try{
        const userId = req.params.userId
        const ObjectUserId = new mongoose.Types.ObjectId(userId);
        const response =  await this.userService.getUserByUserId(ObjectUserId)
        console.log('response in user id',response)
        res.status(200).json({
          ...response})
      }catch(err){
        console.log('error',err)
        res.status(400).json({message:'failed to load the userDetails'})
      }
    }
  }  
