import { SigninAdmin } from "../../domain/useCases/adminSignin";
import { Admin } from "../../domain/entities/admin";
import { AdminUserManagement } from "../../domain/useCases/adminUserManagement";
import { User } from "../../domain/entities/user";
import { adminResponse } from "../dto/adminDto";
import mongoose, { Schema } from "mongoose";
export class AdminService{
    constructor(
        private signinAdmin:SigninAdmin,
        private adminUserManagement:AdminUserManagement

    ){}
    async signin(email:string, password:string):Promise<adminResponse>{
        const response = await this.signinAdmin.execute(email, password);
        if (!response) {
            throw new Error('Authentication failed');
        }
        return {
           admin:response.admin,
           tokens:response.tokens
        };

        
    }

    // admin User mangement
    async getAllUser():Promise<User[]>{
        return await  this.adminUserManagement.getAllUsers()
    }
    async getUserById(user_id:Schema.Types.ObjectId):Promise<User|null>{
        return  await this.adminUserManagement.getUserById(user_id)
    }


    async updateUser(user:User):Promise<void>{
        await this.adminUserManagement.updateUser(user)
    }

    async suspendUser(user_id:mongoose.Types.ObjectId):Promise<void>{
        await this.adminUserManagement.suspendUser(user_id)
    }
   
    async unSuspendUser(user_id:mongoose.Types.ObjectId):Promise<void>{
        await this.adminUserManagement.unsuSpendUser(user_id)
    }   
}