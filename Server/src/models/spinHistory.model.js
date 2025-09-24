import mongoose from "mongoose";

const spinHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  spinType: {
    type: String,
    enum: ["initial", "earned", "bonus", "daily", "promo"],
    default: "earned"
  },
  outcome: {
    type: String,
    required: true // e.g., "₹0", "₹20", "Try Again"
  },
  rewardAmount: {
    type: Number,
    default: 0
  },
  addedToWallet: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const SpinHistory = mongoose.model("SpinHistory", spinHistorySchema);
