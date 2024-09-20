import { Schema } from "mongoose"


export type MediaType = 'post'|'roll'

export class Post{
    constructor(
        public id:Schema.Types.ObjectId,
        public userId:Schema.Types.ObjectId,
        public mediaUrls:string[],
        public mediaType:MediaType,
        public content:string,
        public createdAt:Date,
        public updatedAt:Date
    ){}
}