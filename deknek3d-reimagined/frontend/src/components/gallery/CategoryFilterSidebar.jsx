import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";

const CATEGORIES = [
  { id: "characters", label: "Characters", count: 342, color: "#06b6d4" },
  { id: "vehicles", label: "Vehicles", count: 218, color: "#a78bfa" },
  { id: "architecture", label: "Architecture", count: 156, color: "#fb923c" },
  { id: "nature", label: "Nature", count: 289, color: "#10b981" },
  { id: "furniture", label: "Furniture", count: 401, color: "#f472b6" },
  { id: "abstract", label: "Abstract", count: 195, color: "#fbbf24" },
];

function Category3DContent({ ref, color, type, geometry }) {
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += 1.2 * delta;
    ref.current.rotation.x += 0.3 * delta;
  });

  return (
    <Float floatIntensity={0.4} rotationIntensity={0.3}>
      <group ref={ref}>
        <mesh>
          {geometry}
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

function Category3DIcon({ color = "#06b6d4", type = "characters" }) {
  const ref = useRef();

  let geometry;
  if (type === "characters") {
    geometry = <sphereGeometry args={[0.6, 32, 32]} />;
  } else if (type === "vehicles") {
    geometry = <boxGeometry args={[0.8, 0.4, 1]} />;
  } else if (type === "architecture") {
    geometry = <coneGeometry args={[0.6, 0.9, 16]} />;
  } else if (type === "nature") {
    geometry = <torusKnotGeometry args={[0.35, 0.1, 64, 8]} />;
  } else if (type === "furniture") {
    geometry = <boxGeometry args={[0.7, 0.6, 0.7]} />;
  } else {
    geometry = <octahedronGeometry args={[0.6, 0]} />;
  }

  return (
    <Canvas style={{ width: 32, height: 32 }} camera={{ position: [0, 0, 2.5] }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 2, 3]} intensity={0.6} />
      <Category3DContent ref={ref} color={color} type={type} geometry={geometry} />
    </Canvas>
  );
}

function AnimatedCheckbox({ checked, onChange }) {
  return (
    <motion.button
      onClick={onChange}
      className={`relative h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
        checked ? "border-cyan-400 bg-cyan-400" : "border-white/20 bg-white/3"
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence>
        {checked && (
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <path d="M20 6L9 17l-5-5" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function CategoryFilterSidebar({ onFilterChange }) {
  const [expanded, setExpanded] = useState(CATEGORIES.reduce((a, c) => ({ ...a, [c.id]: true }), {}));
  const [selected, setSelected] = useState(new Set());

  const toggleCategory = useCallback((id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleFilter = useCallback(
    (id) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        if (onFilterChange) onFilterChange(Array.from(next));
        return next;
      });
    },
    [onFilterChange]
  );

  const clearAll = useCallback(() => {
    setSelected(new Set());
    if (onFilterChange) onFilterChange([]);
  }, [onFilterChange]);

  const selectedLabels = CATEGORIES.filter((c) => selected.has(c.id));

  return (
    <motion.aside
      initial={{ x: -320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="w-80 flex-shrink-0 rounded-2xl border border-white/8 bg-slate-950/40 p-5"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Filters</h3>

        <div className="mt-4 flex flex-wrap gap-2">
          <AnimatePresence>
            {selectedLabels.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-sm text-slate-200"
              >
                <span>{cat.label}</span>
                <button
                  onClick={() => toggleFilter(cat.id)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {selected.size > 0 && (
          <motion.button
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onClick={clearAll}
            className="mt-3 text-xs text-slate-400 hover:text-slate-200"
          >
            Clear all
          </motion.button>
        )}
      </div>

      <div className="space-y-3">
        {CATEGORIES.map((cat) => (
          <div key={cat.id}>
            <motion.button
              onClick={() => toggleCategory(cat.id)}
              className="flex w-full items-center justify-between gap-3 rounded-lg bg-white/3 px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded flex items-center justify-center bg-white/5">
                  <Category3DIcon color={cat.color} type={cat.id} />
                </div>
                <span className="text-sm font-medium">{cat.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">
                  {cat.count}
                </span>
                <motion.div
                  animate={{ rotate: expanded[cat.id] ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </motion.div>
              </div>
            </motion.button>

            <AnimatePresence>
              {expanded[cat.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-2 pl-3">
                    <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer hover:text-slate-200">
                      <AnimatedCheckbox
                        checked={selected.has(cat.id)}
                        onChange={() => toggleFilter(cat.id)}
                      />
                      <span>All {cat.label}</span>
                    </label>

                    {[...Array(2)].map((_, i) => (
                      <label
                        key={`${cat.id}_${i}`}
                        className="flex items-center gap-3 text-xs text-slate-400 cursor-pointer hover:text-slate-300"
                      >
                        <AnimatedCheckbox checked={false} onChange={() => {}} />
                        <span>
                          {cat.label} {i + 1}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.aside>
  );
}
