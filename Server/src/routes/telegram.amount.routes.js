import { Router } from "express";
import {
  createAmount,
  getAllAmounts,
  getAmountById,
  updateAmount,
  deleteAmount,
} from "../controllers/telegram.amount.controller.js"; // <-- added .js

const router = Router();

router.post("/", createAmount);
router.get("/", getAllAmounts);
router.get("/:id", getAmountById);
router.put("/:id", updateAmount);
router.delete("/:id", deleteAmount);

export default router;
