import express from "express";
const router = express.Router();

import verifyUser from "../middleware/verifyUser.js";

import Challenge from "../models/Challenge.js";
import Task from "../models/Task.js";
import RepoPost from "../models/RepoPost.js";

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
  const userId = req.user;

  if (!userId)
    return res.status(401).json({ message: "Please login to add a task!" });

  try {
    // Find if the task already exists for this user & challenge
    const existingTask = await Task.findOne({ challenge: challengeId, user: userId });

    if (existingTask) {
      // If task was removed temporarily but still has attempts left → restore
      if (
        existingTask.isRemovedFromTask &&
        existingTask.attemptsUsed < existingTask.attemptsAllowed
      ) {
        existingTask.isRemovedFromTask = false;
        await existingTask.save();
        return res
          .status(200)
          .json({ message: "Task restored successfully!" });
      }

      // If task is permanently disabled (max attempts used)
      if (existingTask.isPermanentlyDisabled) {
        return res.status(403).json({
          message: "You have exhausted all attempts for this challenge.",
        });
      }

      // If active task already exists
      return res
        .status(409)
        .json({ message: "Task already exists for this challenge." });
    }

    // If no existing task → create a new one
    const challenge = await Challenge.findById(challengeId);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found!" });

    const newTask = await Task.create({
      challenge: challengeId,
      user: userId,
      title: challenge.title,
      description: challenge.description,
      duration: challenge.duration,
      image: challenge.image,
      sources: challenge.sources,
      experienceLevel: challenge.experienceLevel,
      attemptsAllowed: challenge.attempts, // From challenge
    });

    return res.status(201).json({
      message: "Task created successfully!",
      task: newTask,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(502)
      .json({ message: "Please check your internet and try again later :(" });
  }
});


router.put("/delete/:taskId", verifyUser, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user;
    if (!userId)
      return res.status(401).json({ message: "please login to delete task" });

    if (!taskId)
      return res.status(402).json({ message: "the task id isn't valid" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.attemptsUsed += 1;

    if (task.attemptsUsed >= task.attemptsAllowed) {
      task.isPermanentlyDisabled = true;
      await task.save();
      return res.status(200).json({
        message: "Task disabled permanently (max attempts reached)",
      });
    }

    task.isRemovedFromTask = true;
    await task.save();
    return res
      .status(200)
      .json({ message: "Task temporarily removed (attempt recorded)" });
  } catch (err) {
    console.error(err);
    return res
      .status(502)
      .json({ message: "Please check your internet and try again later :(" });
  }
});

export default router;
