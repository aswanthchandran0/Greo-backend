
import { Types } from "mongoose";
import { NotificationRepository } from "../repositories/notificationRepository";


 export class DeleteNotification{
    constructor(private notificationRepository:NotificationRepository){}

    async execute(userId: Types.ObjectId, entityId: Types.ObjectId, initiatorId: Types.ObjectId,type:string){
         return await this.notificationRepository.delete(userId,entityId,initiatorId,type)
    }
 }