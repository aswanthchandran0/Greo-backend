import mongoose, {Mongoose,Document, Schema} from "mongoose";
import { UserGender,LastSeenOnline } from "../../../domain/entities/user";

interface IUserProfile extends Document{
user_id:Schema.Types.ObjectId,
 user_gender:UserGender,
 private_account:boolean,
 post:string[],
 roll:string[],
 followers:string[],
 following:string[],
 community:string[],
 stories:string[]
}

const userProfileSchema:Schema = new Schema({
    user_id:{type:Schema.Types.ObjectId,required:true,unique:true},
    user_gender:{type:String},
    private_account:{type:Boolean,default:false},
    post:[{type:String}],
    roll:[{type:String}],
    community:[{type:String}],
    stories:[{type:String}]
})

export const UserProfileModel = mongoose.model<IUserProfile>('UserProfile',userProfileSchema)