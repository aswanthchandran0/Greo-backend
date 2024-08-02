import { Request,Response } from "express";
import { UserService } from "../../application/services/userService";
import { error } from "console";
import { UserProfile } from "../../domain/entities/user";

export class UserController{
   constructor(private userService:UserService){}
   async signup(req:Request,res:Response):Promise<void>{
    try{
        const userData = req.body
        const user = await this.userService.signup(userData)
        res.status(201).json({id:user.id,user_name:user.user_name,full_name:user.full_name,email:user.email,phone_number:user.phone_number})
    }catch(err){
       res.status(400).json({error:(err as Error).message})
    }
   }
   async signin (req:Request,res:Response):Promise<void>{
try{
   const {email,password} = req.body
   const user = await this.userService.signin(email,password)
   res.status(200).json({id:user.id,user_name:user.user_name,full_name:user.full_name,email:user.email,phone_number:user.phone_number})
}catch(err){
   res.status(400).json({error:(err as Error).message})
}
   }

   async updateProfile(req:Request,res:Response):Promise<void>{
      try{
          const  userProfileData = req.body
          const userProfile = new UserProfile(
            userProfileData.user_id,
            userProfileData.user_image,
            userProfileData.user_bio,
            userProfileData.user_gender,
            userProfileData.private_account,
            userProfileData.lastseen_online,
            userProfileData.post,
            userProfileData.roll,
            userProfileData.followers,
            userProfileData.following,
            userProfileData.community,
            userProfileData.stories
          )
          await this.userService.updateProfile(userProfile)
          res.status(200).json({message: 'Profile updated successfully'})
      }catch(err){
         res.status(400).json({error:(err as Error).message})
      }
   }

   async getProfile(req:Request,res:Response):Promise<void>{
      try{
       const userId = req.params.user_id
       const profile =  await this.userService.getProfile(userId)
       if(profile){
         res.status(200).json(profile)
       }else{
         res.status(404).json({error: 'Profile not found'})
       }
      }catch(err){
         res.status(400).json({error:(err as Error).message})
      }
   }
}