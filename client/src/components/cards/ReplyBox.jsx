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

function ReplyBox({
  parentId,
  onSubmit,
  onCancel,
  username,
  isSubmitting = false,
}) {
  const [replyText, setReplyText] = useState(""); // This will only hold the new text

  // ❌ We no longer need the useEffect to set text

  const handleSubmit = async () => {
    if (!replyText.trim()) return; // Only check if new text exists
    
    // ✅ Create the full reply string right before submitting
    const fullReply = `@${username} ${replyText}`;
    
    await onSubmit(parentId, fullReply); // Send the combined string
    setReplyText(""); // Reset only our input
  };

  return (
    <div className="mt-3 ml-10 bg-zinc-900/40 border border-zinc-800 rounded-lg p-3 transition-colors">
      
      {/* ✅ New wrapper to make it look like one field */}
      <div className="flex items-start bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
        
        {/* ✅ The read-only prefix */}
        {username && (
          <span className="py-2.5 px-3 text-emerald-400 whitespace-nowrap">
            @{username}
          </span>
        )}

        {/* ✅ The actual Textarea, styled to be seamless */}
        <Textarea
          placeholder={`Add to your reply...`}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="bg-transparent border-0 text-zinc-200 resize-none w-full
                     !outline-none !ring-0 !border-0
                     focus:!ring-0 focus-visible:!ring-0
                     focus:!outline-none focus-visible:!outline-none
                     focus:!border-0 focus-visible:!border-0
                     placeholder:text-zinc-500"
          rows={3}
        />
      </div>

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