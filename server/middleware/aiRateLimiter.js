// middlewares/aiRateLimiter.js
import rateLimit from "express-rate-limit";

export const aiLimiter = rateLimit({
  windowMs: 20 * 1000, // 20 seconds
  max: 3, // limit each IP to 3 requests per windowMs
  message: { error: "Too many AI requests. Try again in a few seconds." },
  standardHeaders: true,
  legacyHeaders: false,
});
