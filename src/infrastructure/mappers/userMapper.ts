import { User } from "../../domain/entities/user";
import { Document } from "mongoose";
import { Iuser, UserModel } from "../database/mongo/models/userModel";

export class UserMapper{
    static toUser(doc:Document<any,any,Iuser>&Iuser):User{
        return new User(
            doc._id.toString(),
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
            doc.is_verified
        )
    }

    static toUserList(doc:Array<Document<any, any, Iuser> &Iuser>):User[]{
        return doc.map(this.toUser)
    }
    static fromUser(user:User):Iuser{
        return new UserModel({
            _id: user.id,
            user_name: user.user_name,
            email: user.email,
            password: user.password,
            is_suspended:user.is_suspended
        })
    }
}