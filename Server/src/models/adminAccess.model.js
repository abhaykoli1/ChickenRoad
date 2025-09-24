// models/AdminAccess.js

import mongoose from "mongoose";

const adminAccessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  accessPages: {
    type: [String],
    default: []
  },
  role: {
    type: String,
    enum: ["admin", "limited-admin"],
    default: "limited-admin"
  }
}, { timestamps: true });

export const AdminAccess = mongoose.model("AdminAccess", adminAccessSchema);