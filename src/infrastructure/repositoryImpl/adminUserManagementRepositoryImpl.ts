import { AdminUserManagementRepository } from "../../domain/repositories/adminUserManagementRepository";
import { User } from "../../domain/entities/user";
import { UserModel } from "../database/mongo/models/userModel";
import mongoose, { Document } from "mongoose";
import { UserMapper } from "../mappers/userMapper";


export class AdminUserManagementRepositoryImpl implements AdminUserManagementRepository{
     async getAllUsers(): Promise<User[]> {
        const userDocs = await UserModel.find().exec();
  console.log('user docs',userDocs)
        return userDocs.map((doc: any) => {
            return new User(
                doc._id,
                doc.name,
                 doc.profileImage,
                 doc.user_name,
                 doc.email,
                 doc.user_bio,
                 doc.lastseen_online,
                 doc.password,
                 doc.user_gender, 
                 doc.private_account,
                 doc.is_suspended,
                 doc?.publicKey,
                 doc?.createdAt
            );
        });

     }

     async getUserById(user_id: mongoose.Types.ObjectId): Promise<User | null> {
        const userDoc = await UserModel.findById(user_id).exec();
         return userDoc? UserMapper.toUser(userDoc):null

        
     }

     async updateUser(user: User): Promise<void> {
         await UserModel.findByIdAndUpdate(user.id,UserMapper.fromUser(user)).exec()
     }
     
     async suspendUser(user_id: mongoose.Types.ObjectId): Promise<void> {
         await UserModel.findByIdAndUpdate(user_id,{is_suspended:true}).exec()
     }

    async unSuspendUser(user_id:mongoose.Types.ObjectId): Promise<void> {
        await UserModel.findByIdAndUpdate(user_id,{is_suspended:false}).exec()
    }

}