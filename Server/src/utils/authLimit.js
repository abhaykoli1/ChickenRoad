import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10, // limit each IP to 10 requests
  message: "Too many attempts, please try again later."
});
