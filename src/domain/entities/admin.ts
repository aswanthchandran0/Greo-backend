import { Schema } from "mongoose";

export class Admin{
    constructor(
        public _id:Schema.Types.ObjectId,
        public admin_name:string,
        public email:string,
        private password:string
    ){}   
}
