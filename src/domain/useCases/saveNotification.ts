import { Notification } from "../entities/notification";
import { NotificationRepository } from "../repositories/notificationRepository";


export class SaveNotifcation{
    constructor( private NotificationRepository:NotificationRepository ){}

    async execute (notificationData: Notification){
        return await this.NotificationRepository.save(notificationData)
    }
}