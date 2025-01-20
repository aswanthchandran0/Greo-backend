import mongoose from "mongoose";
import { RollRepository } from "../repositories/rollRepository";
import { RollDto } from "../../application/dto/rollDto";

export class GetUserRoll{
    constructor(private rollRepository:RollRepository){}

   async execute(userId:mongoose.Types.ObjectId):Promise<RollDto[] | null>{
      return await this.rollRepository.getUserRoll(userId)
    }
}