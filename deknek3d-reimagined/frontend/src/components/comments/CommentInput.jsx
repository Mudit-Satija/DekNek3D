import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Bold, Italic, Link2 } from "lucide-react";

export default function CommentInput({
  onSubmit,
  isLoading = false,
  isReply = false,
  placeholder = "Add a comment...",
  onCancel,
}) {
  const [text, setText] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const textareaRef = useRef();

  const currentUser = {
    name: "You",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await onSubmit(text);
    setText("");
    setIsBold(false);
    setIsItalic(false);
  };

  const applyFormat = (format) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    if (!selectedText) return;

    let formattedText = selectedText;
    if (format === "bold") {
      formattedText = `**${selectedText}**`;
    } else if (format === "italic") {
      formattedText = `*${selectedText}*`;
    } else if (format === "link") {
      formattedText = `[${selectedText}](url)`;
    }

    const newText = text.substring(0, start) + formattedText + text.substring(end);
    setText(newText);
    setIsBold(false);
    setIsItalic(false);
  };

  const renderText = (content) => {
    // Simple markdown rendering
    let html = content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    return html;
  };

  return (
    <motion.div
      initial={isReply ? { opacity: 0, y: -10 } : {}}
      animate={isReply ? { opacity: 1, y: 0 } : {}}
      className={`${isReply ? "ml-12 mb-4" : ""}`}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-cyan-400 to-purple-500"
        />

        {/* Input Area */}
        <div className="flex-1 space-y-2">
          <div className="rounded-lg bg-white/5 border border-white/10 p-3 space-y-3">
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              rows={isReply ? 2 : 3}
              className="w-full bg-transparent outline-none text-slate-200 placeholder:text-slate-500 resize-none text-sm"
            />

            {/* Preview */}
            {text && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="border-t border-white/10 pt-2 text-xs text-slate-400 italic"
                dangerouslySetInnerHTML={{
                  __html: `Preview: ${renderText(text).substring(0, 100)}...`,
                }}
              />
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => applyFormat("bold")}
                  disabled={!text}
                  className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 text-slate-400 hover:text-white"
                  title="Bold"
                >
                  <Bold size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => applyFormat("italic")}
                  disabled={!text}
                  className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 text-slate-400 hover:text-white"
                  title="Italic"
                >
                  <Italic size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => applyFormat("link")}
                  disabled={!text}
                  className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 text-slate-400 hover:text-white"
                  title="Link"
                >
                  <Link2 size={16} />
                </motion.button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isReply && onCancel && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onCancel}
                    className="px-3 py-1.5 rounded-lg bg-white/5 text-xs font-medium text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={!text.trim() || isLoading}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500 text-xs font-medium text-black hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <motion.div
                    animate={isLoading ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                  >
                    <Send size={14} />
                  </motion.div>
                  Post
                </motion.button>
              </div>
            </div>
          </div>

          {/* Character Count */}
          <div className="text-xs text-slate-500 px-1">
            {text.length} characters
          </div>
        </div>
      </div>
    </motion.div>
  );
}
