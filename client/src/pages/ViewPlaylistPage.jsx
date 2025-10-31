import { useState, useEffect } from "react";
import RepoCard from "../components/cards/RepoCard"; // ✅ adjust path if needed
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function ViewPlaylistPage() {
  const { playlistId } = useParams(); // future API use
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState({
    title: "Frontend Mastery",
    description:
      "A hand-picked playlist of frontend repos to master React, Tailwind, and UI design.",
    creator: {
      username: "mahima-dev",
      avatar: "/images/default-female.jpg",
    },
    tags: ["react", "ui", "tailwind", "frontend"],
    repos: [
      {
        _id: "1",
        title: "React UI Components",
        description: "Reusable UI components built with Tailwind and Shadcn.",
        image: "/images/default-male.jpg",
        githubUrl: "https://github.com/mahima/react-ui-kit",
        liveUrl: "https://reactuikit.vercel.app",
        tags: ["react", "tailwind"],
        user: { username: "mahima-dev", avatar: "/images/default-female.jpg" },
        likes: 12,
        dislikes: 2,
      },
      {
        _id: "2",
        title: "Portfolio Website",
        description: "Modern portfolio using React + Framer Motion animations.",
        image: "/images/default-male.jpg",
        githubUrl: "https://github.com/vivek-byte/portfolio",
        liveUrl: "https://vivekbyte.vercel.app",
        tags: ["react", "framer-motion"],
        user: { username: "vivek-byte", avatar: "/images/default-avatar.png" },
        likes: 18,
        dislikes: 1,
      },
    ],
  });

  // ⏳ Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-300">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading Playlist...
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-4 mb-3">
            <img
              src={playlist.creator.avatar}
              alt={playlist.creator.username}
              className="h-12 w-12 rounded-full border border-zinc-700 object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-zinc-100">
                {playlist.title}
              </h1>
              <p className="text-zinc-400 text-sm">
                Created by {playlist.creator.username}
              </p>
            </div>
          </div>
          <p className="text-zinc-400 mb-3">{playlist.description}</p>
          <div className="flex flex-wrap gap-2">
            {playlist.tags.map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* REPOS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlist.repos.map((repo, i) => (
            <RepoCard key={i} repoPost={repo} user={playlist.creator} />
          ))}
        </div>

        {/* FOOTER BUTTON */}
        <div className="flex justify-center mt-10">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl">
            Follow Playlist
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ViewPlaylistPage;
