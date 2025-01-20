import { Types } from "mongoose";
import { NotificationRepository } from "../repositories/notificationRepository";

export class GetUserNotification {
    constructor(private notificationRepository:NotificationRepository){}

    async execute(userId:Types.ObjectId){
        return await this.notificationRepository.findAllByUserId(userId)
    }
}