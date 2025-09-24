import mongoose from "mongoose";

const amountSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Amount = mongoose.model("Amount", amountSchema);

export default Amount;
