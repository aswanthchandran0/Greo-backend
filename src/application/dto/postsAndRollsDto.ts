import { IPost } from "../../infrastructure/database/mongo/models/postModel";
import { IrollModel } from "../../infrastructure/database/mongo/models/rollModel";

export interface FetchPostsAndRollsDto {
    posts: IPost[] | null;
    rolls: IrollModel[] | null;
  }
