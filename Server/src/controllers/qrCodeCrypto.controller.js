import QRCodeCrypto from "../models/qr.crypto.model.js";

import multer from "multer";
import path from "path";

// Multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

// Add QR Code
export const addQRCodeCrypto = async (req, res) => {
  try {
    const { title } = req.body;
    const imageUrl = "/uploads/" + req.file.filename; // store relative path

    const qr = new QRCodeCrypto({ title, imageUrl });
    await qr.save();

    res.status(201).json({
      success: true,
      message: "QR Code added successfully",
      data: qr,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding QR Code",
      error: error.message,
    });
  }
};

// Get all
export const getAllQRCodesCrypto = async (req, res) => {
  try {
    const qrs = await QRCodeCrypto.find();
    res.status(200).json({ success: true, data: qrs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching QR Codes",
      error: error.message,
    });
  }
};

// Update QR Code
export const updateQRCodeCrypto = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQR = await QRCodeCrypto.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedQR)
      return res.status(404).json({ message: "QR Code not found" });
    res
      .status(200)
      .json({ message: "QR Code updated successfully", updatedQR });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating QR Code", error: error.message });
  }
};

// Delete QR Code
export const deleteQRCodeCrypto = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQR = await QRCodeCrypto.findByIdAndDelete(id);
    if (!deletedQR)
      return res.status(404).json({ message: "QR Code not found" });
    res.status(200).json({ message: "QR Code deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting QR Code", error: error.message });
  }
};
