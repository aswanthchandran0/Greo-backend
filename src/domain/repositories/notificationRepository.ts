import mongoose, { mongo } from "mongoose";
import { Notification } from "../entities/notification";
import { NotificationDto } from "../../application/dto/notificationDto";

export interface NotificationRepository{
    save(notificationData:Notification):Promise<NotificationDto>
    delete(userId: mongoose.Types.ObjectId,entityId: mongoose.Types.ObjectId,initiatorId: mongoose.Types.ObjectId,type:string): Promise<boolean>
    findAllByUserId(userId: mongoose.Types.ObjectId): Promise<NotificationDto[]>;
    markAllAsRead(userId: mongoose.Types.ObjectId): Promise<boolean>; // New method
}