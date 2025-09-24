import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal"],
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["UPI", "Crypto", "Telegram"],
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    adminVerified: {
      type: Boolean,
      default: false,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    remark: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const WalletTransaction = new mongoose.model(
  "WalletTransaction",
  walletTransactionSchema
);
