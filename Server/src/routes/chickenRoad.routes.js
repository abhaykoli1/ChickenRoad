import { Router } from "express";
import { goToNextStep, startGame, stopGame } from "../controllers/chickenRoad.controller.js";
import { handlePreviousUnfinishedSession } from "../middlewares/handlePreviousUnfinishedSession.middleware.js";

const router = Router()

router.route("/start").post(handlePreviousUnfinishedSession, startGame)
router.route("/go").post(goToNextStep)
router.route("/stop").post(stopGame)
// router.route("/state").get()

export default router