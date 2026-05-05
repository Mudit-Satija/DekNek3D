import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function FloatingUploadIcon() {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 2.5) * 0.15;
    ref.current.rotation.z += 0.3 * delta;
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.08, 32]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.3} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[0.35, 0.55, 32]} />
        <meshStandardMaterial color="#06b6d4" metalness={0.25} roughness={0.25} />
      </mesh>
    </group>
  );
}

export default function Step1FileUpload({ file, onFileChange }) {
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files) => {
      const f = files[0];
      if (!f) return;
      const ext = (f.name || "").slice(((f.name || "").lastIndexOf("."))).toLowerCase();
      if (![".glb", ".gltf", ".obj", ".fbx"].includes(ext)) {
        alert("Unsupported file type. Supported: .glb, .gltf, .obj, .fbx");
        return;
      }
      onFileChange(f);
    },
    [onFileChange]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setDragging(false), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-white">Upload your 3D model</h3>
      <p className="text-sm text-slate-300">Drag and drop or click to browse. Supported: .glb, .gltf, .obj, .fbx</p>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          dragging
            ? "border-cyan-400/80 bg-white/5"
            : file
            ? "border-green-400/50 bg-green-500/5"
            : "border-white/10 bg-white/2"
        }`}
      >
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32">
            <Canvas camera={{ position: [0, 0, 3] }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[2, 2, 5]} intensity={0.6} />
              <FloatingUploadIcon />
            </Canvas>
          </div>
        </div>

        {!file ? (
          <>
            <div className="text-sm text-slate-300">Drag your model here</div>
            <div className="mt-3">
              <label className="cursor-pointer rounded-lg bg-cyan-500 px-6 py-2 text-sm font-medium text-black hover:bg-cyan-600">
                Or browse
                <input
                  type="file"
                  accept=".glb,.gltf,.obj,.fbx"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>
            </div>
          </>
        ) : (
          <div className="text-green-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <div className="text-sm font-medium">{file.name}</div>
            <div className="mt-2 text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            <button
              onClick={() => onFileChange(null)}
              className="mt-3 text-xs text-slate-400 hover:text-slate-200"
            >
              Change file
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
