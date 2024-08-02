import mongoose, {Mongoose,Document, Schema} from "mongoose";
import { UserGender,LastSeenOnline } from "../../../domain/entities/user";

interface IUserProfile extends Document{
user_id:string,
 user_image:string,
 user_bio:string,
 user_gender:UserGender,
 private_account:boolean,
 lastseen_online:LastSeenOnline,
 post:string[],
 roll:string[],
 followers:string[],
 following:string[],
 community:string[],
 stories:string[]
}

const userProfileSchema:Schema = new Schema({
    user_id:{type:String,required:true,unique:true},
    user_image:{type:String},
    user_bio:{type:String},
    user_gender:{type:String},
    private_account:{type:Boolean,default:false},
    lastseen_online:{type:String},
    post:[{type:String}],
    roll:[{type:String}],
    followers:[{type:String}],
    following:[{type:String}],
    community:[{type:String}],
    stories:[{type:String}]
})

export const UserProfileModel = mongoose.model<IUserProfile>('UserProfile',userProfileSchema)