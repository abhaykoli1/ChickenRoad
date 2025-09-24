import { Router } from "express";
import { resendOTP, verifyUserOtp } from "../controllers/otp.controller.js";

const router = Router()

router.route("/verify").post(verifyUserOtp)
router.route("/resend-otp").post(resendOTP)

export default router