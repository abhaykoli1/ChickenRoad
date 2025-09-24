import { Router } from "express";
import {
  addQRCode,
  getAllQRCodes,
  updateQRCode,
  deleteQRCode,
  upload,
} from "../controllers/qrCode.controller.js";

const router = Router();

router.post("/qr", upload.single("qrCode"), addQRCode); // ✅ handle file
router.get("/qr-codes", getAllQRCodes);
router.put("/update-qr/:id", updateQRCode);
router.delete("/delete-qr/:id", deleteQRCode);

export default router;
