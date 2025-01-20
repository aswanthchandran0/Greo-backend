import { graphUser, TopFollowerUser } from "../../application/dto/userDto"
import { User } from "../entities/user"

export interface IUserGraphRepository{
    createUserNode(userId:string,userName:string):Promise<void>
    followUser(followerId:string,followeeId:string):Promise<void>
    unfollowUser(followerId:string,followeeId:string):Promise<void>
    getFollowers(username:string):Promise<graphUser[]>
    getFollowing(username:string):Promise<graphUser[]>
    getFollowersCount(userId:string):Promise<number>
    getFollowingCount(userId:string):Promise<number>
    isFollowing(followerId:string,followeeId:string):Promise<boolean>
    updateUserName(userId:string,userName:string):Promise<void>
    getFollowingIds(userId:string):Promise<string[]>
    getTop10UsersByFollowers(): Promise<TopFollowerUser[]>;
}