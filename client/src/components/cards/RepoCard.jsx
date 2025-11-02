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
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Globe,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  MessageCircle,
} from "lucide-react";
import card_InteractionApi from "../../api/card_InteractionApi";
import { useNavigate } from "react-router-dom";
// import CommentDisplay from "./CommentDisplay";

import CommentDisplay from "./CommentDisplay";

import commentsApi from "../../api/commentApi";

const dummyComments = [
  {
    _id: "1",
    user: {
      _id: "user1",
      avatar:
        "https://images.unsplash.com/photo-1761979195778-6199039c2388?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600",
      username: "Dummy User",
    },
    text: "This is a sample comment to test the display functionality.",
    createdAt: new Date("2025-10-01").toISOString(),
  },
  {
    _id: "2",
    user: {
      _id: "user2",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
      username: "Another User",
    },
    text: "Great post! I agree with the points made here.",
    createdAt: new Date("2025-10-02").toISOString(),
  },
  {
    _id: "3",
    user: {
      _id: "user1", // Same user for delete test
      avatar:
        "https://images.unsplash.com/photo-1761979195778-6199039c2388?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600",
      username: "Dummy User",
    },
    text: "Adding a second comment from the same user to test deletion.",
    createdAt: new Date("2025-11-01").toISOString(),
  },
];
const lastTwoComments = [
  {
    _id: "2",
    user: {
      _id: "user2",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
      username: "Another User",
    },
    text: "Great post! I agree with the points made here.",
    createdAt: new Date("2025-10-02").toISOString(),
  },
  {
    _id: "3",
    user: {
      _id: "user1",
      avatar:
        "https://images.unsplash.com/photo-1761979195778-6199039c2388?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600",
      username: "Dummy User",
    },
    text: "Adding a second comment from the same user to test deletion.",
    createdAt: new Date("2025-11-01").toISOString(),
  },
];

function RepoCard({ repoPost, user }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isArchived, setIsArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [archivedPosts, setArchivedPosts] = useState([]);

  const [likes, setLikes] = useState(repoPost?.likes || 0);
  const [dislikes, setDislikes] = useState(repoPost?.dislikes || 0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const [comments, setComments] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);

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

  // ✅ Fetch comments
  useEffect(() => {
    async function fetchComments() {
      try {
        setCommentsLoading(true);
        const res = await comments.get(`/${repoPost._id}/comments`);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setCommentsLoading(false);
      }
    }

    if (repoPost?._id) fetchComments();
  }, [repoPost._id]);

  const handleArchived = async (e) => {
    e.stopPropagation();
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

  useEffect(() => {
    if (repoPost && user?._id) {
      setLikes(repoPost.likes.length);
      setDislikes(repoPost.dislike.length);

      const userId = user._id.toString();

      setLiked(repoPost.likes.some((id) => id.toString() === userId));
      setDisliked(repoPost.dislike.some((id) => id.toString() === userId));
    } else if (repoPost) {
      setLikes(repoPost.likes.length);
      setDislikes(repoPost.dislike.length);
      setLiked(false);
      setDisliked(false);
    }
  }, [repoPost, user]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user?._id) {
      setErrorMessage("Please log in to like posts.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await card_InteractionApi.get(`/like/${repoPost._id}`);

      if (response?.data?.message === "Like removed") {
        setLikes(likes - 1);
        setLiked(false);
      } else if (response?.data?.message === "Liked the post") {
        setLikes(likes + 1);
        setLiked(true);
        if (disliked) {
          setDislikes(dislikes - 1);
          setDisliked(false);
        }
      }
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Error while liking the post.");
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleDislike = async (e) => {
    e.stopPropagation();
    if (!user?._id) {
      setErrorMessage("Please log in to dislike posts.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await card_InteractionApi.get(
        `/dislike/${repoPost._id}`
      );

      if (response?.data?.message === "Dislike removed") {
        setDislikes(dislikes - 1);
        setDisliked(false);
      } else if (response?.data?.message === "Disliked the post") {
        setDislikes(dislikes + 1);
        setDisliked(true);
        if (liked) {
          setLikes(likes - 1);
          setLiked(false);
        }
      }
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Error while disliking the post.");
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    setShowCommentModal(true);
  };

  const handleAddComment = async (commentText) => {
    if (!user?._id) {
      setErrorMessage("Please log in to comment.");
      return;
    }

    try {
      const response = await card_InteractionApi.post("/comment", {
        user: user._id,
        repoPost: repoPost._id,
        text: commentText,
      });

      if (response?.data?.comment) {
        setComments([response.data.comment, ...comments]);
      }
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Error posting comment.");
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await card_InteractionApi.delete(`/comment/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
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

  // Get last 2 comments for display
  const lastTwoComments = dummyComments.slice(0, 2);

  return (
    <>
      <Card
        onClick={handleRepoPageNavigation}
        className="overflow-hidden w-full md:w-80 rounded-2xl border border-zinc-800 bg-zinc-900/60 text-zinc-100 shadow-md transition-all hover:shadow-zinc-800/40 hover:-translate-y-1 cursor-pointer"
      >
        <Button
          onClick={handleArchived}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className={`flex fixed top-2 right-2 z-888 bg-zinc-950 items-center gap-1 border-zinc-700 transition-all ${
            isArchived
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-zinc-950 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          }`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isArchived ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
          {isArchived ? "Saved" : "Save"}
        </Button>
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

          {/* Display Last 2 Comments */}
         {/* Display Last 2 Comments */}
{lastTwoComments.length > 0 && (
  <div className="mt-4 space-y-3">
    {lastTwoComments.map((comment) => {
      const [showReplyBox, setShowReplyBox] = useState(false);
      const [replyText, setReplyText] = useState("");

      return (
        <div
          key={comment._id}
          className="bg-zinc-800/50 rounded-lg p-2 text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Comment header */}
          <div className="flex items-center gap-2 mb-1">
            <img
              src={comment.user?.avatar || "/images/default-avatar.png"}
              alt={comment.user?.username || "User"}
              className="h-5 w-5 rounded-full border border-zinc-700"
            />
            <span className="text-zinc-300 font-medium">
              {comment.user?.username || "Anonymous"}
            </span>
          </div>

          {/* Comment text */}
          <p className="text-zinc-400 mb-2">{comment.text}</p>

          {/* 🟢 Reply button */}
          {!showReplyBox && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowReplyBox(true);
              }}
              className="text-emerald-400 hover:text-emerald-300 text-[11px] font-medium"
            >
              Reply
            </button>
          )}

          {/* 💬 Reply input (visible only after clicking Reply) */}
          {showReplyBox && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 bg-zinc-900/70 text-zinc-300 placeholder-zinc-500 rounded-md px-2 py-1 text-xs border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Reply to ${comment._id}:`, replyText);
                  setReplyText("");
                  setShowReplyBox(false);
                }}
              >
                Send
              </Button>
            </div>
          )}
        </div>
      );
    })}
  </div>
)}

        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-zinc-800 px-3 py-2">
  <div className="flex items-center gap-2.5">
    {/* 🔗 GITHUB */}
    {repoPost?.githubUrl && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={repoPost.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
              >
                <ExternalLink className="h-[18px] w-[18px]" />
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
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
              >
                <Globe className="h-[18px] w-[18px]" />
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
      size="sm"
      className={`flex items-center gap-1 px-2 py-1 text-sm transition-all ${
        liked ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-100"
      } hover:bg-zinc-800`}
    >
      <ThumbsUp className="h-[16px] w-[16px]" />
      <span className="text-xs">{likes}</span>
    </Button>

    {/* 👎 DISLIKE */}
    <Button
      onClick={handleDislike}
      variant="ghost"
      size="sm"
      className={`flex items-center gap-1 px-2 py-1 text-sm transition-all ${
        disliked ? "text-red-400" : "text-zinc-400 hover:text-zinc-100"
      } hover:bg-zinc-800`}
    >
      <ThumbsDown className="h-[16px] w-[16px]" />
      <span className="text-xs">{dislikes}</span>
    </Button>

    {/* 💬 COMMENTS */}
    <Button
      onClick={handleCommentClick}
      variant="ghost"
      size="sm"
      className="flex items-center gap-1 px-2 py-1 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
    >
      <MessageCircle className="h-[16px] w-[16px]" />
      <span className="text-xs">{comments.length}</span>
    </Button>
  </div>
</CardFooter>


        {errorMessage && (
          <p className="text-sm text-red-400 p-3">{errorMessage}</p>
        )}
      </Card>

      {/* Comment Modal */}
      {showCommentModal && (
        <CommentDisplay
          comments={dummyComments}
          user={user}
          onClose={() => setShowCommentModal(false)}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          isLoading={commentsLoading}
        />
      )}
      {/* LAST 2 COMMENTS BEAUTIFIED */}
    </>
  );
}

export default RepoCard;
