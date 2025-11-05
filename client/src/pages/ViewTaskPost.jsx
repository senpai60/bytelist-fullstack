import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // You'll need react-router-dom
import axios from "axios"; // ✅ Import axios

// --- Component Imports ---
import BentoBox from "../components/view_post/BentoBox";
import ScoreDisplay from "../components/view_post/ScoreDisplay";
import FeedbackList from "../components/view_post/FeedbackList";
import MetricsGrid from "../components/view_post/MetricsGrid";
import PrimaryLoader from "../components/loaders/PrimaryLoader";

// ✅ Define the SERVER_URI from environment variables
// Note: In Vite, env variables must be prefixed with VITE_ to be exposed to the client.
const SERVER_URI =
  import.meta.env.VITE_SERVER_URI || "http://localhost:3000";

// --- Icons ---
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

// --- Loading & Error Components ---
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-zinc-950">
    <div className="w-16 h-16 border-4 border-lime-300 border-t-transparent rounded-full animate-spin"></div>
    <p className="ml-4 text-lg text-zinc-100">Loading Analysis...</p>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="flex items-center justify-center h-screen bg-zinc-950 p-8">
    <div className="p-6 text-center border rounded-lg bg-zinc-900 border-red-500/50">
      <h2 className="text-2xl font-bold text-red-400">Error</h2>
      <p className="mt-2 text-zinc-300">{message}</p>
    </div>
  </div>
);

// --- Main Page Component ---
const ViewTaskPost = () => {
  const { repoPostId } = useParams(); // Get the ID from the URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContextData = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ Construct the URL using your route and SERVER_URI
        const url = `${SERVER_URI}/ai/repo-context/${repoPostId}`;

        // ✅ Use axios.get to fetch the data
        const res = await axios.get(url);

        // ✅ Set data from the response (axios nests data in `res.data`)
        setData(res.data.repoPostContext);
      } catch (err) {
        console.error("Fetch error:", err);

        // ✅ Handle axios errors
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(
            err.response.data.message ||
              `An error occurred: ${err.response.status}`
          );
        } else if (err.request) {
          // The request was made but no response was received
          setError("Could not connect to the server. Please try again.");
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (repoPostId) {
      fetchContextData();
    }
  }, [repoPostId]); // Dependency array remains the same

  // --- Render Loading State ---
  if (loading) {
    return <PrimaryLoader />;
  }

  // --- Render Error State ---
  if (error) {
    return <ErrorDisplay message={error} />;
  }

  // --- Render Data State ---
  if (!data) {
    return <ErrorDisplay message="No data was found." />;
  }

  // Destructure the data from the API response
  const {
    repoPost, // This contains title, tags, githubUrl, liveUrl
    user, // This contains username, avatar
    overallScore,
    aiSummary,
    metrics,
    strengths,
    suggestions,
    improvements,
    codeStyleFeedback,
  } = data;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-zinc-950 text-zinc-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
        {/* Box 1: Post Header */}
        <BentoBox className="lg:col-span-2">
          <div className="flex flex-col justify-between h-full">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={user.avatar || "https://avatar.vercel.sh/" + user.username}
                alt={`${user.username}'s avatar`}
                className="w-10 h-10 rounded-full bg-zinc-800"
              />
              <div>
                <h2 className="font-semibold text-zinc-100">{user.username}</h2>
                <p className="text-xs text-zinc-400">Posted this review</p>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-zinc-100">
                {repoPost.title}
              </h1>
              <p className="">
                {repoPost.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {repoPost.tags.map((tag) => (
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
                href={repoPost.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
              >
                <LinkIcon /> GitHub
              </a>
              {repoPost.liveUrl && (
                <a
                  href={repoPost.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black transition-colors rounded-lg bg-lime-300 hover:bg-lime-400"
                >
                  <LinkIcon /> Live Demo
                </a>
              )}
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