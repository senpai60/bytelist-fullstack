import React from "react";
import BentoBox from "../components/view_post/BentoBox";
import ScoreDisplay from "../components/view_post/ScoreDisplay";
import FeedbackList from "../components/view_post/FeedbackList";
import MetricsGrid from "../components/view_post/MetricsGrid";

// --- Mock Data ---
// In a real app, you'd fetch this or get it from props/loader
const aiFeedback = {
  _id: { $oid: "690b193bc9fb88a3060fdb8a" },
  repoPost: { $oid: "690b192882339dc0fe68a829" },
  aiSummary:
    "The Metaverse repository provides a minimal setup for a React application using Vite, featuring hot module replacement (HMR) and ESLint integration. It includes essential dependencies for React and Tailwind CSS, along with a structured file organization for components and styles.",
  codeStyleFeedback: {
    structure:
      "The project structure is clear and organized, with separate folders for components and styles.",
    naming: "Naming conventions are consistent and descriptive.",
    comments: "Code comments are minimal; consider adding more explanations.",
    designPattern:
      "Follows a component-based design pattern typical in React applications.",
    uiConsistency: "UI elements are consistent with Tailwind CSS styling.",
    userExperience: "User experience is basic; consider adding interactive features.",
  },
  experienceLevel: "intermediate",
  improvements: [
    "Add TypeScript support.",
    "Improve README with detailed setup instructions.",
    "Include more comprehensive ESLint rules.",
  ],
  metrics: {
    efficiencyScore: 75,
    scalabilityScore: 70,
    designQualityScore: 80,
    creativityScore: 65,
    userExperienceScore: 60,
    readabilityScore: 75,
    maintainabilityScore: 70,
    documentationScore: 50,
  },
  overallScore: 68,
  strengths: [
    "Minimal setup for React with Vite.",
    "Integration of Tailwind CSS for styling.",
    "Use of modern React features like StrictMode.",
  ],
  suggestions: [
    "Consider adding TypeScript for better type safety.",
    "Enhance documentation with examples of usage.",
    "Implement more components to showcase the capabilities of the setup.",
  ],
};

// Assuming you also have the post data
const postData = {
  title: "Metaverse React Project",
  tags: ["react", "vite", "tailwind", "metaverse"],
  githubUrl: "https://github.com/user/repo",
  liveUrl: "https://repo.live",
};
// --- End Mock Data ---

// Icon for links
const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
);

const ViewTaskPost = () => {
  // Assuming 'aiFeedback' and 'postData' are fetched or passed as props
  const {
    overallScore,
    aiSummary,
    metrics,
    strengths,
    suggestions,
    improvements,
    codeStyleFeedback,
  } = aiFeedback;

  return (
    // Ensure your body has bg-zinc-950
    <div className="min-h-screen p-4 md:p-8 bg-zinc-950 text-zinc-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
        {/* Box 1: Post Header */}
        <BentoBox className="lg:col-span-2">
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-3xl font-bold text-zinc-100">
                {postData.title}
              </h1>
              <div className="flex flex-wrap gap-2 mt-3">
                {postData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-zinc-800 text-lime-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <a
                href={postData.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
              >
                <LinkIcon /> GitHub
              </a>
              <a
                href={postData.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black transition-colors rounded-lg bg-lime-300 hover:bg-lime-400"
              >
                <LinkIcon /> Live Demo
              </a>
            </div>
          </div>
        </BentoBox>

        {/* Box 2: Overall Score */}
        <BentoBox className="lg:row-span-1">
          <ScoreDisplay score={overallScore} />
        </BentoBox>

        {/* Box 3: AI Summary */}
        <BentoBox className="lg:col-span-3">
          <h3 className="mb-3 text-lg font-semibold text-zinc-100">
            AI Summary
          </h3>
          <p className="text-zinc-300">{aiSummary}</p>
        </BentoBox>

        {/* Box 4: Metrics */}
        <BentoBox className="lg:col-span-2 lg:row-span-2">
          <MetricsGrid metrics={metrics} />
        </BentoBox>

        {/* Box 5: Strengths */}
        <BentoBox>
          <FeedbackList
            title="Strengths"
            items={strengths}
            type="strengths"
          />
        </BentoBox>

        {/* Box 6: Suggestions */}
        <BentoBox>
          <FeedbackList
            title="Suggestions"
            items={suggestions}
            type="suggestions"
          />
        </BentoBox>

        {/* Box 7: Improvements */}
        <BentoBox>
          <FeedbackList
            title="Improvements"
            items={improvements}
            type="suggestions"
          />
        </BentoBox>

        {/* Box 8: Code Style Feedback */}
        <BentoBox>
          <h3 className="mb-4 text-lg font-semibold text-zinc-100">
            Code Style Feedback
          </h3>
          <ul className="space-y-3">
            {Object.entries(codeStyleFeedback).map(([key, value]) => (
              <li key={key} className="text-sm">
                <span className="font-semibold text-zinc-100 capitalize">
                  {key}:
                </span>
                <span className="ml-2 text-zinc-300">{value}</span>
              </li>
            ))}
          </ul>
        </BentoBox>
      </div>
    </div>
  );
};

export default ViewTaskPost;