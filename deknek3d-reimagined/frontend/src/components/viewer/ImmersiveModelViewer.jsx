import React, { useRef, useState, useCallback, Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, AccumulativeShadows, RandomizedLight, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import ModelInfoSidebar from "./ModelInfoSidebar";

const CAMERA_PRESETS = {
  front: { position: [0, 0, 5], target: [0, 0, 0], label: "Front" },
  side: { position: [5, 0, 0], target: [0, 0, 0], label: "Side" },
  top: { position: [0, 5, 0], target: [0, 0, 0], label: "Top" },
  isometric: { position: [4, 4, 4], target: [0, 0, 0], label: "Isometric" },
  closeup: { position: [0, 1, 2.5], target: [0, 1, 0], label: "Close-up" },
};

const ENVIRONMENTS = [
  { name: "studio", label: "Studio" },
  { name: "sunset", label: "Sunset" },
  { name: "forest", label: "Forest" },
  { name: "night", label: "Night" },
];

function ModelContent({ modelUrl, groundShadow, environment, onControlsReady }) {
  const { scene: modelScene } = modelUrl ? useGLTF(modelUrl, true) : { scene: null };
  const groupRef = useRef();
  const controlsRef = useRef();
  const { camera, scene } = useThree();

  useEffect(() => {
    if (groupRef.current && modelScene) {
      // Auto-scale model to fit in view
      const box = new THREE.Box3().setFromObject(groupRef.current);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 1.5;
      camera.position.z = cameraZ;
      camera.lookAt(groupRef.current.position);
    }
  }, [modelUrl, modelScene, camera]);

  // Pass controls ref back to parent
  useEffect(() => {
    if (controlsRef.current && onControlsReady) {
      onControlsReady(controlsRef.current, camera);
    }
  }, [camera, onControlsReady]);

  return (
    <>
      {/* Environment */}
      <Environment preset={environment} />

      {/* Lights */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 10]} intensity={1} castShadow shadow-mapSize={2048} />
      <pointLight position={[-10, 5, 10]} intensity={0.5} color="#ff00ff" />

      {/* Shadow Ground */}
      {groundShadow && (
        <>
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#000000" roughness={0.8} metalness={0.2} />
          </mesh>
          <AccumulativeShadows temporal blur={3} frames={40} alphaTest={0.9} scale={20} position={[0, -1.99, 0]}>
            <RandomizedLight amount={8} radius={15} intensity={0.55} ambient={0.25} position={[5, 5, -10]} />
          </AccumulativeShadows>
        </>
      )}

      {/* Model */}
      <group ref={groupRef}>
        {modelScene && <primitive object={modelScene} scale={1.5} />}
      </group>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        dampingFactor={0.05}
        autoRotate={false}
        enableZoom
        enablePan
        minDistance={1}
        maxDistance={50}
      />
    </>
  );
}

export default function ImmersiveModelViewer({ modelUrl }) {
  const containerRef = useRef();
  const cameraRef = useRef();
  const orbitControlsRef = useRef();

  const [currentPreset, setCurrentPreset] = useState("isometric");
  const [environment, setEnvironment] = useState("studio");
  const [groundShadow, setGroundShadow] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showInfoSidebar, setShowInfoSidebar] = useState(true);

  const handleControlsReady = useCallback((controls, camera) => {
    orbitControlsRef.current = controls;
    cameraRef.current = camera;
  }, []);

  const transitionCamera = useCallback(
    (preset) => {
      if (!cameraRef.current || !orbitControlsRef.current) return;
      const { position, target } = CAMERA_PRESETS[preset];
      const camera = cameraRef.current;
      const controls = orbitControlsRef.current;

      const startPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
      const endPos = { x: position[0], y: position[1], z: position[2] };

      let progress = 0;
      const animate = () => {
        progress += 0.05;
        if (progress >= 1) progress = 1;

        camera.position.x = startPos.x + (endPos.x - startPos.x) * progress;
        camera.position.y = startPos.y + (endPos.y - startPos.y) * progress;
        camera.position.z = startPos.z + (endPos.z - startPos.z) * progress;

        controls.target.set(target[0], target[1], target[2]);
        controls.update();

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    },
    []
  );

  const handlePresetClick = useCallback(
    (preset) => {
      setCurrentPreset(preset);
      transitionCamera(preset);
    },
    [transitionCamera]
  );

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch((err) => {
        console.error("Fullscreen request failed:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  const requestAR = useCallback(async () => {
    if (!navigator.xr) {
      alert("WebXR not supported in your browser. Try Chrome on Android or Mozilla Firefox.");
      return;
    }
    try {
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test"],
        optionalFeatures: ["dom-overlay"],
        domOverlay: { root: document.body },
      });
      alert("AR mode initiated (placeholder implementation)");
    } catch (err) {
      alert("AR not available: " + err.message);
    }
  }, []);

  return (
    <div ref={containerRef} className={`relative ${isFullscreen ? "fixed inset-0 z-50" : "h-full w-full"}`}>
      <div className="flex h-full w-full">
        {/* Main Canvas Area (70%) */}
        <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-800 to-black">
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-slate-300">
                  <div className="text-sm">Loading model...</div>
                </div>
              </div>
            }
          >
            <Canvas camera={{ position: [4, 4, 4], fov: 50 }} shadows>
              <ModelContent
                modelUrl={modelUrl}
                groundShadow={groundShadow}
                environment={environment}
                onControlsReady={handleControlsReady}
              />
            </Canvas>
          </Suspense>
        </div>

        {/* Controls Panel (30%) */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-96 flex-shrink-0 overflow-y-auto rounded-l-2xl border-l border-white/8 bg-slate-950/95 backdrop-blur-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Viewer Controls</h3>
                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              {/* Camera Presets */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Camera Angles</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(CAMERA_PRESETS).map(([key, preset]) => (
                    <motion.button
                      key={key}
                      onClick={() => handlePresetClick(key)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                        currentPreset === key
                          ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/50"
                          : "bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {preset.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Environment */}
              <div className="border-t border-white/10 pt-4 mb-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Environment</h4>
                <div className="grid grid-cols-2 gap-2">
                  {ENVIRONMENTS.map((env) => (
                    <motion.button
                      key={env.name}
                      onClick={() => setEnvironment(env.name)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                        environment === env.name
                          ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                          : "bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {env.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Display Options */}
              <div className="border-t border-white/10 pt-4 mb-6">
                <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Display</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={groundShadow}
                      onChange={(e) => setGroundShadow(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-slate-300">Ground & Shadows</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoRotate}
                      onChange={(e) => setAutoRotate(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-slate-300">Auto Rotate</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <motion.button
                  onClick={toggleFullscreen}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  {isFullscreen ? "Exit Fullscreen" : "⛶ Fullscreen"}
                </motion.button>
                <motion.button
                  onClick={requestAR}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                >
                  📱 AR View
                </motion.button>
                <motion.button
                  onClick={() => {
                    const canvas = containerRef.current?.querySelector("canvas");
                    if (canvas) {
                      const link = document.createElement("a");
                      link.href = canvas.toDataURL("image/png");
                      link.download = `model-${Date.now()}.png`;
                      link.click();
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                >
                  📸 Screenshot
                </motion.button>
              </div>

              {/* Info */}
              <div className="border-t border-white/10 mt-6 pt-4 text-xs text-slate-400 space-y-1">
                <div>• Scroll to zoom</div>
                <div>• Drag to rotate</div>
                <div>• Right-click drag to pan</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Controls Button */}
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setShowSettings(true)}
          className={`absolute right-4 top-4 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20 transition-all ${
            showSettings ? "opacity-0 pointer-events-none" : ""
          }`}
        >
          ⚙ Settings
        </motion.button>

        {/* Toggle Info Sidebar Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setShowInfoSidebar(true)}
          className={`absolute left-4 top-4 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20 transition-all ${
            showInfoSidebar ? "opacity-0 pointer-events-none" : ""
          }`}
        >
          ℹ Info
        </motion.button>
      </div>

      {/* Model Info Sidebar */}
      <ModelInfoSidebar
        isOpen={showInfoSidebar}
        onClose={() => setShowInfoSidebar(false)}
      />
    </div>
  );
}
