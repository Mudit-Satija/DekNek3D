import React from "react";
import { motion } from "framer-motion";

export default function Step4Settings({ visibility, license, category, onUpdate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-white">Publishing Settings</h3>
        <p className="mt-1 text-sm text-slate-300">Configure how your model will be shared</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">Visibility</label>
        <div className="space-y-2">
          {[
            { id: "public", label: "Public", desc: "Anyone can view and download" },
            { id: "unlisted", label: "Unlisted", desc: "Only with direct link" },
            { id: "private", label: "Private", desc: "Only you can view" },
          ].map((opt) => (
            <motion.label
              key={opt.id}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              className="flex items-start gap-3 rounded-lg border border-white/6 bg-white/3 p-3 cursor-pointer transition"
            >
              <input
                type="radio"
                name="visibility"
                value={opt.id}
                checked={visibility === opt.id}
                onChange={(e) => onUpdate({ visibility: e.target.value })}
                className="mt-1"
              />
              <div>
                <div className="text-sm font-medium text-white">{opt.label}</div>
                <div className="text-xs text-slate-400">{opt.desc}</div>
              </div>
            </motion.label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">License</label>
        <select
          value={license}
          onChange={(e) => onUpdate({ license: e.target.value })}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
        >
          <option value="cc0">CC0 (Public Domain)</option>
          <option value="cc-by">CC-BY (Credit Required)</option>
          <option value="cc-by-sa">CC-BY-SA (Share Alike)</option>
          <option value="cc-by-nc">CC-BY-NC (Non-Commercial)</option>
          <option value="proprietary">Proprietary</option>
        </select>
        <div className="mt-2 text-xs text-slate-400">
          {license === "cc0" && "Anyone can use freely without attribution"}
          {license === "cc-by" && "Users must credit you"}
          {license === "cc-by-sa" && "Users must credit you and share similarly"}
          {license === "cc-by-nc" && "Users cannot use commercially"}
          {license === "proprietary" && "Your custom license terms"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Category *</label>
        <select
          value={category}
          onChange={(e) => onUpdate({ category: e.target.value })}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
        >
          <option value="">Select a category</option>
          <option value="characters">Characters</option>
          <option value="vehicles">Vehicles</option>
          <option value="architecture">Architecture</option>
          <option value="nature">Nature</option>
          <option value="furniture">Furniture</option>
          <option value="abstract">Abstract</option>
          <option value="other">Other</option>
        </select>
      </div>

      <motion.div
        initial={{ backgroundColor: "rgba(15, 23, 42, 0)" }}
        animate={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
        className="rounded-lg border border-white/10 p-4"
      >
        <div className="text-sm text-slate-300">
          <div className="font-medium text-white mb-2">Summary</div>
          <ul className="space-y-1 text-xs">
            <li>• Visibility: <span className="text-cyan-300 capitalize">{visibility}</span></li>
            <li>• License: <span className="text-cyan-300 uppercase">{license}</span></li>
            <li>• Category: <span className="text-cyan-300 capitalize">{category || 'Not selected'}</span></li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}
