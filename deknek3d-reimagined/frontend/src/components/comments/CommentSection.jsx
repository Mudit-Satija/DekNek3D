import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import CommentInput from "./CommentInput";
import Comment from "./Comment";

// Generate mock comment data
function generateMockComments(count = 8) {
  const avatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=user3",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=user4",
  ];

  const comments = [];
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    comments.push({
      id: `comment-${i}`,
      author: {
        name: ["Alice Chen", "Bob Johnson", "Carol Davis", "Diana Lee"][i % 4],
        avatar: avatars[i % 4],
      },
      content: [
        "This model is incredible! Perfect for my game project. The rigging is spot on.",
        "Great quality and the PBR textures look amazing. Highly recommend!",
        "How many polygons does this have? Wondering if it's game engine compatible.",
        "Fantastic work! Would love to see more variations.",
      ][i % 4],
      timestamp,
      likes: Math.floor(Math.random() * 50),
      isOwner: i === 0,
      level: 0,
      replies:
        i < 2
          ? [
              {
                id: `reply-${i}-1`,
                author: {
                  name: "Creator",
                  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=creator",
                },
                content: "Thanks so much! Feel free to reach out if you need any adjustments.",
                timestamp: new Date(timestamp.getTime() + 60000),
                likes: 12,
                isOwner: true,
                level: 1,
                replies: [],
              },
            ]
          : [],
    });
  }
  return comments;
}

export default function CommentSection({ modelId = "model-1" }) {
  const [comments, setComments] = useState(() => generateMockComments(8));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [commentCount, setCommentCount] = useState(8);
  const sentinelRef = useRef();

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMoreComments();
        }
      },
      { rootMargin: "200px" }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [isLoadingMore]);

  const loadMoreComments = async () => {
    setIsLoadingMore(true);
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newComments = generateMockComments(4);
    setComments((prev) => [...prev, ...newComments]);
    setCommentCount((prev) => prev + 4);
    setIsLoadingMore(false);
  };

  const handlePostComment = async (text) => {
    setIsPostingComment(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newComment = {
      id: `comment-${Date.now()}`,
      author: {
        name: "You",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      },
      content: text,
      timestamp: new Date(),
      likes: 0,
      isOwner: true,
      level: 0,
      replies: [],
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentCount((prev) => prev + 1);
    setIsPostingComment(false);
  };

  const handleReply = async (parentCommentId, text) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newReply = {
      id: `reply-${Date.now()}`,
      author: {
        name: "You",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
      },
      content: text,
      timestamp: new Date(),
      likes: 0,
      isOwner: true,
      level: 1,
      replies: [],
    };

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      })
    );
    setCommentCount((prev) => prev + 1);
  };

  const handleDeleteComment = async (commentId) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    setCommentCount((prev) => Math.max(0, prev - 1));
  };

  const handleLikeComment = async (commentId) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 200));
    // Like count is managed in Comment component state
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg bg-white/5 border border-white/10 p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
          <MessageSquare size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Comments</h3>
          <p className="text-xs text-slate-400">
            {commentCount} comment{commentCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Comment Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CommentInput
          onSubmit={handlePostComment}
          isLoading={isPostingComment}
          placeholder="Share your thoughts on this model..."
        />
      </motion.div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Comments List */}
      <div className="space-y-0">
        <AnimatePresence>
          {comments.length > 0 ? (
            comments.map((comment, idx) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Comment
                  {...comment}
                  onReply={handleReply}
                  onDelete={handleDeleteComment}
                  onLike={handleLikeComment}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-slate-400"
            >
              <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Load More Sentinel */}
      <div
        ref={sentinelRef}
        className="py-8 flex justify-center"
      >
        {isLoadingMore && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full"
          />
        )}
      </div>
    </motion.div>
  );
}
