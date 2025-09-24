import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  requestResetOtp,
  resetPassword,
  getVisibleGames,
  getCurrentUser,
  getCurrentBalance,
  getAllUsers,
  updateAccountDetails,
  createReferralLink,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/request-reset-otp").post(requestResetOtp);
router.route("/reset-password").post(resetPassword);
router.route("/balance/:userId").get(getCurrentBalance);
router.route("/visible-games").get(getVisibleGames);
router.route("/").get(getAllUsers);
router.route("/:editUserId").put(updateAccountDetails);
router.route("/referral-link/:userId").get(createReferralLink);

//secured routes
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/change-password").post(changeCurrentPassword);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
