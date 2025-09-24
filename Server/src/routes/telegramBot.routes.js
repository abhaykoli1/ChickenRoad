import { Router } from "express";
import {
  deleteGameRound,
  getAllGameRounds,
  setgameround,
  updateGameRound,
} from "../controllers/gameRound.controller.js";

const router = Router();

router.route("/round").post(setgameround);
router.route("/game-rounds").get(getAllGameRounds);
router.delete("/delete-round/:id", deleteGameRound);
router.put("/update-round/:id", updateGameRound);

export default router;
