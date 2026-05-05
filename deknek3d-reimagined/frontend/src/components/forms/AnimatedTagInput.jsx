import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Tag category colors
const TAG_CATEGORIES = {
  style: { colors: ["#0ea5e9", "#06b6d4"], label: "Style" }, // cyan
  format: { colors: ["#a78bfa", "#c4b5fd"], label: "Format" }, // purple
  skill: { colors: ["#fb7185", "#f87171"], label: "Skill" }, // pink
  medium: { colors: ["#fbbf24", "#fcd34d"], label: "Medium" }, // amber
  audience: { colors: ["#10b981", "#6ee7b7"], label: "Audience" }, // emerald
};

// Popular tags grouped by category
const POPULAR_TAGS = {
  style: ["minimalist", "modern", "retro", "realistic", "cartoon"],
  format: ["rigged", "animated", "lowpoly", "highpoly", "pbr"],
  skill: ["beginner-friendly", "intermediate", "advanced"],
  medium: ["3d-model", "character", "environment", "prop", "vehicle"],
  audience: ["game-ready", "vfx", "educational", "commercial"],
};

function getTagColor(tag) {
  for (const [category, tags] of Object.entries(POPULAR_TAGS)) {
    if (tags.includes(tag.toLowerCase())) {
      const colors = TAG_CATEGORIES[category].colors;
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }
  return "#64748b"; // slate
}

function TagPill({ tag, onRemove, index }) {
  const color = getTagColor(tag);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      whileHover={{ scale: 1.08, y: -2 }}
      className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-white"
      style={{
        background: `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`,
        border: `1.5px solid ${color}80`,
        boxShadow: `0 4px 12px ${color}40, inset 0 1px 0 ${color}60`,
        perspective: "1000px",
        transform: "rotateX(0deg) rotateY(0deg)",
      }}
    >
      {tag}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRemove}
        className="text-white/70 hover:text-white"
      >
        ✕
      </motion.button>
    </motion.div>
  );
}

export default function AnimatedTagInput({ value = [], onChange, placeholder = "Add tags..." }) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const MAX_TAGS = 10;

  // Get all available tags
  const allTags = useMemo(
    () => Object.values(POPULAR_TAGS).flat().filter((t) => !value.includes(t)),
    [value]
  );

  // Filter suggestions based on input
  const handleInputChange = useCallback(
    (val) => {
      setInput(val);
      if (val.trim().length > 0) {
        const filtered = allTags.filter((tag) =>
          tag.toLowerCase().includes(val.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 6));
      } else {
        setSuggestions([]);
      }
    },
    [allTags]
  );

  const addTag = useCallback(
    (tag) => {
      const trimmed = tag.trim().toLowerCase();
      if (
        trimmed.length > 0 &&
        !value.includes(trimmed) &&
        value.length < MAX_TAGS
      ) {
        onChange([...value, trimmed]);
        setInput("");
        setSuggestions([]);
      }
    },
    [value, onChange]
  );

  const removeTag = useCallback(
    (tag) => {
      onChange(value.filter((t) => t !== tag));
    },
    [value, onChange]
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && input.trim()) {
        e.preventDefault();
        addTag(input);
      }
    },
    [input, addTag]
  );

  const popularTags = Object.entries(POPULAR_TAGS).slice(0, 3);

  return (
    <div className="w-full space-y-4">
      {/* Input Field */}
      <div className="relative">
        <motion.div
          initial={{ backgroundColor: "rgba(255,255,255,0.02)" }}
          animate={{
            backgroundColor: focused
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.02)",
          }}
          className="rounded-lg border border-white/10 p-3 transition-all"
        >
          <motion.label
            animate={{
              y: input.length > 0 || focused ? -20 : 0,
              scale: input.length > 0 || focused ? 0.85 : 1,
              color: input.length > 0 || focused ? "rgb(6, 182, 212)" : "rgb(100, 116, 139)",
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-3 text-sm font-medium origin-left cursor-text"
          >
            {placeholder}
          </motion.label>

          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            <AnimatePresence>
              {value.map((tag, idx) => (
                <TagPill
                  key={tag}
                  tag={tag}
                  index={idx}
                  onRemove={() => removeTag(tag)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setTimeout(() => setSuggestions([]), 100);
            }}
            className="w-full bg-transparent outline-none text-slate-200 text-sm"
            disabled={value.length >= MAX_TAGS}
          />
        </motion.div>

        {/* Autocomplete Dropdown */}
        <AnimatePresence>
          {focused && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-slate-800 border border-white/10 shadow-lg z-10"
            >
              {suggestions.map((tag, idx) => (
                <motion.button
                  key={tag}
                  onClick={() => addTag(tag)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:text-slate-100 first:rounded-t-lg last:rounded-b-lg"
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: getTagColor(tag) }}
                  />
                  {tag}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Counter */}
      <div className="text-xs text-slate-400">
        {value.length}/{MAX_TAGS} tags selected
      </div>

      {/* Popular Tags Sections */}
      <div className="space-y-3">
        {popularTags.map(([category, tags]) => (
          <div key={category}>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Popular {TAG_CATEGORIES[category].label}
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 5).map((tag) => (
                <motion.button
                  key={tag}
                  onClick={() => addTag(tag)}
                  disabled={value.length >= MAX_TAGS || value.includes(tag)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    value.includes(tag)
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: value.includes(tag)
                      ? `${getTagColor(tag)}20`
                      : `${getTagColor(tag)}30`,
                    color: getTagColor(tag),
                    border: `1px solid ${getTagColor(tag)}60`,
                    opacity: value.includes(tag) ? 0.5 : 0.8,
                  }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Disabled State Message */}
      {value.length >= MAX_TAGS && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-yellow-400/70 flex items-center gap-2"
        >
          ⚠ Maximum {MAX_TAGS} tags reached
        </motion.div>
      )}
    </div>
  );
}
