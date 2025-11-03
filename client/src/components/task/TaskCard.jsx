import { CircularTimer } from "./CircularTimer";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle2, XCircle, Target } from "lucide-react";
import { useState } from "react";

// Simple badge (since shadcn Badge is optional for play-cdn)
const Badge = ({
  children,
  color = "bg-gray-800 text-gray-100",
  className = "",
}) => (
  <span
    className={`inline-flex items-center rounded px-2 py-1 text-xs font-semibold border ${color} ${className}`}
  >
    {children}
  </span>
);

const TaskCard = ({ task }) => {
  const isExpired = new Date(task?.expireAt) < new Date();
  const progressPercentage = (task?.progress.length / 5) * 100; // Assuming max 5 steps

  // Status badge color
  const getStatusColor = () => {
    if (task?.isCompleted) return "bg-green-600 text-white border-green-700";
    if (isExpired) return "bg-red-600 text-white border-red-700";
    return "bg-blue-700 text-white border-blue-800";
  };

  // Experience badge color
  const getExperienceColor = () => {
    switch (task?.experienceLevel) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "advanced":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-800 text-gray-200 border-gray-700";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl shadow-lg bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {task?.image && (
        <div className="h-48 overflow-hidden">
          <img
            src={task?.image}
            alt={task?.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge color={getStatusColor()} className="capitalize">
                {task?.isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                  </>
                ) : isExpired ? (
                  <>
                    <XCircle className="w-3 h-3 mr-1" /> Expired
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" /> Active
                  </>
                )}
              </Badge>
              <Badge color={getExperienceColor()}>
                {task?.experienceLevel}
              </Badge>
            </div>
            <div className="text-xl font-bold mb-2 text-white">
              {task?.title}
            </div>
            <div className="text-sm text-zinc-400 line-clamp-2">
              {task?.description}
            </div>
          </div>
          {!task?.isCompleted && !isExpired && (
            <CircularTimer expireAt={task?.expireAt} size={100} />
          )}
        </div>

        {/* Progress Section */}
        {task?.progress.length > 0 && (
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Progress</span>
              <span className="font-medium text-zinc-200">
                {task?.progress.length} steps completed
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 w-40 bg-zinc-400"
            />
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-700 mt-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-400" />
            <div>
              <p className="text-xs text-zinc-400">Duration</p>
              <p className="text-sm font-medium text-zinc-200">
                {task?.duration} min
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-zinc-400" />
            <div>
              <p className="text-xs text-zinc-400">Attempts</p>
              <p className="text-sm font-medium text-zinc-200">
                {task?.attemptsUsed} / {task?.attemptsAllowed}
              </p>
            </div>
          </div>
        </div>

        {/* Sources */}
        {task?.sources.length > 0 && (
          <div className="pt-4 border-t border-zinc-700 mt-4">
            <p className="text-xs text-zinc-400 mb-2">Resources</p>
            <div className="flex flex-wrap gap-1">
              {task?.sources.slice(0, 3).map((source, idx) => (
                <Badge
                  key={idx}
                  color="bg-zinc-700 text-white border-zinc-800"
                  className="text-xs"
                >
                  {source}
                </Badge>
              ))}
              {task?.sources.length > 3 && (
                <Badge
                  color="bg-zinc-700 text-white border-zinc-800"
                  className="text-xs"
                >
                  +{task?.sources.length - 3} more
                </Badge>
              )}
              {task?.isCompleted===false && (
                <button className="w-full mt-5 py-2 rounded-2xl bg-blue-700">Upload Task</button>
              )}
              {task?.isCompleted===false && (
                <button className="w-full mt-5 py-2 rounded-2xl bg-red-700">Delete Task</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
