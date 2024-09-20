    import mongoose,{Document,Schema,Types} from "mongoose";
import { UserGender,LastSeenOnline } from "../../../../domain/entities/user";

export interface Iuser extends Document{
    _id:Schema.Types.ObjectId,
    profileImage:string,
    name:string
    user_name:string,
    email:string,
    user_bio:string,
    lastseen_online:LastSeenOnline,
    password:string,
    is_suspended: boolean;
    publicKey:string
    is_verified:boolean
}


const userSchema:Schema =  new Schema({
    name:{type:String},
    profileImage:{type:String},
    user_name:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    user_bio:{type:String},
    lastseen_online:{type:String},
    password:{type:String,required:true},
    is_suspended: { type: Boolean, default: false },
    publicKey:{type:String,required:true},
    is_verified:{type:Boolean,default:false}
})
 
            
        
export const UserModel = mongoose.model<Iuser>('user',userSchema)