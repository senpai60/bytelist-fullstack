import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();

// === Random Achievements Pool ===
const ACHIEVEMENT_POOL = [
  {
    title: "New User",
    description: "Welcome to ByteList!",
    icon: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
  },
  {
    title: "Top Poster",
    description: "Posted 10+ repos!",
    icon: "https://cdn-icons-png.flaticon.com/512/1484/1484825.png",
  },
  {
    title: "50 Likes",
    description: "Received 50 likes on posts!",
    icon: "https://cdn-icons-png.flaticon.com/512/2107/2107957.png",
  },
  {
    title: "Code Explorer",
    description: "Visited 20+ repos!",
    icon: "https://cdn-icons-png.flaticon.com/512/2721/2721223.png",
  },
  {
    title: "Loved Creator",
    description: "Your post hit 100 likes!",
    icon: "https://cdn-icons-png.flaticon.com/512/1077/1077035.png",
  },
  {
    title: "Early Adopter",
    description: "Joined in the first 100 users!",
    icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  },
  {
    title: "Bug Hunter",
    description: "Reported an issue successfully!",
    icon: "https://cdn-icons-png.flaticon.com/512/190/190406.png",
  },
  {
    title: "UI Artist",
    description: "Posted a visually beautiful project!",
    icon: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png",
  },
  {
    title: "Popular Dev",
    description: "Followers increased rapidly!",
    icon: "https://cdn-icons-png.flaticon.com/512/1674/1674291.png",
  },
  {
    title: "Community Helper",
    description: "Helped other devs in community!",
    icon: "https://cdn-icons-png.flaticon.com/512/1484/1484822.png",
  },
];

// === Route: Inject random achievement ===
// Example: GET /admin/inject-random/6905f91dd2f4b2879f7bb901
router.get("/inject-random/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid userId." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // pick a random achievement
    const randomAchievement =
      ACHIEVEMENT_POOL[Math.floor(Math.random() * ACHIEVEMENT_POOL.length)];

    // check if already exists
    const alreadyHas = user.achievements?.some(
      (a) => a.title === randomAchievement.title
    );
    if (alreadyHas) {
      return res.status(200).json({
        success: false,
        message: `User already has "${randomAchievement.title}"`,
        achievements: user.achievements,
      });
    }

    user.achievements.push({
      ...randomAchievement,
      unlockedAt: new Date(),
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: `Injected random achievement: ${randomAchievement.title}`,
      achievements: user.achievements,
    });
  } catch (err) {
    console.error("Error injecting random achievement:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

export default router;
