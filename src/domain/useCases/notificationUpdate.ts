import { Types } from "mongoose";
import { NotificationRepository } from "../repositories/notificationRepository";


export class NotificationUpdate{
    constructor( private notificationRepository:NotificationRepository){}

    async execute(userId:Types.ObjectId):Promise<boolean>{
        return await this.notificationRepository.markAllAsRead(userId)
    }
}