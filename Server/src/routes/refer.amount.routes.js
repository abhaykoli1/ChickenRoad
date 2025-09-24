import express from "express";
import {
  addReferAmount,
  getReferAmounts,
  deleteReferAmount,
} from "../controllers/refer.amount.controller.js";

const router = express.Router();

// Add new refer amount
router.post("/", addReferAmount);

// Get all refer amounts
router.get("/", getReferAmounts);

// Delete refer amount by ID
router.delete("/:id", deleteReferAmount);

export default router;
