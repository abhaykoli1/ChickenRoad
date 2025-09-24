import express from "express";
import {
  getCurrentRound,
  placeBet,
  getGameHistory,
  getUserBets,
  getPeriodsColor,
} from "../controllers/colorGame.controller.js";

const router = express.Router();

// Get current round info
router.get("/current", async (req, res) => {
  try {
    const currentRound = await getCurrentRound();
    res.json({ success: true, data: currentRound });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Place a bet
router.post("/bet", async (req, res) => {
  try {
    const bet = await placeBet(req.body);
    res.json({ success: true, data: bet });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get game history
router.get("/history", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const history = await getGameHistory(limit);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user betting history
router.get("/user/:userId/bets", async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const bets = await getUserBets(userId, limit);
    res.json({ success: true, data: bets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/next-periods", async (req, res) => {
  try {
    const data = await getPeriodsColor(); // ✅ yaha await lagana zaroori hai
    console.log(data, "=========");

    res.json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

export default router;
