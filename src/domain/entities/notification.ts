import mongoose from "mongoose";

export class Notification{
    constructor(
        public userId:mongoose.Types.ObjectId,
        public initiatorId:mongoose.Types.ObjectId,
        private mediaUrl:string,
        public entityId:mongoose.Types.ObjectId,
        public message:string,
        public type:string,
        public isRead:boolean,    
    ){}
}