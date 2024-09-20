import mongoose from "mongoose"

export interface Chat{
 id:mongoose.Types.ObjectId
 members:Array<mongoose.Types.ObjectId>
 timeStamb:Date
}