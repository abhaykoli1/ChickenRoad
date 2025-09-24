import mongoose from "mongoose";

const aviatorBetSchema = new mongoose.Schema(
  {
    roundId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AviatorRound",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1, // Minimum bet
    },
    cashOutMultiplier: {
      type: Number,
      default: null, // Null until user cashes out
    },
    winAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "cashed_out", "lost"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AviatorBet", aviatorBetSchema);
