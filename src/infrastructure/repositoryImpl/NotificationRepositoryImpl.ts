import { Types } from "mongoose";
import { NotificationDto } from "../../application/dto/notificationDto";
import { Notification } from "../../domain/entities/notification";
import { NotificationRepository } from "../../domain/repositories/notificationRepository";
import { NotificationModel } from "../database/mongo/models/notificationModel";

export class NotificationRepositoryImp implements NotificationRepository {

  async save(notificationData: Notification): Promise<NotificationDto> {

       const newNotificationModel = new NotificationModel(notificationData)
       const savedNotification =  await newNotificationModel.save()
      const populatedNotification = await NotificationModel.findById(savedNotification.id)
      .populate({
        path:"initiatorId",
        select:"user_name profileImage",
        model:"user"
      })

      console.log("populatedNotification ",populatedNotification)
      if (!populatedNotification) {
        throw new Error("Notification not found after saving.");
      }


      return {
        _id: populatedNotification._id,
        userId: populatedNotification.userId._id,
        username: (populatedNotification.initiatorId as any).user_name, 
        profileImage: (populatedNotification.initiatorId as any).profileImage,
        initiatorId: populatedNotification.initiatorId._id,
        mediaUrl: populatedNotification.mediaUrl,
        entityId: populatedNotification.entityId,
        message: populatedNotification.message,
        type: populatedNotification.type,
        isRead: populatedNotification.isRead,
        createdAt: populatedNotification.createdAt,
      } as NotificationDto;
      
  } 
   async delete(userId: Types.ObjectId, entityId: Types.ObjectId, initiatorId: Types.ObjectId,type:string): Promise<boolean> {
    const result = await NotificationModel.deleteMany({
        userId,
        entityId,
        initiatorId,
        type
    });

    if (result.deletedCount === 0) {
        console.warn("No matching notifications found to delete.");
        return false;
    }

    console.log(`Deleted ${result.deletedCount} notification(s) for userId: ${userId}, entityId: ${entityId}, initiatorId: ${initiatorId}`);
    return true;
   }
   

   async findAllByUserId(userId:Types.ObjectId): Promise<NotificationDto[]> {
    const notifications = await NotificationModel.find({ userId })
        .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
        .populate({
            path: "initiatorId",
            select: "user_name profileImage",
            model: "user"
        });

    return notifications.map(notification => ({
        _id: notification._id,
        userId: notification.userId._id,
        username: (notification.initiatorId as any).user_name,
        profileImage: (notification.initiatorId as any).profileImage,
        initiatorId: notification.initiatorId._id,
        mediaUrl: notification.mediaUrl,
        entityId: notification.entityId,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
    }));
}

async markAllAsRead(userId:Types.ObjectId): Promise<boolean> {
  const result = await NotificationModel.updateMany(
      { userId, isRead: false }, // Find all unread notifications for the user
      { $set: { isRead: true } } // Update `isRead` to `true`
  );

  if (result.matchedCount === 0) {
      console.warn(`No unread notifications found for userId: ${userId}`);
      return false;
  }

  console.log(`Marked ${result.modifiedCount} notification(s) as read for userId: ${userId}`);
  return true;
}

}