import { useEffect, useState } from "react";

export const CircularTimer = ({
  task,
  expireAt, // Challenge-level expiry (auto-delete)
  durationEndsAt, // Task-level short duration end
  size = 100,
  strokeWidth = 8,
  type = "duration", // "duration" or "expiry"
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [percentage, setPercentage] = useState(100);

  useEffect(() => {
    if (!task?.duration) return;

    // pick timer end point
    const end = new Date(
      type === "expiry" ? expireAt : durationEndsAt
    ).getTime();
    if (isNaN(end)) return;

    const total =
      type === "expiry"
        ? end - new Date(task.createdAt).getTime() // total lifespan
        : task.duration * 60 * 1000; // duration in ms

    const start = end - total;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, end - now);
      const elapsed = Math.min(total, now - start);
      const percent = Math.max(0, 100 - (elapsed / total) * 100);

      setTimeRemaining(remaining);
      setPercentage(percent);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expireAt, durationEndsAt, task?.duration, type]);

  const formatTime = (ms) => {
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);
    return h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getTimerColor = () => {
    if (type === "expiry") {
      if (percentage > 50) return "#3b82f6"; // blue
      if (percentage > 25) return "#6366f1"; // indigo
      return "#a855f7"; // purple
    } else {
      if (percentage > 50) return "#22c55e"; // green
      if (percentage > 25) return "#facc15"; // yellow
      return "#ef4444"; // red
    }
  };

  // DEBUGS
  useEffect(() => {
    console.log("DurationEndsAt:", durationEndsAt);
    console.log("ExpireAt:", expireAt);
    console.log("Task Created At:", task.createdAt);
  }, [durationEndsAt, expireAt, task?.createdAt]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#27272a"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getTimerColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-semibold text-zinc-200">
          {timeRemaining > 0 ? formatTime(timeRemaining) : "Expired"}
        </span>
        <span className="text-[10px] text-zinc-400 mt-1">
          {type === "expiry" ? "Expiry" : "Duration"}
        </span>
      </div>
    </div>
  );
};
