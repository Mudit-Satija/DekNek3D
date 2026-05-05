import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import ParticleBackground from "../shared/ParticleBackground";

function RotatingPlatform({ accent = "#22d3ee" }) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.45;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.04;
  });

  return (
    <group ref={ref}>
      <mesh position={[0, -1.2, 0]} receiveShadow>
        <cylinderGeometry args={[2.35, 2.6, 0.22, 48]} />
        <meshStandardMaterial color="#0f172a" metalness={0.75} roughness={0.22} />
      </mesh>
      <mesh position={[0, -1.03, 0]}>
        <cylinderGeometry args={[1.82, 1.95, 0.08, 48]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.18} metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.42, 0.06, 16, 80]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.35} roughness={0.28} wireframe opacity={0.8} transparent />
      </mesh>
    </group>
  );
}

function LogoOrb({ accent = "#22d3ee", secondary = "#a855f7", wireframe = false, modelUrl }) {
  const ref = useRef();
  const loadedModel = modelUrl ? useGLTF(modelUrl) : null;
  const clone = useMemo(() => (loadedModel ? loadedModel.scene.clone(true) : null), [loadedModel]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.28;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.08;
  });

  if (modelUrl) {
    return (
      <group ref={ref} position={[0, 0.2, 0]} scale={1.1}>
        <primitive object={clone} />
        {wireframe ? (
          <mesh>
            <icosahedronGeometry args={[0.95, 1]} />
            <meshStandardMaterial color={accent} wireframe transparent opacity={0.22} />
          </mesh>
        ) : null}
      </group>
    );
  }

  return (
    <group ref={ref} position={[0, 0.2, 0]}>
      <mesh>
        <icosahedronGeometry args={[0.92, 1]} />
        <meshStandardMaterial
          color={accent}
          emissive={secondary}
          emissiveIntensity={0.28}
          metalness={0.72}
          roughness={0.16}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0.72, 0.46, 0.18]} scale={0.42}>
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color={secondary}
          emissive={accent}
          emissiveIntensity={0.18}
          metalness={0.6}
          roughness={0.22}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

function LoadingParticles({ count = 280, radius = 4.8, colorStart = "#22d3ee", colorEnd = "#a855f7" }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const t = count > 1 ? index / (count - 1) : 0;
      return {
        theta: Math.random() * Math.PI * 2,
        phi: Math.acos(THREE.MathUtils.randFloatSpread(2)),
        distance: THREE.MathUtils.lerp(radius * 0.35, radius, Math.random()),
        drift: THREE.MathUtils.lerp(0.2, 0.7, Math.random()),
        size: THREE.MathUtils.lerp(0.3, 0.8, Math.random()),
        tint: t,
      };
    });
  }, [count, radius]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    particles.forEach((particle, index) => {
      const orbitX = Math.cos(time * particle.drift + particle.theta) * particle.distance;
      const orbitY = Math.sin(time * particle.drift * 0.8 + particle.phi) * particle.distance * 0.55;
      const orbitZ = Math.sin(time * particle.drift + particle.theta) * particle.distance;

      dummy.position.set(orbitX, orbitY, orbitZ);
      dummy.scale.setScalar(particle.size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.rotation.y = time * 0.12;
    meshRef.current.rotation.x = Math.sin(time * 0.25) * 0.06;
  });

  const colors = useMemo(() => {
    const start = new THREE.Color(colorStart);
    const end = new THREE.Color(colorEnd);
    return particles.flatMap((particle) => {
      const color = start.clone().lerp(end, particle.tint);
      return [color.r, color.g, color.b];
    });
  }, [colorEnd, colorStart, particles]);

  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(colors), 3);
    meshRef.current.instanceColor.needsUpdate = true;
  }, [colors]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial vertexColors transparent opacity={0.85} depthWrite={false} metalness={0.1} roughness={0.3} />
    </instancedMesh>
  );
}

function LoadingCopy({ progress, tips = [], currentTip, accent = "#22d3ee" }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-8 sm:px-10 sm:pb-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 rounded-[2rem] border border-white/10 bg-slate-950/45 px-5 py-5 text-center shadow-2xl shadow-black/30 backdrop-blur-glass sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-sm uppercase tracking-[0.42em] text-cyan-300/80"
        >
          Loading your experience...
        </motion.p>

        <div className="w-full max-w-xl">
          <div className="flex items-end justify-between text-xs font-medium text-slate-300">
            <span>Preparing scene</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full border border-white/10 bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 shadow-[0_0_28px_rgba(34,211,238,0.35)]"
              animate={{ width: `${Math.max(6, Math.min(progress, 100))}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 24 }}
              style={{ boxShadow: `0 0 24px ${accent}55` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={currentTip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="max-w-2xl text-sm leading-6 text-slate-300"
          >
            {currentTip}
          </motion.p>
        </AnimatePresence>

        {tips.length > 1 ? (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {tips.map((tip, index) => (
              <span
                key={tip}
                className={`rounded-full border px-3 py-1 text-[11px] transition ${index === 0 ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100" : "border-white/10 bg-white/5 text-slate-400"}`}
              >
                {tip}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ImmersiveLoadingScreen({
  progress = 0,
  isComplete = false,
  onDismiss,
  tips = [
    "Creators can preview models with cinematic lighting before publishing.",
    "Use collections to group assets by project, client, or mood.",
    "The marketplace is built for fast browsing and immersive 3D previews.",
  ],
  colorStart = "#22d3ee",
  colorEnd = "#a855f7",
  density = "medium",
  wireframe = false,
  showLogoModelUrl,
}) {
  const [visible, setVisible] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const hideTimerRef = useRef(null);

  const count = density === "low" ? 180 : density === "high" ? 380 : 260;
  const activeTip = tips[tipIndex] ?? "Loading assets and preparing the scene...";

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTipIndex((current) => (tips.length ? (current + 1) % tips.length : 0));
    }, 3200);

    return () => window.clearInterval(interval);
  }, [tips.length]);

  useEffect(() => {
    if (!isComplete || progress < 100) return;

    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 700);

    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, [isComplete, onDismiss, progress]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="fixed inset-0 z-[90] overflow-hidden bg-slate-950 text-white"
      >
        <ParticleBackground
          overlay
          density={density}
          colorStart={colorStart}
          colorEnd={colorEnd}
          spread={22}
          particleSize={0.02}
          mouseInfluence={0.3}
          floatStrength={0.08}
          driftSpeed={0.8}
          rotationSpeed={0.75}
          glow={false}
          className="opacity-45"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2),transparent_28%),radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.16),transparent_24%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.14),transparent_22%)]" />

        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 0.8, 7.2], fov: 50 }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          dpr={[1, 1.6]}
        >
          <ambientLight intensity={0.45} color={colorStart} />
          <spotLight position={[0, 6, 5]} angle={0.28} penumbra={0.6} intensity={2.4} color="#ffffff" castShadow />
          <pointLight position={[3.5, 2.5, 4]} intensity={1.6} color={colorStart} />
          <pointLight position={[-4, -2, -3]} intensity={1} color={colorEnd} />

          <Float speed={0.9} rotationIntensity={0.3} floatIntensity={0.55}>
            <LogoOrb accent={colorStart} secondary={colorEnd} wireframe={wireframe} modelUrl={showLogoModelUrl} />
          </Float>

          <RotatingPlatform accent={colorStart} />
          <LoadingParticles count={count} colorStart={colorStart} colorEnd={colorEnd} />

          <Html center>
            <div className="pointer-events-none rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-slate-200/70 backdrop-blur-md">
              Preparing your world
            </div>
          </Html>
        </Canvas>

        <LoadingCopy progress={progress} tips={tips} currentTip={activeTip} accent={colorStart} />
      </motion.div>
    </AnimatePresence>
  );
}
