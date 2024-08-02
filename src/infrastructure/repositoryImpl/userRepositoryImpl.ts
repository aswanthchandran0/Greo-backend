import { userRepository } from "../../domain/repositories/userRepository";
import { User } from "../../domain/entities/user";
import { UserModel } from "../database/mongo/models/userModel";


export class  UserRepositoryImpl implements userRepository{
     async save(user:User):Promise<void>{
        const  userModel= new UserModel(user)
        await  userModel.save()
     }
    async findByEmail(email: string): Promise<User | null> {
        const userModel = await UserModel.findOne({email}).exec()
        return  userModel? new User(userModel.id,userModel.user_name,userModel.full_name,userModel.email,userModel.phone_number,userModel.password):null
     }
     async findByPhoneNumber(phone_number: Number): Promise<User | null> {
        const userModel = await UserModel.findOne({phone_number}).exec()
        return userModel? new User(userModel.id,userModel.user_name,userModel.full_name,userModel.email,userModel.phone_number,userModel.password):null
     }
}