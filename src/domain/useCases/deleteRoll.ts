import { Types } from "mongoose";
import { RollRepository } from "../repositories/rollRepository";

export class DeleteRoll{
    constructor(private rollRepository:RollRepository){}

    async execute(rollId:Types.ObjectId){
        return await this.rollRepository.delete(rollId)
    }
}