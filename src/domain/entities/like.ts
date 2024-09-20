import { Schema } from "mongoose";
export class Like{
    constructor(
        public id:Schema.Types.ObjectId,
        public userId:Schema.Types.ObjectId,
        public postIds:string[],
        public createdAt:Date,
    ){}
}