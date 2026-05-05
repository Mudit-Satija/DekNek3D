import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const MAX_UPLOAD_FILE_MB = Number(import.meta.env.VITE_MAX_UPLOAD_FILE_MB || 25);
const MAX_UPLOAD_FILE_BYTES = MAX_UPLOAD_FILE_MB * 1024 * 1024;

export default function MultiStepUploadForm() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["glb", "gltf", "obj", "fbx"].includes(ext)) {
      alert("Unsupported file type. Supported: .glb, .gltf, .obj, .fbx");
      return;
    }

    if (f.size > MAX_UPLOAD_FILE_BYTES) {
      alert(`File too large. Max allowed is ${MAX_UPLOAD_FILE_MB} MB`);
      return;
    }

    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title.trim() || !category) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const form = new FormData();
      form.append("modelFile", file);

      console.log("Uploading file to:", `${base}/api/upload/model`);
      console.log("Token:", token ? "Present" : "Missing");

      const uploadRes = await axios.post(`${base}/api/upload/model`, form, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", uploadRes.data);

      if (uploadRes.data?.message?.includes("Cloudinary not configured")) {
        alert("Server upload disabled: add Cloudinary credentials to backend .env");
        setLoading(false);
        return;
      }

      const fileUrl = uploadRes.data?.url;
      if (!fileUrl) throw new Error("Upload did not return a file URL");

      console.log("File URL:", fileUrl);
      console.log("Creating model with:", { title, description, category, tags });

      const createRes = await axios.post(
        `${base}/api/models`,
        { title, description, fileUrl, category, tags: tags.split(",").map(t => t.trim()).filter(Boolean) },
        { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
      );

      console.log("Model created:", createRes.data);
      alert("✅ Model published successfully!");
      setFile(null);
      setTitle("");
      setDescription("");
      setTags("");
      setCategory("");
    } catch (err) {
      console.error("Upload error:", err);
      const msg = err.response?.data?.message || err.message || "Unknown error";
      alert("❌ Publish failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto pb-8"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">
            3D Model File <span className="text-red-400">*</span>
          </label>
          <div className="relative border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-cyan-400/50 transition">
            <input
              type="file"
              accept=".glb,.gltf,.obj,.fbx"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer block">
              <div className="text-slate-300">
                {file ? (
                  <div>
                    <p className="text-green-300 font-medium">✓ {file.name}</p>
                    <p className="text-xs text-slate-400 mt-1">({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-cyan-300 font-medium">📁 Click to upload</p>
                    <p className="text-xs text-slate-400 mt-1">or drag and drop your .glb, .gltf, .obj, or .fbx file</p>
                    <p className="text-xs text-amber-300 mt-1">Max file size: {MAX_UPLOAD_FILE_MB} MB</p>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">
            Model Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My awesome 3D model"
            maxLength={100}
            className="w-full rounded-lg bg-white/8 border border-white/10 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/60 outline-none transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your model..."
            maxLength={500}
            rows={4}
            className="w-full rounded-lg bg-white/8 border border-white/10 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/60 outline-none transition resize-none"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg bg-white/8 border border-white/10 px-4 py-2.5 text-white focus:border-cyan-400/60 outline-none transition"
          >
            <option value="">-- Select a category --</option>
            <option value="character">Character</option>
            <option value="environment">Environment</option>
            <option value="prop">Prop</option>
            <option value="vehicle">Vehicle</option>
            <option value="architecture">Architecture</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. free, lowpoly, rigged"
            className="w-full rounded-lg bg-white/8 border border-white/10 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/60 outline-none transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 text-black font-semibold py-4 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? "⏳ Publishing..." : "🚀 Publish Model"}
        </button>
      </form>
    </motion.div>
  );
}
