import React, { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";

class LogoBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function SolidLogo({ paused, accent = "#22d3ee", secondary = "#a855f7", wireframe = false }) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!ref.current || paused) return;
    ref.current.rotation.y += delta * 0.35;
    ref.current.rotation.x += delta * 0.12;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
  });

  return (
    <group ref={ref}>
      <mesh>
        <octahedronGeometry args={[0.78, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={secondary}
          emissiveIntensity={paused ? 0.35 : 0.2}
          metalness={0.7}
          roughness={0.18}
          wireframe={wireframe}
        />
      </mesh>
      <mesh scale={0.45} position={[0.82, 0.48, 0.12]}>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color={secondary}
          emissive={accent}
          emissiveIntensity={paused ? 0.22 : 0.12}
          metalness={0.75}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

function ModelLogo({ url, paused, accent = "#22d3ee", wireframe = false }) {
  const scene = useGLTF(url);
  const ref = useRef();
  const clone = useMemo(() => scene.scene.clone(true), [scene.scene]);

  useFrame((state, delta) => {
    if (!ref.current || paused) return;
    ref.current.rotation.y += delta * 0.25;
    ref.current.rotation.x += delta * 0.08;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group ref={ref} scale={1.08}>
      <primitive object={clone} />
    </group>
  );
}

function GlowRig({ active, glowColor }) {
  return (
    <group>
      <ambientLight intensity={active ? 1 : 0.75} color={glowColor} />
      <pointLight position={[2.5, 2.5, 3]} intensity={active ? 2.4 : 1.5} color={glowColor} />
      <pointLight position={[-2, -1, 2]} intensity={0.9} color="#3b82f6" />
    </group>
  );
}

export default function Logo3D({
  size = 64,
  className = "",
  modelUrl,
  wireframe = false,
  accent = "#22d3ee",
  secondary = "#a855f7",
  floating = true,
  glow = true,
  pauseOnHover = true,
  showLabel = false,
  backgroundClassName = "",
}) {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const containerStyle = useMemo(
    () => ({ width: size, height: size, minWidth: size, minHeight: size }),
    [size]
  );

  const wrapperClassName = [
    "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-cyan-950/20 backdrop-blur-glass",
    backgroundClassName,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = modelUrl ? (
    <LogoBoundary fallback={<SolidLogo paused={hovered} accent={accent} secondary={secondary} wireframe={wireframe} />}>
      <Suspense fallback={<SolidLogo paused={hovered} accent={accent} secondary={secondary} wireframe={wireframe} />}>
        <ModelLogo url={modelUrl} paused={pauseOnHover && hovered} accent={accent} wireframe={wireframe} />
      </Suspense>
    </LogoBoundary>
  ) : (
    <SolidLogo paused={pauseOnHover && hovered} accent={accent} secondary={secondary} wireframe={wireframe} />
  );

  return (
    <motion.div
      style={containerStyle}
      className={wrapperClassName}
      onMouseEnter={() => {
        setHovered(true);
        setActive(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setActive(false);
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.18 }}
    >
      <div className={`relative h-full w-full ${floating ? "animate-[logo-float_5.5s_ease-in-out_infinite]" : ""}`}>
        <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }} gl={{ alpha: true, antialias: true }} dpr={[1, 2]}>
          <GlowRig active={glow && active} glowColor={accent} />
          <Float speed={floating ? 1.1 : 0} rotationIntensity={floating ? 0.6 : 0} floatIntensity={floating ? 0.55 : 0}>
            {content}
          </Float>
          <Html center>
            {showLabel ? (
              <div className="pointer-events-none rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-slate-200/70 backdrop-blur-md">
                Deknek3D
              </div>
            ) : null}
          </Html>
        </Canvas>

        {glow ? (
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}
            style={{
              boxShadow: `inset 0 0 0 1px ${accent}55, 0 0 34px ${accent}40, 0 0 60px ${secondary}24`,
            }}
          />
        ) : null}
      </div>
    </motion.div>
  );
}
