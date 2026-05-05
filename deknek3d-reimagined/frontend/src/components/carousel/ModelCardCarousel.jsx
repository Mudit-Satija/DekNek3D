import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

function ModelPreview({ modelUrl }) {
  const { scene: modelScene } = modelUrl ? useGLTF(modelUrl, true) : { scene: null };
  const groupRef = useRef();

  useEffect(() => {
    if (groupRef.current && modelScene) {
      const box = new THREE.Box3().setFromObject(groupRef.current);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 1.2;
      camera.position.z = cameraZ;
    }
  }, [modelScene]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[8, 8, 8]} intensity={0.8} castShadow />
      <pointLight position={[-5, 5, 5]} intensity={0.4} color="#ff00ff" />

      <group ref={groupRef}>
        {modelScene && <primitive object={modelScene} scale={1.2} />}
      </group>

      <OrbitControls
        autoRotate
        autoRotateSpeed={3}
        enableZoom={false}
        enablePan={false}
      />
    </>
  );
}

export default function ModelCardCarousel({
  id,
  title,
  creator,
  modelUrl = "https://models.readyplayer.me/63a8c9e50eef98c5f0f2cc68.glb",
  views = 1200,
  likes = 324,
  onClick,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef();

  // Intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={observerRef}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="relative cursor-pointer flex-shrink-0 w-64 h-64 rounded-xl overflow-hidden group"
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        {isVisible && (
          <Suspense fallback={<div className="w-full h-full bg-slate-700" />}>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ModelPreview modelUrl={modelUrl} />
            </Canvas>
          </Suspense>
        )}
      </div>

      {/* Dark Overlay on Hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Content Overlay - Always visible, scales up on hover */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex flex-col justify-end p-4 text-white"
      >
        {/* Title & Creator */}
        <div className="space-y-1">
          <h3 className="font-bold text-sm line-clamp-2">{title}</h3>
          <p className="text-xs text-slate-300">{creator}</p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1">
            <span>👁</span>
            <span>{(views / 1000).toFixed(1)}k</span>
          </div>
          <div className="flex items-center gap-1">
            <span>❤️</span>
            <span>{(likes / 100).toFixed(0)}k</span>
          </div>
        </div>
      </motion.div>

      {/* Shine effect on hover */}
      <motion.div
        initial={{ opacity: 0, x: "-100%" }}
        whileHover={{ opacity: 0.2, x: "100%" }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
      />
    </motion.div>
  );
}
