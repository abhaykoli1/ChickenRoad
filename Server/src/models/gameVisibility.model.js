import mongoose from "mongoose";

const gameVisibilitySchema = new mongoose.Schema({
  gameType: {
    type: String,
    enum: ["chicken", "aviator", "color", "mining"],
    required: true,
    unique: true
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const GameVisibility = mongoose.model("GameVisibility", gameVisibilitySchema);