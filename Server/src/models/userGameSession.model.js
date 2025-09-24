import mongoose from "mongoose";

const userGameSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  gameType: {
    type: String,
    enum: ["chicken", "aviator", "color", "mining"],
    required: true
  },
  betAmount: {
    type: Number,
    required: true
  },
  multipliers: {
    type: [Number], // E.g., [1.2, 1.45, 1.65, 0.0]
    required: true
  },
  currentStepIndex: {
    type: Number,
    default: 0 // Starts from first multiplier
  },
  roundId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GameRound",
    default: null
  },
  isStopped: {
    type: Boolean,
    default: false
  },
  isCrashed: {
    type: Boolean,
    default: false
  },
  payoutAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export const UserGameSession = mongoose.model("UserGameSession", userGameSessionSchema);