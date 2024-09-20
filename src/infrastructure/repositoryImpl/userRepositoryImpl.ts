import { userRepository } from "../../domain/repositories/userRepository";
import { User } from "../../domain/entities/user";
import { UserModel } from "../database/mongo/models/userModel";
import { session } from "neo4j-driver";
import mongoose, { ClientSession } from "mongoose";


export class  UserRepositoryImpl implements userRepository{
  async save(user:User,session?:ClientSession):Promise<User>{
    console.log('user in user repo',user)
        const  userModel= new UserModel(user)
        console.log('userModel in repo ',userModel)
       const savedUserModel =  await  userModel.save({session})
       
       return new User(
         savedUserModel._id,
         savedUserModel.profileImage,
         savedUserModel.name,
         savedUserModel.user_name,
         savedUserModel.email,
         savedUserModel.user_bio,
         savedUserModel.lastseen_online,
         savedUserModel.password,
         savedUserModel.is_suspended,
         savedUserModel.publicKey
         // savedUserModel.is_verified
       )
     
     }
    async findByEmail(email: string,session?:ClientSession): Promise<User | null> {
        const userModel = await UserModel.findOne({email}).session(session ?? null).exec()
        return  userModel? new User(
          userModel.id,
          userModel.profileImage,
          userModel.name,
          userModel.user_name,
          userModel.email,
          userModel.user_bio,
          userModel.lastseen_online,
          userModel.password,
          userModel.is_suspended,/*userModel.is_verified*/):null
     }

     async findByUserName(userName: string,session?:ClientSession): Promise<User | null> {
        const user = await UserModel.findOne({user_name:userName}).session(session ?? null).exec()
        return user ? new User(
            user.id,
            user.profileImage,
            user.name,
            user.user_name,
            user.email,
            user.user_bio,
            user.lastseen_online,
            user.password,
            user.is_suspended,
        ):null
     }

     async findByUserId(userId:mongoose.Types.ObjectId): Promise<User | null> {
        const user = await UserModel.findById(userId).exec()
        return user ? new User(
            user.id,
            user.profileImage,
            user.name,
            user.user_name,
            user.email,
            user.user_bio,
            user.lastseen_online,
            user.password,
            user.is_suspended,
            user.publicKey
        ):null
     }

}