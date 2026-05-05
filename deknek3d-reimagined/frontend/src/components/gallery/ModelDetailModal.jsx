import React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function GLTFViewer({ url }) {
  try {
    const { scene } = useGLTF(url, true);
    return <primitive object={scene} scale={1} position={[0, -0.6, 0]} />;
  } catch (e) {
    return null;
  }
}

export default function ModelDetailModal({ open, onClose, item }) {
  if (!open) return null;
  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ y: 40, scale: 0.98 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.25 }} className="relative z-10 w-[90%] max-w-4xl rounded-2xl bg-slate-950/80 p-6 border border-white/8">
        <div className="flex items-start gap-6">
          <div className="w-96 h-64 rounded-lg overflow-hidden bg-black/40">
            <Canvas camera={{ position: [0, 0, 3] }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[2, 2, 5]} intensity={0.6} />
              {item?.modelUrl ? <GLTFViewer url={item.modelUrl} /> : null}
              <OrbitControls />
            </Canvas>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{item?.title}</h3>
            <p className="mt-2 text-sm text-slate-300">By {item?.creator?.name || 'Unknown'}</p>
            <div className="mt-4 flex gap-4 text-sm text-slate-300">
              <div>Views: {item?.views ?? 0}</div>
              <div>Likes: {item?.likes ?? 0}</div>
              <div>Downloads: {item?.downloads ?? 0}</div>
            </div>
            <div className="mt-6 text-sm text-slate-300">{item?.description || 'No description provided.'}</div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="rounded-md bg-white/5 px-4 py-2 text-sm text-slate-200">Close</button>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
