import React from "react";

// Helper to format metric names (e.g., "efficiencyScore" -> "Efficiency Score")
const formatMetricName = (name) => {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace("Score", "")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
};

const MetricItem = ({ name, score }) => (
  <div className="p-4 rounded-lg bg-zinc-800/50">
    <div className="flex items-baseline justify-between">
      <span className="text-sm font-medium text-zinc-300">
        {formatMetricName(name)}
      </span>
      <span className="text-xl font-semibold text-lime-300">{score}</span>
    </div>
    <div className="w-full mt-2 bg-zinc-700 rounded-full h-1.5">
      <div
        className="bg-lime-300 h-1.5 rounded-full"
        style={{ width: `${score}%` }}
      ></div>
    </div>
  </div>
);

const MetricsGrid = ({ metrics }) => {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold text-zinc-100">Detailed Metrics</h3>
      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
        {Object.entries(metrics).map(([key, value]) => (
          <MetricItem key={key} name={key} score={value} />
        ))}
      </div>
    </div>
  );
};

export default MetricsGrid;