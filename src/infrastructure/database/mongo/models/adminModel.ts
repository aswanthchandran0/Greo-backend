import mongoose,{Document,Schema } from "mongoose";


interface IAdmin extends Document{
    admin_name:string,
    email:string,
    password:string
}


const adminSchema:Schema = new Schema({
    admin_name:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})


export const AdminModel = mongoose.model<IAdmin>('Admin',adminSchema)