import { useState } from "react";
import { Trash2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReplyBox from "./ReplyBox";
import NestedReply from "./NestedReply";

function CommentDisplay({
  comments,
  user,
  onClose,
  onAddComment,
  onDeleteComment,
  onAddReply, // ✅ reply handler from parent (optional)
  isLoading,
}) {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === Add new comment ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    await onAddComment(commentText);
    setCommentText("");
    setIsSubmitting(false);
  };

  // === Add reply ===
  const submitReply = async (parentId) => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    await onAddReply(parentId, replyText);
    setReplyText("");
    setReplyingTo(null);
    setIsSubmitting(false);
  };

  // === Delete comment ===
  const handleDelete = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await onDeleteComment(commentId);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-zinc-900 h-[85vh] border-zinc-800 text-zinc-100 mt-10 overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-zinc-100">
            Comments
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {comments?.length || 0}{" "}
            {(comments?.length || 0) === 1 ? "comment" : "comments"}
          </DialogDescription>
        </DialogHeader>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[80px] bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 resize-none"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Comments List */}
        <ScrollArea className="h-[70%] pr-2 mt-4">
                   {" "}
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-zinc-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading comments...
            </div>
          ) : !comments || comments.length === 0 ? (
            <div className="flex items-center justify-center h-full text-zinc-400">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div className="space-y-4">
                           {" "}
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                                   {" "}
                  <div className="flex items-start justify-between">
                                        {/* ... (Author Info block) ... */}     
                                  {/* Delete Button */}                   {" "}
                    {user?._id &&
                      comment.author?._id === user._id && ( // **FIX: Should use 'comment.author?._id' not 'comments.author?._id'**
                        <Button
                          onClick={() => handleDelete(comment._id)}
                          variant="ghost"
                          size="icon"
                          className="text-zinc-500 hover:text-red-400 hover:bg-red-950/20 h-8 w-8"
                        >
                                                  <Trash2 className="h-4 w-4" />
                                               {" "}
                        </Button>
                      )}
                                     {" "}
                  </div>
                                    {/* Comment Text */}                 {" "}
                  <p className="text-zinc-300 text-sm mt-2 leading-relaxed">
                                        {comment.text || comment.content}       
                             {" "}
                  </p>
                                    {/* REPLY BUTTON */}                 {" "}
                  <Button
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === comment._id ? null : comment._id
                      )
                    }
                    variant="ghost"
                    size="sm"
                    className="text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 mt-2"
                  >
                                        Reply                  {" "}
                  </Button>
                                    {/* TOP-LEVEL REPLY INPUT */}               
                   {" "}
                  {replyingTo === comment._id && (
                    <ReplyBox
                      parentId={comment._id} // Pass the comment author's username for @mention
                      username={comment.author?.username}
                      onSubmit={submitReply}
                      onCancel={() => setReplyingTo(null)}
                      isSubmitting={isSubmitting}
                    />
                  )}
                                                     {" "}
                  {/* NESTED REPLIES (USING RECURSIVE COMPONENT) */}           
                       {" "}
                  {comment.replies?.length > 0 && (
                    <div className="mt-3 space-y-3">
                                           {" "}
                      {comment.replies.map((reply) => (
                        <NestedReply
                          key={reply._id}
                          reply={reply}
                          depth={1} // Start depth at 1 for visual indentation
                          onReply={onAddReply} // The same handler from RepoCard
                          isSubmitting={isSubmitting}
                        />
                      ))}
                                         {" "}
                    </div>
                  )}
                                 {" "}
                </div>
              ))}
                         {" "}
            </div>
          )}
                 {" "}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDisplay;
