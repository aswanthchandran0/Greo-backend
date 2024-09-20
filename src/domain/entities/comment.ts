import { Schema } from "mongoose";
export class Comment{
    toObject(): globalThis.Comment {
        throw new Error("Method not implemented.");
    }
    constructor(
        public id:Schema.Types.ObjectId,
        public userId:Schema.Types.ObjectId,
        public postId:Schema.Types.ObjectId,
        public content:string,
        public createdAt:Date,
        public updatedAt:Date
    ){}
}