// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
