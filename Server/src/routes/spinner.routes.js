import { Router } from "express";
import {
  addPrizes,
  getAllPrizes,
  getPrizeById,
  updatePrizes,
  addPrizeItem,
  removePrizeItem,
  deletePrize,
} from "../controllers/spinner.controller.js";

const router = Router();

// ✅ Full prizes array
router.post("/prize", addPrizes); // Create a new prize document
router.get("/prizes", getAllPrizes); // Get all prize documents
router.get("/prize/:id", getPrizeById); // Get single prize document
router.put("/prize/:id", updatePrizes); // Replace entire prizes array
router.delete("/prize/:id", deletePrize); // Delete entire prize document

// ✅ Single prize item operations
router.post("/prize/:id/add", addPrizeItem); // Add single prize item to array
router.post("/prize/:id/remove", removePrizeItem); // Remove single prize item from array

export default router;
