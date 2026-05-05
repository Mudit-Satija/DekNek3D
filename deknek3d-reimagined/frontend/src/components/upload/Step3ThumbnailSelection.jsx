import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef as useR3fRef } from "react";

function ThumbnailPreview() {
  const ref = useR3fRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.5 * delta;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });

  return (
    <group ref={ref}>
      <mesh>
        <icosahedronBufferGeometry args={[1, 2]} />
        <meshStandardMaterial
          color="#06b6d4"
          metalness={0.5}
          roughness={0.2}
          emissive="#06b6d4"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

export default function Step3ThumbnailSelection({ thumbnail, onThumbnailChange }) {
  const [previewMode, setPreviewMode] = useState("auto");
  const inputRef = useRef();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-white">Thumbnail</h3>
        <p className="mt-1 text-sm text-slate-300">Choose how your model will look in gallery view</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPreviewMode("auto")}
          className={`rounded-lg border-2 p-4 text-center transition-all ${
            previewMode === "auto"
              ? "border-cyan-400 bg-cyan-500/10"
              : "border-white/10 bg-white/5 hover:border-white/20"
          }`}
        >
          <div className="text-sm font-medium text-white">Auto-generated</div>
          <div className="mt-2 text-xs text-slate-400">System will generate from model</div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPreviewMode("custom")}
          className={`rounded-lg border-2 p-4 text-center transition-all ${
            previewMode === "custom"
              ? "border-cyan-400 bg-cyan-500/10"
              : "border-white/10 bg-white/5 hover:border-white/20"
          }`}
        >
          <div className="text-sm font-medium text-white">Custom upload</div>
          <div className="mt-2 text-xs text-slate-400">Upload an image</div>
        </motion.button>
      </div>

      {previewMode === "auto" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-white/10 bg-black/40 p-4"
        >
          <div className="h-64 rounded-lg overflow-hidden bg-gradient-to-b from-slate-800 to-black">
            <Canvas camera={{ position: [0, 0, 3] }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[2, 2, 5]} intensity={0.8} />
              <ThumbnailPreview />
            </Canvas>
          </div>
          <div className="mt-3 text-xs text-slate-400 text-center">Preview of auto-generated thumbnail</div>
        </motion.div>
      )}

      {previewMode === "custom" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-dashed border-white/10 p-8 text-center"
        >
          {thumbnail ? (
            <div>
              <img
                src={thumbnail}
                alt="Thumbnail preview"
                className="mx-auto h-48 w-48 rounded-lg object-cover"
              />
              <button
                onClick={() => onThumbnailChange(null)}
                className="mt-4 text-xs text-slate-400 hover:text-slate-200"
              >
                Change thumbnail
              </button>
            </div>
          ) : (
            <>
              <div className="text-sm text-slate-300">Drag and drop an image here</div>
              <div className="mt-3">
                <label className="cursor-pointer rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-black hover:bg-cyan-600">
                  Choose image
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => onThumbnailChange(evt.target?.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
