"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
class Notification {
    constructor(userId, initiatorId, mediaUrl, entityId, message, type, isRead) {
        this.userId = userId;
        this.initiatorId = initiatorId;
        this.mediaUrl = mediaUrl;
        this.entityId = entityId;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
    }
}
exports.Notification = Notification;
