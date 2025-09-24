import mongoose from "mongoose";

const aviatorRoundSchema = new mongoose.Schema({
  roundId: {
    type: String,
    required: true,
    unique: true,
  },
  startTime: {
    type: Date,
    default: null,
  },
  endTime: {
    type: Date,
    default: null,
  },
  crashPoint: {
    type: Number,
    default: null, // e.g., 2.45x
  },
  status: {
    type: String,
    enum: ["waiting", "running", "crashed"],
    default: "waiting",
  },
  multiplierHistory: [
    {
      time: Number, // milliseconds since start
      multiplier: Number,
    }
  ],
  bets: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      amount: Number,
      cashOutMultiplier: Number,
      winAmount: Number,
    }
  ],
}, { timestamps: true });

export default mongoose.model("AviatorRound", aviatorRoundSchema);
