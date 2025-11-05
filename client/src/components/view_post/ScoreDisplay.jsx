import React from "react";

// A helper to format the score and get the stroke-dashoffset
const ScoreRing = ({ score }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-zinc-800"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className="text-lime-300"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />
      </svg>
      <span className="absolute text-4xl font-bold text-lime-300">
        {score}
      </span>
    </div>
  );
};

const ScoreDisplay = ({ score }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <ScoreRing score={score} />
      <h3 className="mt-4 text-xl font-semibold text-zinc-100">
        Overall Score
      </h3>
      <p className="text-sm text-zinc-400">AI Generated Rating</p>
    </div>
  );
};

export default ScoreDisplay;