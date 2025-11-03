import { useEffect, useState } from "react";

export const CircularTimer = ({
  expireAt,
  size = 120,
  strokeWidth = 8
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [percentage, setPercentage] = useState(100);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const expiry = new Date(expireAt).getTime();
      const remaining = Math.max(0, expiry - now);

      // Assuming 24 hours as the total duration
      const totalDuration = 24 * 60 * 60 * 1000;
      const percent = (remaining / totalDuration) * 100;

      setTimeRemaining(remaining);
      setPercentage(Math.min(100, Math.max(0, percent)));
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [expireAt]);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Use HEX/Tailwind palette for colors
  const getTimerColor = () => {
    if (percentage > 50) return "#22c55e"; // tailwind green-500
    if (percentage > 25) return "#facc15"; // tailwind yellow-400
    return "#f59e42"; // tailwind orange-400
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb" // tailwind gray-200
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
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

      {/* Time display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-gray-800">
          {formatTime(timeRemaining)}
        </span>
        {timeRemaining === 0 && (
          <span className="text-xs text-gray-400 mt-1">Expired</span>
        )}
      </div>
    </div>
  );
};
