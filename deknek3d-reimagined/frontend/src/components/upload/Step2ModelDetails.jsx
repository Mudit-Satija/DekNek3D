import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import AnimatedTagInput from "../forms/AnimatedTagInput";

export default function Step2ModelDetails({ title, description, tags, onUpdate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-white">Model Details</h3>
        <p className="mt-1 text-sm text-slate-300">Add information about your model</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="e.g., Cyberpunk Robot Character"
          maxLength={100}
          className="mt-2 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
        />
        <div className="mt-1 text-xs text-slate-400">{title.length}/100</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200">Description</label>
        <textarea
          value={description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe your model, materials, usage rights, etc."
          maxLength={1000}
          rows={5}
          className="mt-2 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none resize-none"
        />
        <div className="mt-1 text-xs text-slate-400">{description.length}/1000</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Tags</label>
        <AnimatedTagInput
          value={tags}
          onChange={(newTags) => onUpdate({ tags: newTags })}
          placeholder="Add tags to help others discover your model..."
        />
      </div>
    </motion.div>
  );
}
