import { AdminUserManagementRepository } from "../repositories/adminUserManagementRepository";
import { User } from "../entities/user";
import { Schema } from "mongoose";

export class AdminUserManagement{
    constructor(private adminUserManagementRepository:AdminUserManagementRepository){}
    async getAllUsers():Promise<User[]>{
        return await this.adminUserManagementRepository.getAllUsers()
    }
    async getUserById(user_id:Schema.Types.ObjectId):Promise<User |null>{
        return await this.adminUserManagementRepository.getUserById(user_id)
    }
    
    async updateUser(user:User):Promise<void>{
    await  this.adminUserManagementRepository.updateUser(user)
    }

    async suspendUser(user_id:Schema.Types.ObjectId):Promise<void>{
        await this.adminUserManagementRepository.suspendUser(user_id)
    }
}