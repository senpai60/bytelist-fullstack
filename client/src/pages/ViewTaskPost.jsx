import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import BentoBox from "../components/view_post/BentoBox";
import ScoreDisplay from "../components/view_post/ScoreDisplay";
import FeedbackList from "../components/view_post/FeedbackList";
import MetricsGrid from "../components/view_post/MetricsGrid";
import PrimaryLoader from "../components/loaders/PrimaryLoader";

const SERVER_URI = import.meta.env.VITE_SERVER_URI || "http://localhost:3000";

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

const ErrorDisplay = ({ message }) => (
  <div className="flex items-center justify-center h-screen bg-zinc-950 p-8">
    <div className="p-6 text-center border rounded-lg bg-zinc-900 border-red-500/50">
      <h2 className="text-2xl font-bold text-red-400">Error</h2>
      <p className="mt-2 text-zinc-300">{message}</p>
    </div>
  </div>
);

const ViewTaskPost = () => {
  const { repoPostId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredSummary, setFilteredSummary] = useState("");

  // -------------------------------------------------------
  // 1️⃣ FETCH AI CONTEXT
  // -------------------------------------------------------
  useEffect(() => {
    const fetchContextData = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${SERVER_URI}/ai/repo-context/${repoPostId}`;
        const res = await axios.get(url);
        setData(res.data.repoPostContext);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load AI analysis.");
      } finally {
        setLoading(false);
      }
    };

    if (repoPostId) fetchContextData();
  }, [repoPostId]);

  // -------------------------------------------------------
  // 2️⃣ FORMAT SUMMARY — MUST BE BEFORE CONDITIONAL RETURNS
  // -------------------------------------------------------
  useEffect(() => {
    if (!data?.aiSummary) return;

    let text = data.aiSummary;

    text = text.replace(
      /### (.*)/g,
      "<h2 class='text-xl font-semibold mt-4 mb-2'>$1</h2>"
    );

    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    text = text.replace(/- (.*)/g, "<li>$1</li>");
    text = text.replace(
      /(<li>[\s\S]*?<\/li>)/g,
      "<ul class='list-disc ml-6'>$1</ul>"
    );

    text = text.replace(/\n\n/g, "<br /><br />");

    setFilteredSummary(text);
  }, [data]);

  // -------------------------------------------------------
  // 3️⃣ CONDITIONAL RENDER (SAFE NOW)
  // -------------------------------------------------------
  if (loading) return <PrimaryLoader />;
  if (error) return <ErrorDisplay message={error} />;
  if (!data) return <ErrorDisplay message="No data was found." />;

  // Data destructuring AFTER hooks
  const {
    repoPost,
    user,
    overallScore,
    metrics,
    strengths,
    suggestions,
    improvements,
    codeStyleFeedback,
  } = data;

  // -------------------------------------------------------
  // 4️⃣ UI SECTION - UNCHANGED
  // -------------------------------------------------------
  return (
    <div className="min-h-screen p-4 md:p-8 bg-zinc-950 text-zinc-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
        
        {/* Post Header */}
        <BentoBox className="lg:col-span-2">
          <div className="flex flex-col justify-between h-full">
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
              <h1 className="text-3xl font-bold text-zinc-100">{repoPost.title}</h1>
              <p>{repoPost.description}</p>
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
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
              >
                <LinkIcon /> GitHub
              </a>

              {repoPost.liveUrl && (
                <a
                  href={repoPost.liveUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-lime-300 text-black hover:bg-lime-400"
                >
                  <LinkIcon /> Live Demo
                </a>
              )}
            </div>
          </div>
        </BentoBox>

        {/* Score */}
        <BentoBox className="lg:row-span-1">
          <ScoreDisplay score={overallScore} />
        </BentoBox>

        {/* AI Summary */}
        <BentoBox className="lg:col-span-3">
          <h3 className="mb-3 text-lg font-semibold text-zinc-100">AI Summary</h3>
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: filteredSummary }}
          ></div>
        </BentoBox>

        {/* Metrics */}
        <BentoBox className="lg:col-span-2 lg:row-span-2">
          <MetricsGrid metrics={metrics} />
        </BentoBox>

        {/* Lists */}
        <BentoBox>
          <FeedbackList title="Strengths" items={strengths} type="strengths" />
        </BentoBox>

        <BentoBox>
          <FeedbackList title="Suggestions" items={suggestions} type="suggestions" />
        </BentoBox>

        <BentoBox>
          <FeedbackList title="Improvements" items={improvements} type="suggestions" />
        </BentoBox>

        {/* Code Style */}
        <BentoBox>
          <h3 className="mb-4 text-lg font-semibold text-zinc-100">
            Code Style Feedback
          </h3>
          <ul className="space-y-3">
            {Object.entries(codeStyleFeedback).map(([key, value]) => (
              <li key={key} className="text-sm">
                <span className="font-semibold capitalize">{key}:</span>{" "}
                <span className="text-zinc-300">{value}</span>
              </li>
            ))}
          </ul>
        </BentoBox>
      </div>
    </div>
  );
};

export default ViewTaskPost;
