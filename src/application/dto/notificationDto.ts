import mongoose from "mongoose";

export interface NotificationDto {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  profileImage: string;
  initiatorId: mongoose.Types.ObjectId;
  mediaUrl?: string;
  entityId: mongoose.Types.ObjectId;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
}

