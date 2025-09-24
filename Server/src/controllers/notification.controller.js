// routes/notificationRoutes.js
import express from "express";
import Notification from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// ✅ Get current notification

const getCurrentNotification = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findOne().sort({ createdAt: -1 });
    if (!notification) return res.json({ message: null });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

// ✅ Add / Replace notification
const addOrReplaceNotification = asyncHandler(async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    // remove old notifications
    await Notification.deleteMany({});
    const newNotification = await Notification.create({ message });

    res.json(newNotification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export  {
  getCurrentNotification,
  addOrReplaceNotification
};
