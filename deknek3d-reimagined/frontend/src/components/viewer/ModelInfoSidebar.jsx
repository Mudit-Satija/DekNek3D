import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, Download, FileText, MessageSquare } from "lucide-react";

export default function ModelInfoSidebar({ isOpen = true, onClose }) {
  // Mock model data
  const modelData = {
    title: "Cyberpunk Robot Character",
    description:
      "A highly detailed sci-fi robot character with intricate mechanical details, perfect for games, VFX, or rendering. Features rigged skeleton, multiple material variations, and PBR textures. Compatible with most 3D engines.",
    creator: {
      name: "Alex Rivera",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      isFollowing: false,
    },
    stats: {
      views: 2543,
      likes: 487,
      downloads: 312,
      comments: 45,
    },
    tags: ["robot", "character", "rigged", "pbr", "sci-fi", "game-ready"],
    fileInfo: {
      format: "GLB",
      size: "24.5 MB",
      polygons: 125000,
      vertices: 87500,
    },
    license: "CC BY-SA 4.0",
    createdAt: "March 15, 2026",
    updatedAt: "May 1, 2026",
  };

  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(modelData.creator.isFollowing);
  const [likeCount, setLikeCount] = useState(modelData.stats.likes);

  const handleLike = useCallback(() => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  }, [liked]);

  const truncateDescription = (text, lines = 3) => {
    const lineArray = text.split("\n");
    return lineArray.slice(0, lines).join("\n");
  };

  const displayDescription = expanded
    ? modelData.description
    : truncateDescription(modelData.description);
  const isDescriptionTruncated =
    modelData.description.split("\n").length > 3 ||
    modelData.description.length > 200;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed right-0 top-0 h-screen w-96 overflow-y-auto bg-slate-950/95 border-l border-white/10 backdrop-blur-sm p-6 space-y-6"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            ✕
          </motion.button>

          {/* Model Title & Edit */}
          <div className="pr-8">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-2xl font-bold text-white leading-tight">
                {modelData.title}
              </h2>
              {/* Edit button would show if user is owner */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-slate-400 hover:text-cyan-400 text-sm mt-1"
                title="Edit (owner only)"
              >
                ✎
              </motion.button>
            </div>
          </div>

          {/* Creator Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg bg-white/5 border border-white/10 p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={modelData.creator.avatar}
                alt={modelData.creator.name}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-white">
                  {modelData.creator.name}
                </h3>
                <p className="text-xs text-slate-400">Creator</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFollowing(!isFollowing)}
              className={`w-full rounded-lg py-2 text-sm font-medium transition-all ${
                isFollowing
                  ? "bg-white/10 text-slate-300 hover:bg-white/20"
                  : "bg-cyan-500 text-black hover:bg-cyan-600"
              }`}
            >
              {isFollowing ? "✓ Following" : "+ Follow"}
            </motion.button>
          </motion.div>

          {/* Description with Read More */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
              About
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {displayDescription}
            </p>
            {isDescriptionTruncated && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 mt-2"
              >
                {expanded ? "Show less" : "Read more"}
              </motion.button>
            )}
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {modelData.tags.map((tag, idx) => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.03 }}
                  className="rounded-full bg-white/5 border border-white/20 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-white/10 hover:border-cyan-400 hover:text-cyan-300 transition-all"
                >
                  #{tag}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Stats Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-2 gap-3 rounded-lg bg-white/5 border border-white/10 p-4"
          >
            {[
              { label: "Views", value: modelData.stats.views.toLocaleString() },
              { label: "Likes", value: likeCount.toLocaleString() },
              { label: "Downloads", value: modelData.stats.downloads.toLocaleString() },
              { label: "Comments", value: modelData.stats.comments.toLocaleString() },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
                className="text-center p-2 rounded-lg bg-white/5 border border-white/5"
              >
                <div className="text-lg font-bold text-cyan-400">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2 pt-2"
          >
            <div className="flex gap-2">
              {/* Like Button */}
              <motion.button
                onClick={handleLike}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 font-medium transition-all ${
                  liked
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                }`}
              >
                <motion.div
                  animate={liked ? { scale: [1, 1.2, 0.9, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <Heart
                    size={18}
                    fill={liked ? "currentColor" : "none"}
                  />
                </motion.div>
                <span className="text-sm">Like</span>
              </motion.button>

              {/* Share Button */}
              <motion.button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied!");
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 font-medium text-slate-300 hover:bg-white/10 transition-all"
              >
                <Share2 size={18} />
                <span className="text-sm">Share</span>
              </motion.button>

              {/* Download Button */}
              <motion.button
                onClick={() => alert("Download initiated")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 font-medium text-black hover:bg-green-600 transition-all"
              >
                <Download size={18} />
                <span className="text-sm">Download</span>
              </motion.button>
            </div>
          </motion.div>

          {/* File Information */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-3"
          >
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
              File Info
            </h4>
            <div className="space-y-2 text-sm">
              {[
                { label: "Format", value: modelData.fileInfo.format },
                { label: "Size", value: modelData.fileInfo.size },
                {
                  label: "Polygons",
                  value: modelData.fileInfo.polygons.toLocaleString(),
                },
                {
                  label: "Vertices",
                  value: modelData.fileInfo.vertices.toLocaleString(),
                },
              ].map((info, idx) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + idx * 0.05 }}
                  className="flex justify-between"
                >
                  <span className="text-slate-400">{info.label}</span>
                  <span className="font-medium text-slate-200">
                    {info.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* License Information */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-2"
          >
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
              License
            </h4>
            <p className="text-sm text-slate-300 font-medium">
              {modelData.license}
            </p>
            <p className="text-xs text-slate-500">
              You are free to use this model with proper attribution.
            </p>
          </motion.div>

          {/* Dates */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="pt-2 border-t border-white/10 space-y-1 text-xs text-slate-400"
          >
            <div>Created: {modelData.createdAt}</div>
            <div>Updated: {modelData.updatedAt}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
