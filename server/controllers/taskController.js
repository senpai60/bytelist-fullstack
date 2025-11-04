import Task from "../models/Task.js";
import logger from "../config/logger.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("challenge user");
    res.status(200).json(tasks);
    logger.info("Fetched all tasks successfully");
  } catch (error) {
    logger.error(`getTasks Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      logger.warn(`Task not found: ${req.params.id}`);
      return res.status(404).json({ message: "Task not found" });
    }

    task.isCompleted = true;
    await task.save();
    logger.info(`Task ${task._id} marked as completed`);

    res.status(200).json({ message: "Task marked as completed", task });
  } catch (error) {
    logger.error(`completeTask Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      logger.warn(`Delete failed: Task not found (${req.params.id})`);
      return res.status(404).json({ message: "Task not found" });
    }

    task.isRemovedFromTask = true;
    await task.save();
    logger.info(`Task ${task._id} marked as removed`);

    res.status(200).json({ message: "Task removed", task });
  } catch (error) {
    logger.error(`deleteTask Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
