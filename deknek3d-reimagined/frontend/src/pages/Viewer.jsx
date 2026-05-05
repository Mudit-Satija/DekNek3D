import React, { useState } from "react";
import { motion } from "framer-motion";
import ImmersiveModelViewer from "../components/viewer/ImmersiveModelViewer";
import CommentSection from "../components/comments/CommentSection";
import SimilarModelsCarousel from "../components/carousel/SimilarModelsCarousel";

export default function Viewer() {
  const [modelUrl, setModelUrl] = useState(null);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950">
      {/* Top Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/10 bg-slate-950/50 backdrop-blur-sm px-6 py-4 flex-shrink-0"
      >
        <div className="flex items-center justify-between max-w-full gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Immersive 3D Viewer</h1>
            <p className="text-sm text-slate-400 mt-1">Load a model and explore it with camera presets, environments, and AR mode</p>
          </div>
          <div className="flex gap-3">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".glb,.gltf,.obj,.fbx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setModelUrl(url);
                  }
                }}
                className="hidden"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-black hover:bg-cyan-600 cursor-pointer"
              >
                📁 Load Model
              </motion.div>
            </label>
            {modelUrl && (
              <motion.button
                onClick={() => {
                  setModelUrl(null);
                  URL.revokeObjectURL(modelUrl);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                ✕ Clear
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Viewer Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {modelUrl ? (
          <>
            {/* Immersive Viewer */}
            <div className="flex-1 overflow-hidden">
              <ImmersiveModelViewer modelUrl={modelUrl} />
            </div>

            {/* Comments & Carousel Section - Scrollable */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-white/10 bg-slate-950 overflow-y-auto"
              style={{ maxHeight: "45vh" }}
            >
              <div className="p-6 space-y-6">
                {/* Comments */}
                <CommentSection modelId="model-1" />

                {/* Similar Models Carousel */}
                <SimilarModelsCarousel
                  onModelClick={(modelId) => {
                    console.log("Clicked model:", modelId);
                    // Navigate to model or load it
                  }}
                />
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-full items-center justify-center"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-white mb-2">No Model Loaded</h2>
              <p className="text-slate-400 mb-6">Click "Load Model" to import a 3D file</p>
              <div className="space-y-1 text-sm text-slate-500">
                <div>✓ Supported formats: .glb, .gltf, .obj, .fbx</div>
                <div>✓ Features: Camera presets, environments, shadows, AR</div>
                <div>✓ Drag to rotate • Scroll to zoom • Right-click to pan</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
