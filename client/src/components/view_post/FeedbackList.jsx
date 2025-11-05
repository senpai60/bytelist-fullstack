import React from "react";

// Simple SVG icons
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const SuggestionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.508 1.333 1.508 2.316V18"
    />
  </svg>
);

const iconMap = {
  strengths: <CheckIcon />,
  suggestions: <SuggestionIcon />,
};

const FeedbackList = ({ title, items, type = "suggestions" }) => {
  const icon = iconMap[type] || iconMap["suggestions"];

  return (
    <div className="flex flex-col h-full">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
        <span className="text-lime-300">{icon}</span>
        {title}
      </h3>
      <ul className="mt-4 space-y-3 overflow-y-auto">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3">
            <span className="flex-shrink-0 mt-1 text-xs text-lime-300">
              ●
            </span>
            <span className="text-sm text-zinc-300">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackList;