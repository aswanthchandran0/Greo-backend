import mongoose,{Document,Schema} from "mongoose";


interface IComment extends Document{
    id:Schema.Types.ObjectId,
    userId:Schema.Types.ObjectId,
    postId:Schema.Types.ObjectId,
    content:string,
    createdAt:Date,
    updatedAt:Date
}


const commentSchema:Schema = new Schema({
    userId:{type:Schema.Types.ObjectId,required:true},
    postId:{type:Schema.Types.ObjectId,required:true},
    content:{type:String,required:true},
    createdAt:{type:Date},
    updatedAt:{type:Date}
})

export const CommentModel = mongoose.model<IComment>('comment',commentSchema)