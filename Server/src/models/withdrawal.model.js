import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    method: {
      type: String,
      enum: ["UPI", "Crypto"],
      required: true,
    },
    withdrawTo: {
      type: String,
      required: true, // UPI ID or Crypto Address
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    adminRemark: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Withdrawal = new mongoose.model("Withdrawal", withdrawalSchema);
