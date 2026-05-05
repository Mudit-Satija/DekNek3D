import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useRef } from "react";

function StepSphere({ step, isActive, isCompleted }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += (isActive ? 1.5 : 0.4) * delta;
    ref.current.rotation.y += (isActive ? 2 : 0.6) * delta;
  });

  const color = isActive ? "#06b6d4" : isCompleted ? "#10b981" : "#475569";
  const emissive = isActive ? "#06b6d4" : isCompleted ? "#10b981" : undefined;

  return (
    <Canvas style={{ width: 56, height: 56 }} camera={{ position: [0, 0, 2.5] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 5]} intensity={isActive ? 1.2 : 0.8} />
      <group ref={ref}>
        <mesh>
          <icosahedronBufferGeometry args={[0.7, 2]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={isActive ? 0.5 : 0}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        {isActive && (
          <mesh scale={1.15}>
            <icosahedronBufferGeometry args={[0.7, 2]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.2}
              transparent
              opacity={0.3}
              metalness={0.2}
              roughness={0.6}
            />
          </mesh>
        )}
      </group>
    </Canvas>
  );
}

export default function StepIndicator3D({ currentStep, completedSteps }) {
  const steps = [
    { id: 1, label: "Upload", icon: "📁" },
    { id: 2, label: "Details", icon: "📝" },
    { id: 3, label: "Thumbnail", icon: "🖼" },
    { id: 4, label: "Settings", icon: "⚙" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-4">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isCompleted = completedSteps.includes(step.id);
          return (
            <div key={step.id} className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="relative">
                  <div className="w-14 h-14">
                    <StepSphere step={step.id} isActive={isActive} isCompleted={isCompleted} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white pointer-events-none">
                    {step.id}
                  </div>
                </div>
                <div className="mt-2 text-center text-xs font-medium text-slate-300">{step.label}</div>
              </motion.div>

              {idx < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.35 }}
                  className="h-1 w-12 origin-left rounded-full bg-gradient-to-r from-cyan-400 to-green-400"
                />
              )}
            </div>
          );
        })}
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: (currentStep - 1) / 3 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mt-6 h-2 w-full origin-left rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
      />
    </div>
  );
}
