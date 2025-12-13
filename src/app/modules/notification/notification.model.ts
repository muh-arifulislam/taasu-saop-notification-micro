import { Schema, model } from "mongoose";
import { INotification } from "./notification.interface";

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    userId: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: ["order", "chat", "system"], required: true },
    eventId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema
);
