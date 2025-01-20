"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepositoryImp = void 0;
const notificationModel_1 = require("../database/mongo/models/notificationModel");
class NotificationRepositoryImp {
    save(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newNotificationModel = new notificationModel_1.NotificationModel(notificationData);
            const savedNotification = yield newNotificationModel.save();
            const populatedNotification = yield notificationModel_1.NotificationModel.findById(savedNotification.id)
                .populate({
                path: "initiatorId",
                select: "user_name profileImage",
                model: "user"
            });
            console.log("populatedNotification ", populatedNotification);
            if (!populatedNotification) {
                throw new Error("Notification not found after saving.");
            }
            return {
                _id: populatedNotification._id,
                userId: populatedNotification.userId._id,
                username: populatedNotification.initiatorId.user_name,
                profileImage: populatedNotification.initiatorId.profileImage,
                initiatorId: populatedNotification.initiatorId._id,
                mediaUrl: populatedNotification.mediaUrl,
                entityId: populatedNotification.entityId,
                message: populatedNotification.message,
                type: populatedNotification.type,
                isRead: populatedNotification.isRead,
                createdAt: populatedNotification.createdAt,
            };
        });
    }
    delete(userId, entityId, initiatorId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield notificationModel_1.NotificationModel.deleteMany({
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
        });
    }
    findAllByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield notificationModel_1.NotificationModel.find({ userId })
                .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
                .populate({
                path: "initiatorId",
                select: "user_name profileImage",
                model: "user"
            });
            return notifications.map(notification => ({
                _id: notification._id,
                userId: notification.userId._id,
                username: notification.initiatorId.user_name,
                profileImage: notification.initiatorId.profileImage,
                initiatorId: notification.initiatorId._id,
                mediaUrl: notification.mediaUrl,
                entityId: notification.entityId,
                message: notification.message,
                type: notification.type,
                isRead: notification.isRead,
                createdAt: notification.createdAt,
            }));
        });
    }
    markAllAsRead(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield notificationModel_1.NotificationModel.updateMany({ userId, isRead: false }, // Find all unread notifications for the user
            { $set: { isRead: true } } // Update `isRead` to `true`
            );
            if (result.matchedCount === 0) {
                console.warn(`No unread notifications found for userId: ${userId}`);
                return false;
            }
            console.log(`Marked ${result.modifiedCount} notification(s) as read for userId: ${userId}`);
            return true;
        });
    }
}
exports.NotificationRepositoryImp = NotificationRepositoryImp;
