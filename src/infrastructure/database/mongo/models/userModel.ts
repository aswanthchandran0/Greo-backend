import mongoose,{Document,Schema} from "mongoose";

interface Iuser extends Document{
    user_name:string,
    full_name:string,
    email:string,
    phone_number:number,
    password:string
}


const userSchema:Schema =  new Schema({
    user_name:{type:String,required:true,unique:true},
    full_name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    phone_number:{type:Number,required:true,unique:true},
    password:{type:String,required:true}
})
 


export const UserModel = mongoose.model<Iuser>('user',userSchema)