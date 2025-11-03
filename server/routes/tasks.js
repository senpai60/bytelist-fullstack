import express from "express";
const router = express.Router();

import verifyUser from "../middleware/verifyUser.js";

import Challenge from "../models/Challenge.js";
import Task from "../models/Task.js";
import RepoPost from "../models/RepoPost.js"

router.get("/all", verifyUser, async (req, res) => {
  const userId = req.user;
  if (!userId)
    return res.status(401).json({ message: "Please login to view tasks!" });

  try {
    const tasks = await Task.find({ user: userId })
      .populate("challenge")
      .populate("completionPost")
      .sort({ createdAt: -1 })
      .lean();
    
    res.status(200).json({ tasks });
  } catch (err) {
    console.error(err);
    res
      .status(502)
      .json({ message: "please check your internet and try again later :(" });
  }
});


router.post("/create/:challengeId", verifyUser, async (req, res) => {
  const { challengeId } = req.params;
  const userId = req.userId;
  if (!userId)
    return res.status(401).json({ message: "Please login to add to task!" });
  try {
    const isTaskExist = await Task.findOne({ challenge: challengeId });
    if (isTaskExist)
      return res.status(401).json({ message: "The task already exists!" });
    const challenge = await Challenge.findById(challengeId);
    const newTask = await Task.create({
      challenge: challengeId,
      user: userId,
      title: challenge.title,
      description: challenge.description,
      duration: challenge.duration,
      image: challenge.image,
      sources: challenge.sources,
      experienceLevel: challenge.experienceLevel,
      attemptsAllowed: challenge.attempts, // Map challenge.attempts to this
    });
  } catch (err) {
    console.error(err);
    res
      .status(502)
      .json({ message: "please check your internet and try again later :(" });
  }
});

export default router;
