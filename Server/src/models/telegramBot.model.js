import mongoose from "mongoose";

const telegramBotSchema = new mongoose.Schema(
  {
    gameType: {
      type: String,
      enum: ["chicken", "aviator", "color", "mining"],
      required: true,
    },
    botToken: {
      type: String,
      required: true,
    },
    chatId: {
      type: String,
      required: true,
    },
    adminControlled: {
      type: Boolean,
      default: true,
    },
    scheduledMessages: {
      type: [
        {
          time: String, // e.g., "14:05"
          message: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const TelegramBot = mongoose.model("TelegramBot", telegramBotSchema);
