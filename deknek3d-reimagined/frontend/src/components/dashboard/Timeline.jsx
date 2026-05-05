import React from "react";

export default function Timeline() {
  return (
    <section className="rounded-2xl border border-white/5 bg-white/2 p-4 text-sm text-slate-200">
      Activity timeline placeholder — rebuilding safe component.
    </section>
  );
}
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { motion, useInView } from "framer-motion";

function RotatingIcon({ type = "upload", hovered }) {
  switch (type) {
    case "upload":
      return (
        <mesh>
          <boxGeometry args={[0.6, 0.4, 0.3]} />
          <meshStandardMaterial color="#7dd3fc" metalness={0.5} roughness={0.2} />
        </mesh>
      );
    case "like":
      return (
        <mesh>
          <torusGeometry args={[0.35, 0.12, 16, 60]} />
          <meshStandardMaterial color="#fb7185" metalness={0.2} roughness={0.25} />
        </mesh>
      );
    case "comment":
      return (
        <mesh>
          <coneGeometry args={[0.35, 0.6, 24]} />
          <meshStandardMaterial color="#c7b2ff" metalness={0.2} roughness={0.2} />
        </mesh>
      );
    case "follow":
      return (
        <mesh>
          <torusKnotGeometry args={[0.28, 0.08, 64, 8]} />
          <meshStandardMaterial color="#93c5fd" metalness={0.3} roughness={0.25} />
        </mesh>
      );
    default:
      return (
        <mesh>
          <icosahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#a855f7" metalness={0.35} roughness={0.24} />
        </mesh>
      );
  }
}

function RotatingGroup({ type, hovered, onHoverChange }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += (hovered ? 1 : 0.25) * delta;
    ref.current.rotation.x += (hovered ? 0.5 : 0.12) * delta;
  });

  return (
    <Float rotationIntensity={0.6} floatIntensity={0.6}>
      <group 
        ref={ref} 
        onPointerOver={() => onHoverChange(true)} 
        onPointerOut={() => onHoverChange(false)}
      >
        <RotatingIcon type={type} hovered={hovered} />
      </group>
    </Float>
  );
}

function IconCanvas({ type }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Canvas style={{ width: 64, height: 64 }} camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 2, 5]} intensity={0.6} />
      <RotatingGroup type={type} hovered={hovered} onHoverChange={setHovered} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  );
}

const sampleActivity = (id) => {
  const types = ["upload", "like", "comment", "follow"];
  const t = types[id % types.length];
  const labels = {
    upload: "Uploaded model",
    like: "Model liked",
    comment: "Comment received",
    follow: "New follower",
  };
  return {
    id: `act_${Date.now()}_${id}`,
    type: t,
    title: labels[t],
    desc: t === "upload" ? "Uploaded ‘Nebula Chair’" : t === "like" ? "Alex liked your model" : t === "comment" ? "New comment: ‘Love the topology!’" : "Samantha started following you",
    time: new Date(Date.now() - id * 1000 * 60 * 15).toISOString(),
  };
};

export default function Timeline() {
  const containerRef = useRef(null);
  const loadRef = useRef(null);
  const inView = useInView(containerRef, { margin: "-40% 0px -40% 0px", amount: 0.1 });
  const loadInView = useInView(loadRef, { margin: "0px", amount: 0 });

  const [items, setItems] = useState(() => Array.from({ length: 6 }).map((_, i) => sampleActivity(i)));
  const [loading, setLoading] = useState(false);

  // animate connecting line progress by number of visible items
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (loadInView && !loading) {
      setLoading(true);
      // simulate async load
      setTimeout(() => {
        setItems((prev) => [...prev, ...Array.from({ length: 4 }).map((_, i) => sampleActivity(prev.length + i))]);
        setLoading(false);
      }, 900);
    }
  }, [loadInView]);

  const itemRefs = useRef(new Map());

  useEffect(() => {
    // observe each item for in-view to set visibleCount
    const obs = new IntersectionObserver((entries) => {
      let count = 0;
      entries.forEach((e) => {
        if (e.isIntersecting) count += 1;
      });
      // compute visible items by checking map
      const visible = Array.from(itemRefs.current.values()).filter((el) => el && el.getAttribute && el.getAttribute("data-inview") === "true").length;
      setVisibleCount(visible || count);
    }, { root: null, threshold: 0.2 });

    // attach
    itemRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  const setItemRef = useCallback((el, id) => {
    if (!el) return;
    itemRefs.current.set(id, el);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        el.setAttribute("data-inview", entry.isIntersecting ? "true" : "false");
      });
    }, { threshold: 0.3 });
    io.observe(el);
  }, []);

  return (
    <motion.section
      ref={containerRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="rounded-3xl border border-white/10 bg-slate-950/40 p-5"
    >
      <h2 className="text-xl font-semibold text-white">Activity Timeline</h2>
      <p className="mt-2 text-sm text-slate-300">A live feed of your recent activity.</p>

      <div className="relative mt-6 flex gap-6">
        {/* vertical line */}
        <div className="relative w-8 flex-shrink-0 flex flex-col items-center">
          <svg className="h-full" width="4" style={{ overflow: "visible" }}>
            <line x1="2" y1="0" x2="2" y2="1000" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            <motion.line
              x1="2"
              x2="2"
              y1="0"
              y2="1000"
              stroke="#06b6d4"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: Math.min(1, items.length ? visibleCount / items.length : 0) }}
              transition={{ duration: 0.6 }}
            />
          </svg>
        </div>

        <div className="flex-1">
          <div className="space-y-6">
            {items.map((it) => (
              <motion.div
                key={it.id}
                ref={(el) => setItemRef(el, it.id)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45 }}
                className="relative flex items-center gap-4 rounded-2xl border border-white/5 bg-white/3 px-4 py-3"
              >
                <div className="-ml-2 z-10 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white/3">
                  <IconCanvas type={it.type === "follow" ? "follow" : it.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-white">{it.title}</div>
                      <div className="mt-1 text-xs text-slate-300 truncate">{it.desc}</div>
                    </div>
                    <div className="text-xs text-slate-400">{new Date(it.time).toLocaleString()}</div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div ref={loadRef} className="flex items-center justify-center">
              {loading ? (
                <div className="py-4 text-sm text-slate-300">Loading more…</div>
              ) : (
                <button
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      setItems((prev) => [...prev, ...Array.from({ length: 3 }).map((_, i) => sampleActivity(prev.length + i))]);
                      setLoading(false);
                    }, 700);
                  }}
                  className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                >
                  Load more
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { motion, useInView } from "framer-motion";

function RotatingIcon({ type = "upload", hovered }) {
  // simple primitives per activity type
  if (type === "upload") return (
    <mesh>
      <boxBufferGeometry args={[0.6, 0.4, 0.3]} />
      <meshStandardMaterial color="#7dd3fc" metalness={0.5} roughness={0.2} />
      <mesh>
      <boxGeometry args={[0.6, 0.4, 0.3]} />
      <meshStandardMaterial color={color} metalness={0.4} roughness={0.22} />
    </mesh>
      <torusBufferGeometry args={[0.35, 0.12, 16, 60]} />
      <meshStandardMaterial color="#fb7185" metalness={0.2} roughness={0.25} />
      <mesh>
      <torusGeometry args={[0.35, 0.12, 16, 60]} />
      <meshStandardMaterial color={color} metalness={0.4} roughness={0.22} />
    </mesh>
      <coneBufferGeometry args={[0.35, 0.6, 24]} />
      <meshStandardMaterial color="#c7b2ff" metalness={0.2} roughness={0.2} />
      <mesh>
      <coneGeometry args={[0.35, 0.6, 24]} />
      <meshStandardMaterial color={color} metalness={0.4} roughness={0.22} />
    </mesh>
    <mesh>
      <torusKnotBufferGeometry args={[0.28, 0.08, 64, 8]} />
      <meshStandardMaterial color="#93c5fd" metalness={0.3} roughness={0.25} />
      <mesh>
      <torusKnotGeometry args={[0.28, 0.08, 64, 8]} />
      <meshStandardMaterial color={color} metalness={0.4} roughness={0.22} />
    </mesh>
function RotatingGroup({ type, hovered, onHoverChange }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += (hovered ? 1 : 0.25) * delta;
    ref.current.rotation.x += (hovered ? 0.5 : 0.12) * delta;
  });

  return (
    <Float rotationIntensity={0.6} floatIntensity={0.6}>
      <group 
        ref={ref} 
        onPointerOver={() => onHoverChange(true)} 
        onPointerOut={() => onHoverChange(false)}
      >
        <RotatingIcon type={type} hovered={hovered} />
      </group>
    </Float>
  );
}

function IconCanvas({ type }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Canvas style={{ width: 64, height: 64 }} camera={{ position: [0, 0, 3] }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 2, 5]} intensity={0.6} />
      <RotatingGroup type={type} hovered={hovered} onHoverChange={setHovered} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  );
}

const sampleActivity = (id) => {
  const types = ["upload", "like", "comment", "follow"];
  const t = types[id % types.length];
  const labels = {
    upload: "Uploaded model",
    like: "Model liked",
    comment: "Comment received",
    follow: "New follower",
  };
  return {
    id: `act_${Date.now()}_${id}`,
    type: t,
    title: labels[t],
    desc: t === "upload" ? "Uploaded ‘Nebula Chair’" : t === "like" ? "Alex liked your model" : t === "comment" ? "New comment: ‘Love the topology!’" : "Samantha started following you",
    time: new Date(Date.now() - id * 1000 * 60 * 15).toISOString(),
  };
};

export default function Timeline() {
  const containerRef = useRef(null);
  const loadRef = useRef(null);
  const inView = useInView(containerRef, { margin: "-40% 0px -40% 0px", amount: 0.1 });
  const loadInView = useInView(loadRef, { margin: "0px", amount: 0 });

  const [items, setItems] = useState(() => Array.from({ length: 6 }).map((_, i) => sampleActivity(i)));
  const [loading, setLoading] = useState(false);

  // animate connecting line progress by number of visible items
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (loadInView && !loading) {
      setLoading(true);
      // simulate async load
      setTimeout(() => {
        setItems((prev) => [...prev, ...Array.from({ length: 4 }).map((_, i) => sampleActivity(prev.length + i))]);
        setLoading(false);
      }, 900);
    }
  }, [loadInView]);

  const itemRefs = useRef(new Map());

  useEffect(() => {
    // observe each item for in-view to set visibleCount
    const obs = new IntersectionObserver((entries) => {
      let count = 0;
      entries.forEach((e) => {
        if (e.isIntersecting) count += 1;
      });
      // compute visible items by checking map
      const visible = Array.from(itemRefs.current.values()).filter((el) => el && el.getAttribute && el.getAttribute("data-inview") === "true").length;
      setVisibleCount(visible || count);
    }, { root: null, threshold: 0.2 });

    // attach
    itemRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  const setItemRef = useCallback((el, id) => {
    if (!el) return;
    itemRefs.current.set(id, el);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        el.setAttribute("data-inview", entry.isIntersecting ? "true" : "false");
      });
    }, { threshold: 0.3 });
    io.observe(el);
  }, []);

  return (
    <motion.section
      ref={containerRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="rounded-3xl border border-white/10 bg-slate-950/40 p-5"
    >
      <h2 className="text-xl font-semibold text-white">Activity Timeline</h2>
      <p className="mt-2 text-sm text-slate-300">A live feed of your recent activity.</p>

      <div className="relative mt-6 flex gap-6">
        {/* vertical line */}
        <div className="relative w-8 flex-shrink-0 flex flex-col items-center">
          <svg className="h-full" width="4" style={{ overflow: "visible" }}>
            <line x1="2" y1="0" x2="2" y2="1000" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            <motion.line
              x1="2"
              x2="2"
              y1="0"
              y2="1000"
              stroke="#06b6d4"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: Math.min(1, items.length ? visibleCount / items.length : 0) }}
              transition={{ duration: 0.6 }}
            />
          </svg>
        </div>

        <div className="flex-1">
          <div className="space-y-6">
            {items.map((it) => (
              <motion.div
                key={it.id}
                ref={(el) => setItemRef(el, it.id)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45 }}
                className="relative flex items-center gap-4 rounded-2xl border border-white/5 bg-white/3 px-4 py-3"
              >
                <div className="-ml-2 z-10 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white/3">
                  <IconCanvas type={it.type === "follow" ? "follow" : it.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-white">{it.title}</div>
                      <div className="mt-1 text-xs text-slate-300 truncate">{it.desc}</div>
                    </div>
                    <div className="text-xs text-slate-400">{new Date(it.time).toLocaleString()}</div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div ref={loadRef} className="flex items-center justify-center">
              {loading ? (
                <div className="py-4 text-sm text-slate-300">Loading more…</div>
              ) : (
                <button
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      setItems((prev) => [...prev, ...Array.from({ length: 3 }).map((_, i) => sampleActivity(prev.length + i))]);
                      setLoading(false);
                    }, 700);
                  }}
                  className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                >
                  Load more
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
