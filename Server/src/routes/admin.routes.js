import { Router } from "express";
import { addAdmin, createGameRound, deleteAdmin, deleteGameRound, getAdminAccessPages, getAllAdmins, getAllGameRounds, getGameHistoryByUserAndType, updateAdmin, updateGameRound, updateGameVisibility } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/game-round").post(createGameRound)
router.route("/game-round/:id").patch(getAllGameRounds)
router.route("/game-round/:id").delete(updateGameRound)
router.route("/game-rounds").get(deleteGameRound)
router.route("/game-visibility").post(updateGameVisibility)
router.route("/get-admin").get(getAllAdmins)
router.get('/game-history/:userId/:gameType', getGameHistoryByUserAndType);
router.route("/add-admin").post(addAdmin)
router.route("/update-admin").put(updateAdmin)
router.route("/delete-admin").delete(deleteAdmin)
router.route("/access-pages").get(verifyJWT, getAdminAccessPages)

export default router