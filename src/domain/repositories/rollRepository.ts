import mongoose from "mongoose";
import { Roll } from "../entities/roll";
import { RollDto } from "../../application/dto/rollDto";
import { IrollModel } from "../../infrastructure/database/mongo/models/rollModel";


export interface RollRepository{
    save(userId:string,thumbnail:string,mediaUrl:string,content:string):Promise<RollDto>
    getUserRoll(userId:mongoose.Types.ObjectId):Promise<RollDto[] | null>
    fetchLatestRolls(
        viewingUserId: mongoose.Types.ObjectId, 
        page: number, 
        pageSize: number
    ): Promise<RollDto[]>;
    getAllRoll():Promise<IrollModel[] |null>
    delete(rollId:mongoose.Types.ObjectId):Promise<boolean>
   
}