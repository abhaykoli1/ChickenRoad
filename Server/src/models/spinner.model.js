import mongoose from "mongoose";

const prizeSchema = new mongoose.Schema(
  {
    prizes: {
      type: [String], // array of strings
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Prize", prizeSchema);
