import mongoose from "mongoose";

const qrCodeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true }, // store image URL or base64
  },
  { timestamps: true }
);

export default mongoose.model("QRCode", qrCodeSchema);
