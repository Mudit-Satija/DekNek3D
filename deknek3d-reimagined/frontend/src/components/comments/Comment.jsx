import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Trash2, ChevronDown } from "lucide-react";
import CommentInput from "./CommentInput";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

function formatTimeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export default function Comment({
  id,
  author,
  content,
  timestamp,
  likes = 0,
  isOwner = false,
  level = 0, // 0 = top level, 1 = first reply, etc.
  onReply,
  onDelete,
  onLike,
  replies = [],
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    onLike?.(id);
  };

  const handleReplySubmit = async (text) => {
    setIsPosting(true);
    await onReply?.(id, text);
    setIsPosting(false);
    setShowReplyInput(false);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    await onDelete?.(id);
    setIsDeleting(false);
    setShowDeleteModal(false);
  };

  const maxNestingLevel = 2;
  const canReply = level < maxNestingLevel;
  const indentPixels = level > 0 ? Math.min(level * 48, 96) : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        style={{ marginLeft: `${indentPixels}px` }}
        className="flex gap-3 py-4"
      >
        {/* Avatar */}
        <img
          src={author.avatar}
          alt={author.name}
          className="w-9 h-9 rounded-full flex-shrink-0 bg-gradient-to-br from-cyan-400 to-purple-500"
        />

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm text-white">{author.name}</h4>
            <span className="text-xs text-slate-500">
              {formatTimeAgo(timestamp)}
            </span>
            {isOwner && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/20 text-cyan-400">
                Owner
              </span>
            )}
          </div>

          {/* Comment Text */}
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            {content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 mb-3">
            {/* Like Button */}
            <motion.button
              onClick={handleLike}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400"
            >
              <motion.div
                animate={liked ? { scale: [1, 1.2, 0.9, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  size={16}
                  fill={liked ? "currentColor" : "none"}
                  className={liked ? "text-red-400" : ""}
                />
              </motion.div>
              <span>{likeCount}</span>
            </motion.button>

            {/* Reply Button */}
            {canReply && (
              <motion.button
                onClick={() => setShowReplyInput(!showReplyInput)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400"
              >
                <MessageCircle size={16} />
                <span>Reply</span>
              </motion.button>
            )}

            {/* Delete Button */}
            {isOwner && (
              <motion.button
                onClick={() => setShowDeleteModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </motion.button>
            )}
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {showReplyInput && (
              <CommentInput
                isReply
                placeholder="Write a reply..."
                onSubmit={handleReplySubmit}
                isLoading={isPosting}
                onCancel={() => setShowReplyInput(false)}
              />
            )}
          </AnimatePresence>

          {/* Nested Replies */}
          {replies && replies.length > 0 && level < maxNestingLevel && (
            <div className="mt-4 border-l border-white/10 pl-3 space-y-0">
              <motion.button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 mb-3"
              >
                <ChevronDown
                  size={14}
                  className={`transform transition-transform ${
                    showReplies ? "" : "-rotate-90"
                  }`}
                />
                <span>{replies.length} repl{replies.length === 1 ? "y" : "ies"}</span>
              </motion.button>

              <AnimatePresence>
                {showReplies && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-0"
                  >
                    {replies.map((reply) => (
                      <Comment
                        key={reply.id}
                        {...reply}
                        level={level + 1}
                        onReply={onReply}
                        onDelete={onDelete}
                        onLike={onLike}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        isDeleting={isDeleting}
      />
    </>
  );
}
