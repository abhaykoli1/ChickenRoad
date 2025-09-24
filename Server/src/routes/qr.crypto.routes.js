import { Router } from "express";
import {
  addQRCodeCrypto,
  getAllQRCodesCrypto,
  updateQRCodeCrypto,
  deleteQRCodeCrypto,
  upload,
} from "../controllers/qrCodeCrypto.controller.js";

const router = Router();

router.post("/qr", upload.single("qrCodeCrypto"), addQRCodeCrypto); // ✅ handle file
router.get("/qr-codes", getAllQRCodesCrypto);
router.put("/update-qr/:id", updateQRCodeCrypto);
router.delete("/delete-qr/:id", deleteQRCodeCrypto);

export default router;
