import mongoose from "mongoose";

const gameRoundSchema = new mongoose.Schema(
  {
    gameType: {
      type: String,
      enum: ["chicken", "aviator", "color", "mining"],
      required: true,
    },
    multipliers: {
      type: [Number], // e.g., [1.2, 1.45, 0.0]
      required: true,
    },
    period: {
      type: String,
      required: false,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "expired"],
      default: "scheduled",
    },
    createdByBot: {
      type: Boolean,
      default: false, // ⬅️ updated default for clarity
    },
    createdByAdmin: {
      type: Boolean,
      default: true, // ⬅️ differentiate sources if needed
    },
    messageSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const GameRound = mongoose.model("GameRound", gameRoundSchema);
