import mongoose, { Document, Schema, Types } from "mongoose";
import { UserGender, LastSeenOnline } from "../../../../domain/entities/user";

export interface Iuser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  profileImage: string;
  user_name: string;
  email: string;
  user_bio: string;
  lastseen_online: LastSeenOnline;
  password: string;
  user_gender: UserGender;
  private_account: boolean;
  is_suspended: boolean;
  is_verified: boolean;
  publicKey?: string;
  createdAt?:Date
}

const userSchema: Schema = new Schema({
  name: { type: String },
  profileImage: { type: String },
  user_name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  user_bio: { type: String },
  lastseen_online: {
    type: String,
    enum: ["Everyone", "private", "hide"],
    default: "Everyone",
  },
  password: { type: String, required: true },
  user_gender: {
    type: String,
    enum: ["prefer not to say", "male", "female"],
    default: "prefer not to say",
  },
  private_account: { type: Boolean, default: false },
  is_suspended: { type: Boolean, default: false },
  is_verified: { type: Boolean, default: false },
  publicKey: { type: String },
  createdAt:{type:Date, default:Date.now}
});

export const UserModel = mongoose.model<Iuser>("user", userSchema);
