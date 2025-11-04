import cron from "node-cron";
import Task from "../models/Task.js";
import logger from "../config/logger.js";

cron.schedule("*/1 * * * *", async () => {
  logger.info("[Cron] Checking expired tasks...");

  const now = new Date();

  try {
    const expiredTasks = await Task.find({
      durationEndsAt: { $lt: now },
      isCompleted: false,
      isPermanentlyDisabled: false,
    });

    if (!expiredTasks.length) {
      logger.info("[Cron] No expired tasks found.");
      return;
    }

    for (const task of expiredTasks) {
      task.attemptsUsed += 1;

      if (task.attemptsUsed >= task.attemptsAllowed) {
        task.isPermanentlyDisabled = true;
        logger.warn(
          `[Cron] Task ${task._id} disabled (attempts: ${task.attemptsUsed}/${task.attemptsAllowed})`
        );
      }

      await task.save();
    }

    logger.info(`[Cron] Updated ${expiredTasks.length} expired tasks.`);
  } catch (error) {
    logger.error(`[Cron Error]: ${error.message}`);
  }
});
