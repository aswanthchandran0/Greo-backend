import { string } from "joi";
import mongoose, { Schema } from "mongoose";

export type ReasonType =
  | "dislike"
  | "bullying"
  | "self_harm"
  | "violence"
  | "nudity"
  | "fraud"
  | "false_info";

export interface IpostReport extends Document {
  postId: mongoose.Types.ObjectId;
  users:{
      id:mongoose.Types.ObjectId,
      reason:ReasonType
    }[]
  createdAt: Date;
}

const postReportSchema: Schema = new mongoose.Schema({
  postId: { type: Schema.Types.ObjectId, required: true },
  users: [
    {
      id: { type: Schema.Types.ObjectId, required: true }, // User ID of the reporter
      reason: {
        type: String,
        enum: [
          "dislike",
          "bullying",
          "self_harm",
          "violence",
          "nudity",
          "fraud",
          "false_info",
        ],
        required: true, // Predefined reasons
      },
    },
  ],

  createdAt: { type: Date, requierd: true, default: Date.now() },
});

export const postReportModel = mongoose.model<IpostReport>(
  "postReportModel",
  postReportSchema
);
