import { Request,Response } from "express";
import { AdminService } from "../../application/services/adminService";
import { User } from "../../domain/entities/user";
import mongoose, { mongo, Types } from "mongoose";
import { Schema } from "mongoose";
export class AdminController{
    constructor(private adminservice:AdminService){}
    async signin(req:Request,res:Response):Promise<void>{
        try{
              const {email,password} = req.body
              const response = await this.adminservice.signin(email,password)
               console.log('response',response)
              res.status(200).json({
                admin:{
                    id:response.admin._id,
                    admin_name:response.admin.admin_name,
                    email:response.admin.email
                },
                token:response.tokens
              })
        }catch(err){
            console.log(err)
            const errorMessage = (err as Error).message || 'An error occured'
            res.status(400).json({error:errorMessage})
        }
    }

    async getAllUser(req:Request,res:Response):Promise<void>{
     try{
    const users = await this.adminservice.getAllUser()
    res.status(200).json(users)
     }catch(err){
        res.status(500).json({message:(err as Error)}.message)
     }
    }
   
     async getUserById(req:Request,res:Response):Promise<void>{
        try{
         const userId = req.params.user_id
         const userObjectId = new Schema.Types.ObjectId(userId)
          
         const user = await this.adminservice.getUserById(userObjectId)
         if(user){
            res.status(200).json(user)
         }else{
            res.status(404).json({error:'User not found'})
         }
        }catch(error){
            res.status(400).json({error:(error as Error).message})
        }
     }
    async updateUser(req:Request,res:Response):Promise<void>{
        try{
            const userData:User = req.body
           await this.adminservice.updateUser(userData)

           res.status(200).json({message:'User Updated Sucessfully'})
        }catch(err){
            res.status(500).json({Message:(err as Error).message})
        }
    }


    async suspendUser(req:Request,res:Response):Promise<void>{
        try{ 
            const userId = req.body.userId
            console.log('user id',userId)
            const userObjectId = new mongoose.Types.ObjectId(userId)
            await this.adminservice.suspendUser(userObjectId)
            res.status(200).json({message:'User suspended sucessfully'})
        }catch(err){
            console.log(err)
            res.status(500).json({message:(err as Error).message})
        }
    }

    async unSuspendUser(req:Request,res:Response):Promise<void>{
        try{    
            const userId = req.body.userId
            const userObjectId = new mongoose.Types.ObjectId(userId)
            await this.adminservice.unSuspendUser(userObjectId)
            res.status(200).json({message:'User unsuspended sucessfully'})
        }catch(err){
            console.log(err)
            res.status(400).json({message:(err as Error).message})
        }
        }
}