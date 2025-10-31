import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookmarkIcon,
  BookmarkCheck,
  ExternalLink,
  Globe,
  ThumbsUp,
  ThumbsDown,
  Loader2,
} from "lucide-react";
import card_InteractionApi from "../../api/card_InteractionApi";
import { useNavigate } from "react-router-dom";

function RepoCard({ repoPost, user }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isArchived, setIsArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [archivedPosts, setArchivedPosts] = useState([]);

  const [likes, setLikes] = useState(repoPost?.likes || 0);
  const [dislikes, setDislikes] = useState(repoPost?.dislikes || 0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const navigate = useNavigate();

  // ✅ Fetch archived posts
  useEffect(() => {
    async function fetchArchived() {
      try {
        const res = await card_InteractionApi.get("/archived", {
          withCredentials: true,
        });
        const ids = res.data.archivedPosts.map((a) => a.archivedPost[0]._id);
        setArchivedPosts(ids);

        setIsArchived(ids.includes(repoPost._id));
      } catch (err) {
        console.error(err);
      }
    }

    if (user?._id) fetchArchived();
  }, [user?._id, repoPost._id]);

  const handleArchived = async (e) => {
    e.stopPropagation(); // 🧱 Stop navigation
    if (!user?._id) return setErrorMessage("Please log in to save posts.");

    try {
      setIsLoading(true);
      const response = await card_InteractionApi.post("/save-to-archive", {
        user: user?._id,
        author: repoPost?.user?._id,
        repoPost: repoPost?._id,
      });

      if (response?.data?.message === "Post archived") {
        setIsArchived(true);
      } else if (response?.data?.message === "Removed from archive!") {
        setIsArchived(false);
      }

      setErrorMessage("");
    } catch (err) {
      setErrorMessage(err?.message || "Something went wrong while saving.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      if (disliked) {
        setDislikes(dislikes - 1);
        setDisliked(false);
      }
      setLiked(true);
    }
  };

  const handleDislike = (e) => {
    e.stopPropagation();
    if (disliked) {
      setDislikes(dislikes - 1);
      setDisliked(false);
    } else {
      setDislikes(dislikes + 1);
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      }
      setDisliked(true);
    }
  };

  const handleRepoPageNavigation = () => {
    try {
      if (!repoPost.githubUrl) return console.error("Missing GitHub URL");

      const url = new URL(repoPost.githubUrl);
      const pathParts = url.pathname.split("/").filter(Boolean);
      const [owner, repo] = pathParts;

      if (!owner || !repo) {
        console.error("Invalid repo URL:", repoPost.githubUrl);
        return;
      }

      navigate(`/repo/${owner}/${repo}`);
    } catch (err) {
      console.error("Invalid GitHub URL:", err);
    }
  };

  return (
    <Card
      onClick={handleRepoPageNavigation}
      className="overflow-hidden w-80 rounded-2xl border border-zinc-800 bg-zinc-900/60 text-zinc-100 shadow-md transition-all hover:shadow-zinc-800/40 hover:-translate-y-1 cursor-pointer"
    >
      {/* IMAGE */}
      <div className="h-40 w-full overflow-hidden bg-zinc-900">
        <img
          src={repoPost?.image || "images/default-male.jpg"}
          alt={repoPost?.title || "Project image"}
          className="h-full w-full object-cover opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>

      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <img
            src={repoPost?.user?.avatar || "/images/default-avatar.png"}
            alt={repoPost?.user?.username || "User"}
            className="h-8 w-8 rounded-full border border-zinc-700 object-cover"
          />
          <span className="text-sm text-zinc-300 font-medium">
            {repoPost?.user?.username || "Anonymous"}
          </span>
        </div>
        <CardTitle className="text-lg font-semibold text-zinc-100 line-clamp-1">
          {repoPost?.title || "Untitled Project"}
        </CardTitle>
        <CardDescription className="text-sm text-zinc-400 line-clamp-2">
          {repoPost?.description || "No description provided."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {repoPost?.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-zinc-800 pt-3">
        <div className="flex items-center gap-3">
          {/* 🔗 GITHUB */}
          {repoPost?.githubUrl && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={repoPost.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // 🧱 stop nav
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 text-zinc-200 border-zinc-700">
                  View GitHub Repo
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* 🌍 LIVE */}
          {repoPost?.liveUrl && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={repoPost.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // 🧱 stop nav
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    >
                      <Globe className="h-4 w-4" />
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 text-zinc-200 border-zinc-700">
                  Visit Live Website
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* 👍 LIKE */}
          <Button
            onClick={handleLike}
            variant="ghost"
            size="icon"
            className={`hover:bg-zinc-800 ${
              liked ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs ml-1">{likes}</span>
          </Button>

          {/* 👎 DISLIKE */}
          <Button
            onClick={handleDislike}
            variant="ghost"
            size="icon"
            className={`hover:bg-zinc-800 ${
              disliked ? "text-red-400" : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
            <span className="text-xs ml-1">{dislikes}</span>
          </Button>
        </div>

        {/* 🏷️ SAVE BUTTON */}
        <Button
          onClick={handleArchived}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className={`flex items-center gap-1 border-zinc-700 transition-all ${
            isArchived
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          }`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isArchived ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <BookmarkIcon className="h-4 w-4" />
          )}
          {isArchived ? "Saved" : "Save"}
        </Button>
      </CardFooter>

      {errorMessage && (
        <p className="text-sm text-red-400 p-3">{errorMessage}</p>
      )}
    </Card>
  );
}

export default RepoCard;
