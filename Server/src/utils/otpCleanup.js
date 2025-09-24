import cron from "node-cron";
import { otpLogs } from "../models/otpLogs.model.js";

// export const startOtpCleanup = () => {
//   cron.schedule("*/30 * * * *", async () => {
//     // Runs every 30 minutes
//     const result = await otpLogs.deleteMany({
//       expiresAt: { $lt: new Date() },
//       verified: false
//     });
//     console.log(`🔁 OTP Cleanup: ${result.deletedCount} expired OTPs removed`);
//   });
// };
