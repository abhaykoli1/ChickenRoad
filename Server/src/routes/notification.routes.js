import { Router } from "express";
const router = Router()

import { getCurrentNotification, addOrReplaceNotification } from "../controllers/notification.controller.js";

router.route("/get").get(getCurrentNotification)
router.route("/add").post(addOrReplaceNotification)

export default router