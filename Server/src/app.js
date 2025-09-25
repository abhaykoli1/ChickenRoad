import { seedDefaultAdmin } from "./utils/seedAdmin.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
const app = express();

// const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_API_KEY,
//   key_secret: process.env.RAZORPAY_API_SECRET,
// });

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// If uploads is outside src, one level up
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
seedDefaultAdmin();

// //Routes import
import userRouter from "./routes/user.routes.js";
import otpRouter from "./routes/otp.routes.js";
import walletRouter from "./routes/wallet.routes.js";
import adminRouter from "./routes/admin.routes.js";
import chickenGameRouter from "./routes/chickenRoad.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import telegramRoute from "./routes/telegramBot.routes.js";
import qrRoute from "./routes/qr.code.routes.js";
import qrRouteCrypto from "./routes/qr.crypto.routes.js";
import SpinnerPriceRoute from "./routes/spinner.routes.js";
import referAmount from "./routes/refer.amount.routes.js";

import notificationRouter from "./routes/notification.routes.js";
import telegramAmount from "./routes/telegram.amount.routes.js";

app.use("/api/v1/notification", notificationRouter);
// //Routes Declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/wallet", walletRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/chicken-road", chickenGameRouter);
app.use("/api/v1/upi", paymentRouter);
app.use("/api/v1/telegram", telegramRoute);
app.use("/api/v1/qrcode", qrRoute);
app.use("/api/v1/qrcodecrypto", qrRouteCrypto);
app.use("/api/v1/spinner", SpinnerPriceRoute);
app.use("/api/v1/refer-amount", referAmount);
app.use("/api/v1/telegram-amount", telegramAmount);

export { app };
