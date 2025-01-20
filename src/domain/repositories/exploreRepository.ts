import mongoose from "mongoose";
import { RollDto } from "../../application/dto/rollDto";
import { IUserPost } from "../../application/dto/userDto";
import { PostDto } from "../../application/dto/postDto";


export interface ExploreRepository {
  fetchPostsAndRolls(
    viewingUserId: mongoose.Types.ObjectId, 
    page: number, 
    pageSize: number
  ): Promise<(PostDto | RollDto)[]>; 
}
