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
  Trash2,
} from "lucide-react";
import card_InteractionApi from "../../api/card_InteractionApi";
import { useNavigate } from "react-router-dom";
import CommentDisplay from "./CommentDisplay";
import commentsApi from "../../api/commentApi";

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
  const [replyStates, setReplyStates] = useState({});

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
  async function fetchComments() {
    try {
      setCommentsLoading(true);
      const res = await commentsApi.get(`/${repoPost._id}`);
      console.log("the comments are:", res.data);
      setComments(res.data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  }

  // ✅ Fetch comments
  useEffect(() => {
    if (repoPost?._id) fetchComments();
  }, [repoPost._id]);

  // ✅ Archive toggle
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

  // ✅ Like/Dislike setup
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
    if (!user?._id) return setErrorMessage("Please log in to like posts.");

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
    } catch (err) {
      setErrorMessage("Error while liking the post.");
    }
    setIsLoading(false);
  };

  const handleDislike = async (e) => {
    e.stopPropagation();
    if (!user?._id) return setErrorMessage("Please log in to dislike posts.");

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
    } catch (err) {
      setErrorMessage("Error while disliking the post.");
    }
    setIsLoading(false);
  };

  // ✅ Comment handling
  const handleCommentClick = (e) => {
    e.stopPropagation();
    setShowCommentModal(true);
  };

  const handleAddComment = async (commentText) => {
    if (!user?._id) return setErrorMessage("Please log in to comment.");

    try {
      const response = await commentsApi.post(`/${repoPost._id}/comments`, {
        user: user._id,
        content: commentText,
      });
      await fetchComments()

      // if (response?.data?.comment) {
      //   // setComments([response.data.comment, ...comments]);
        
      // }
    } catch (err) {
      setErrorMessage("Error posting comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsApi.delete(`/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

 const recursivelyUpdateComments = (commentsArray, parentId, newReply) => {
  return commentsArray.map((item) => {
    // 1. Found the direct parent (either a top-level comment or a nested reply)
    if (item._id === parentId) {
      return {
        ...item,
        replies: [...(item.replies || []), newReply],
      };
    }

    // 2. Not the parent, check if it has nested replies to search deeper
    if (item.replies && item.replies.length > 0) {
      const updatedReplies = recursivelyUpdateComments(
        item.replies,
        parentId,
        newReply
      );
      // Only return a new object if the replies array was actually modified
      if (updatedReplies !== item.replies) {
        return {
          ...item,
          replies: updatedReplies,
        };
      }
    }

    // 3. Not the parent and no change needed
    return item;
  });
};

const handleAddReply = async (parentId, replyText) => {
  if (!user?._id) return setErrorMessage("Please log in to reply.");

  try {
    // POST request logic remains the same.
    // The server must return the full, populated new reply object (response.data.reply)
    const response = await commentsApi.post(`/${repoPost._id}/comments`, {
      parentId,
      content: replyText,
      user: user._id,
    });

    if (response?.data?.reply) {
      // ✅ Use the recursive function to find the right place and insert the reply
      setComments((prevComments) =>
        recursivelyUpdateComments(prevComments, parentId, response.data.reply)
      );
    }
  } catch (err) {
    setErrorMessage("Error posting reply.");
    console.error(err);
  }
};

  // ✅ Navigate to repo detail page
  const handleRepoPageNavigation = () => {
    try {
      if (!repoPost.githubUrl) return console.error("Missing GitHub URL");
      const url = new URL(repoPost.githubUrl);
      const pathParts = url.pathname.split("/").filter(Boolean);
      const [owner, repo] = pathParts;
      if (!owner || !repo) return console.error("Invalid repo URL");
      navigate(`/repo/${owner}/${repo}`);
    } catch (err) {
      console.error("Invalid GitHub URL:", err);
    }
  };

  return (
    <>
      <Card
        onClick={handleRepoPageNavigation}
        className="overflow-hidden w-full md:w-80 rounded-2xl border border-zinc-800 bg-zinc-900/60 text-zinc-100 shadow-md hover:shadow-zinc-800/40 hover:-translate-y-1 cursor-pointer"
      >
        {/* SAVE BUTTON */}
        <Button
          onClick={handleArchived}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className={`flex fixed top-2 right-2 z-888 bg-zinc-950 items-center gap-1 border-zinc-700 ${
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
            className="h-full w-full object-cover opacity-90 hover:opacity-100"
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
          <CardTitle className="text-lg font-semibold line-clamp-1">
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

          {/* ✅ Display Last 2 Comments */}
          {comments.slice(-2).length > 0 && (
            <div className="mt-4 space-y-3">
              {comments.slice(-2).map((comment) => {
                const isOwnComment =
                  user?._id && comment.author?._id === user._id;

                return (
                  <div
                    key={comment._id}
                    className="bg-zinc-800/50 rounded-lg p-2 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            comment.author?.avatar ||
                            "/images/default-avatar.png"
                          }
                          alt={comment.author?.username || "User"}
                          className="h-5 w-5 rounded-full border border-zinc-700"
                        />
                        <span className="text-zinc-300 font-medium">
                          {comment.author?.username || "Anonymous"}
                        </span>
                      </div>

                      {isOwnComment && (
                        <Button
                          onClick={() => handleDeleteComment(comment._id)}
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    <p className="text-zinc-400 mb-2">
                      {comment.text || comment.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-zinc-800 px-3 py-2">
          <div className="flex items-center gap-2.5">
            {/* GITHUB */}
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
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-[18px] w-[18px]" />
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>View GitHub Repo</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* LIVE LINK */}
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
                      <Button variant="ghost" size="icon">
                        <Globe className="h-[18px] w-[18px]" />
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>Visit Live Website</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* LIKE/DISLIKE */}
            <Button
              onClick={handleLike}
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${
                liked ? "text-emerald-400" : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <ThumbsUp className="h-[16px] w-[16px]" />
              <span className="text-xs">{likes}</span>
            </Button>

            <Button
              onClick={handleDislike}
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${
                disliked ? "text-red-400" : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <ThumbsDown className="h-[16px] w-[16px]" />
              <span className="text-xs">{dislikes}</span>
            </Button>

            {/* COMMENTS */}
            <Button
              onClick={handleCommentClick}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100"
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

      {/* 💬 Comment Modal */}
      {showCommentModal && (
        <CommentDisplay
          comments={comments}
          user={user}
          onClose={() => setShowCommentModal(false)}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onAddReply={handleAddReply}
          isLoading={commentsLoading}
        />
      )}
    </>
  );
}

export default RepoCard;
