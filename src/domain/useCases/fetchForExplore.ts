import mongoose from "mongoose";
import { ExploreRepository } from "../repositories/exploreRepository";

export class FetchForExpolore{
    constructor(private exploreRepository:ExploreRepository){}

    async execute( viewingUserId: mongoose.Types.ObjectId, page: number, pageSize: number){
        return await this.exploreRepository.fetchPostsAndRolls(viewingUserId,page,pageSize)
    }
}