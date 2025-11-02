import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";

/**
 * ReplyBox Component
 * --------------------
 * Props:
 * - parentId: ID of the comment being replied to
 * - onSubmit: function to handle reply submission (parentId, replyText)
 * - onCancel: optional, to close the reply box
 * - username: name of user being replied to (for placeholder text)
 * - isSubmitting: boolean (optional)
 */

function ReplyBox({ parentId, onSubmit, onCancel, username, isSubmitting = false }) {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = async () => {
    if (!replyText.trim()) return;
    await onSubmit(parentId, replyText);
    setReplyText("");
  };

  return (
    <div className="mt-3 ml-10 bg-zinc-900/40 border border-zinc-800 rounded-lg p-3 transition-colors">
      <Textarea
        placeholder={`Reply to ${username || "user"}...`}
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className="bg-zinc-800 border-zinc-700 text-zinc-200 text-sm resize-none"
        rows={3}
      />

      <div className="flex justify-end mt-2 gap-2">
        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !replyText.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          size="sm"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? "Sending..." : "Send Reply"}
        </Button>
      </div>
    </div>
  );
}

export default ReplyBox;
