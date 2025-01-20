import mongoose from "mongoose";
import { RollRepository } from "../repositories/rollRepository";
import { RollDto } from "../../application/dto/rollDto";


export class fetchLatestRolls{
    constructor( private  rollRepository:RollRepository){}

   async execute(viewingUserId: mongoose.Types.ObjectId, page: number,pageSize: number): Promise<RollDto[]>{
       return await this.rollRepository.fetchLatestRolls(viewingUserId,page,pageSize)
    }
}