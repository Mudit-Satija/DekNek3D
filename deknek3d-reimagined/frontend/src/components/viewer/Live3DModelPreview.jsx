import React, { useRef, useState, useCallback, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Grid, Wireframe, Stats } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

function PerformanceStats() {
  const [stats, setStats] = useState({ fps: 0, triangles: 0, vertices: 0 });
  const frameRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const { scene } = useThree();

  useFrame(() => {
    frameRef.current++;
    const now = Date.now();
    if (now >= lastTimeRef.current + 1000) {
      setStats({ fps: frameRef.current, ...getGeometryStats(scene) });
      frameRef.current = 0;
      lastTimeRef.current = now;
    }
  });

  return null;
}

function getGeometryStats(scene) {
  let triangles = 0;
  let vertices = 0;
  scene.traverse((child) => {
    if (child.geometry) {
      const posAttr = child.geometry.getAttribute("position");
      if (posAttr) vertices += posAttr.count;
      const indexAttr = child.geometry.getIndex?.();
      if (indexAttr) {
        triangles += indexAttr.count / 3;
      } else if (posAttr) {
        triangles += posAttr.count / 3;
      }
    }
  });
  return { triangles: Math.floor(triangles), vertices };
}

function ModelViewer({
  modelUrl,
  showGrid,
  showWireframe,
  autoRotate,
  ambientIntensity,
  directionalIntensity,
  pointLightIntensity,
  backgroundColor,
  onStatsUpdate,
}) {
  const groupRef = useRef();
  const { scene } = useThree();
  const [stats, setStats] = useState({ fps: 0, triangles: 0, vertices: 0 });
  const frameRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  const { scene: modelScene } = modelUrl ? useGLTF(modelUrl, true) : { scene: null };

  useEffect(() => {
    if (modelUrl && modelScene) {
      modelScene.traverse((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
      });
    }
  }, [modelUrl, modelScene]);

  useFrame(() => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += 0.005;
    }

    frameRef.current++;
    const now = Date.now();
    if (now >= lastTimeRef.current + 1000) {
      const triangles = getGeometryStats(scene).triangles;
      const vertices = getGeometryStats(scene).vertices;
      const newStats = { fps: frameRef.current, triangles, vertices };
      setStats(newStats);
      if (onStatsUpdate) onStatsUpdate(newStats);
      frameRef.current = 0;
      lastTimeRef.current = now;
    }
  });

  return (
    <>
      <color attach="background" args={[backgroundColor]} />

      {/* Lights */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[5, 10, 7]} intensity={directionalIntensity} castShadow />
      <pointLight position={[-5, -5, 5]} intensity={pointLightIntensity} color="#ff00ff" />

      {/* Grid */}
      {showGrid && <Grid args={[10, 10]} cellColor="#444" cellSize={1} fadeDistance={50} fadeStrength={0.3} />}

      {/* Model */}
      <group ref={groupRef}>
        {modelScene && <primitive object={modelScene} scale={1.5} />}
      </group>

      {/* Wireframe */}
      {showWireframe && modelScene && <Wireframe attach="geometry" />}

      <OrbitControls autoRotate={autoRotate} autoRotateSpeed={2} />
    </>
  );
}

export default function Live3DModelPreview({ modelUrl }) {
  const canvasRef = useRef();
  const [showControls, setShowControls] = useState(true);
  const [showStats, setShowStats] = useState(true);

  // Control states
  const [showGrid, setShowGrid] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [ambientIntensity, setAmbientIntensity] = useState(0.8);
  const [directionalIntensity, setDirectionalIntensity] = useState(1);
  const [pointLightIntensity, setPointLightIntensity] = useState(0.5);
  const [backgroundColor, setBackgroundColor] = useState("#0f172a");
  const [backgroundMode, setBackgroundMode] = useState("solid");
  const [stats, setStats] = useState({ fps: 0, triangles: 0, vertices: 0 });

  const handleScreenshot = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `thumbnail-${Date.now()}.png`;
    link.click();
  }, []);

  const resetLights = useCallback(() => {
    setAmbientIntensity(0.8);
    setDirectionalIntensity(1);
    setPointLightIntensity(0.5);
  }, []);

  return (
    <div className="relative h-screen w-full rounded-2xl border border-white/8 overflow-hidden">
      {/* Canvas */}
      <div ref={canvasRef} className="h-full w-full bg-slate-900">
        <Suspense fallback={<div className="flex items-center justify-center h-full text-white">Loading model...</div>}>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ModelViewer
              modelUrl={modelUrl}
              showGrid={showGrid}
              showWireframe={showWireframe}
              autoRotate={autoRotate}
              ambientIntensity={ambientIntensity}
              directionalIntensity={directionalIntensity}
              pointLightIntensity={pointLightIntensity}
              backgroundColor={backgroundColor}
              onStatsUpdate={setStats}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Performance Stats Overlay */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-4 left-4 rounded-lg bg-black/60 border border-white/10 p-3 text-xs font-mono text-cyan-300 space-y-1"
          >
            <div>FPS: <span className="text-white">{stats.fps}</span></div>
            <div>Triangles: <span className="text-white">{stats.triangles}</span></div>
            <div>Vertices: <span className="text-white">{stats.vertices}</span></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Panel */}
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: showControls ? 0 : 400 }}
        transition={{ duration: 0.3 }}
        className="absolute right-0 top-0 h-full w-96 rounded-l-2xl border-l border-white/8 bg-slate-950/95 backdrop-blur-sm p-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Viewer Settings</h3>
          <button
            onClick={() => setShowControls(false)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Toggle Buttons */}
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Grid", state: showGrid, setter: setShowGrid },
              { label: "Wireframe", state: showWireframe, setter: setShowWireframe },
              { label: "Auto Rotate", state: autoRotate, setter: setAutoRotate },
              { label: "Stats", state: showStats, setter: setShowStats },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => btn.setter(!btn.state)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  btn.state
                    ? "bg-cyan-500 text-black"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleScreenshot}
            className="w-full rounded-lg bg-green-500 px-3 py-2 text-xs font-medium text-black hover:bg-green-600"
          >
            📸 Screenshot
          </button>
        </div>

        {/* Lighting Controls */}
        <div className="border-t border-white/10 pt-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-white">Lighting</h4>
            <button
              onClick={resetLights}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Reset
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300">Ambient Intensity</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={ambientIntensity}
                onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-slate-400">{ambientIntensity.toFixed(1)}</span>
            </div>
            <div>
              <label className="text-xs text-slate-300">Directional Intensity</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={directionalIntensity}
                onChange={(e) => setDirectionalIntensity(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-slate-400">{directionalIntensity.toFixed(1)}</span>
            </div>
            <div>
              <label className="text-xs text-slate-300">Point Light Intensity</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={pointLightIntensity}
                onChange={(e) => setPointLightIntensity(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-slate-400">{pointLightIntensity.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Background Controls */}
        <div className="border-t border-white/10 pt-4">
          <h4 className="text-sm font-semibold text-white mb-3">Background</h4>

          <div className="space-y-3">
            <div className="flex gap-2">
              {["solid", "gradient", "dark"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setBackgroundMode(mode);
                    if (mode === "solid") setBackgroundColor("#0f172a");
                    if (mode === "gradient") setBackgroundColor("#1e293b");
                    if (mode === "dark") setBackgroundColor("#000000");
                  }}
                  className={`flex-1 rounded-lg px-2 py-1 text-xs font-medium transition-all capitalize ${
                    backgroundMode === mode
                      ? "bg-cyan-500 text-black"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs text-slate-300">Color</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-8 w-12 rounded-lg border border-white/10 cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1 rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-xs text-slate-200 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toggle Controls Button */}
      <motion.button
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setShowControls(true)}
        className={`absolute right-4 top-4 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20 transition-all ${
          showControls ? "opacity-0 pointer-events-none" : ""
        }`}
      >
        ⚙ Settings
      </motion.button>
    </div>
  );
}
