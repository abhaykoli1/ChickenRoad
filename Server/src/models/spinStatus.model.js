import mongoose from "mongoose";

const spinStatusSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One spin status per user
    },
    availableSpins: {
      type: Number,
      default: 1, // First-time user gets one free spin
    },
    totalEarnedSpins: {
      type: Number,
      default: 1,
    },
    totalUsedSpins: {
      type: Number,
      default: 0,
    },
    lastSpinAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const SpinStatus = mongoose.model("SpinStatus", spinStatusSchema);
