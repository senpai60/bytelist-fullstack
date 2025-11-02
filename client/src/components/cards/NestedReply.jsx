import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReplyBox from "./ReplyBox";

/**
 * Recursive Nested Reply Component
 * Displays a comment + its replies (if any)
 */
const NestedReply = ({ reply, depth = 1, onReply, isSubmitting }) => {
  const [replyingTo, setReplyingTo] = useState(null);

  const handleReplyClick = () => {
    setReplyingTo(replyingTo === reply._id ? null : reply._id);
  };

  return (
    <div
      className={`ml-${depth * 4} mt-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-3`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <img
          src={reply.author?.avatar || "/images/default-avatar.png"}
          alt={reply.author?.username || "User"}
          className="h-7 w-7 rounded-full border border-zinc-700"
        />
        <span className="text-sm text-zinc-300 font-medium">
          {reply.author?.username || "Anonymous"}
        </span>
      </div>

      {/* Body */}
      <p className="text-sm text-zinc-400 mb-2">{reply.content}</p>

      {/* Reply Button */}
      <Button
        onClick={handleReplyClick}
        variant="ghost"
        size="sm"
        className="text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
      >
        Reply
      </Button>

      {/* Reply Box */}
      {replyingTo === reply._id && (
        <ReplyBox
          parentId={reply._id}
          username={reply.author?.username}
          onSubmit={(parentId, text) => {
            onReply(parentId, text);
            setReplyingTo(null);
          }}
          onCancel={() => setReplyingTo(null)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Recursive replies */}
      {reply.replies?.length > 0 && (
        <div className="mt-3 space-y-3">
          {reply.replies.map((childReply) => (
            <NestedReply
              key={childReply._id}
              reply={childReply}
              depth={depth + 1}
              onReply={onReply}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NestedReply;
