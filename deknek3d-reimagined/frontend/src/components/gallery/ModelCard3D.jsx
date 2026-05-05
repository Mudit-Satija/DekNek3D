import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";

function PlaceholderModel() {
  return (
    <mesh>
      <icosahedronGeometry args={[0.9, 0]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.2} roughness={0.6} />
    </mesh>
  );
}

function RotatingModel({ url, active }) {
  const ref = useRef();
  try {
    const { scene } = useGLTF(url, true);
    useFrame((state, delta) => {
      if (!ref.current) return;
      if (active) return; // pause rotation when active (hover)
      ref.current.rotation.y += 0.25 * delta;
    });
    return <primitive ref={ref} object={scene} scale={0.9} position={[0, -0.6, 0]} />;
  } catch (e) {
    return <PlaceholderModel />;
  }
}

function GLTFPreview({ url, active }) {
  return <RotatingModel url={url} active={active} />;
}

export default function ModelCard3D({ item, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const [loadModel, setLoadModel] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setLoadModel(true);
      });
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const creatorName = item.creator?.name || "Unknown";
  const creatorInitial = creatorName.charAt(0).toUpperCase();

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25 }}
      className={`group relative rounded-2xl overflow-hidden border border-white/6 bg-white/3 shadow-sm`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen && onOpen(item)}
    >
      <div className={`relative h-56 w-full ${hovered ? 'ring-2 ring-cyan-400/40' : ''}`}>
        <Canvas camera={{ position: [0, 0, 3] }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 2, 5]} intensity={0.6} />
          <Suspense fallback={<PlaceholderModel />}>
            {loadModel && item.modelUrl ? (
              <GLTFPreview url={item.modelUrl} active={hovered} />
            ) : (
              <PlaceholderModel />
            )}
          </Suspense>
        </Canvas>
        <div className={`absolute inset-0 transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {item.creator?.avatar ? (
              <img src={item.creator.avatar} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/25 text-xs font-semibold text-cyan-200">
                {creatorInitial}
              </div>
            )}
            <div>
              <div className="text-sm font-semibold text-white truncate">{item.title}</div>
              <div className="text-xs text-slate-400">{creatorName}</div>
            </div>
          </div>
          <div className="text-xs text-slate-300">{item.views ?? 0} views</div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div>❤ {item.likes ?? 0}</div>
            <div>⬇ {item.downloads ?? 0}</div>
          </div>
          <div className="text-xs text-slate-500">{new Date(item.createdAt || Date.now()).toLocaleDateString()}</div>
        </div>
      </div>
    </motion.div>
  );
}
