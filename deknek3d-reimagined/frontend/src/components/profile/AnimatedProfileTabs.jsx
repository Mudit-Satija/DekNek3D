import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Boxes, Heart, Layers3, Sparkles, Clock3 } from "lucide-react";
import Timeline from "../dashboard/TimelineSafe";
import ProfileModelsGrid from "./ProfileModelsGrid";

function RotatingGlyph({ type, active }) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!ref.current) return;
    const speed = active ? 1.4 : 0.45;
    ref.current.rotation.x += delta * speed * 0.6;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * (active ? 2.2 : 1.2)) * (active ? 0.18 : 0.08);
  });

  const glyph = useMemo(() => {
    switch (type) {
      case "liked":
        return (
          <mesh>
            <torusKnotGeometry args={[0.38, 0.12, 72, 12]} />
            <meshStandardMaterial color={active ? "#fb7185" : "#fda4af"} metalness={0.65} roughness={0.18} />
          </mesh>
        );
      case "collections":
        return (
          <mesh>
            <icosahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial color={active ? "#c084fc" : "#d8b4fe"} metalness={0.5} roughness={0.22} />
          </mesh>
        );
      case "activity":
        return (
          <mesh>
            <octahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial color={active ? "#22d3ee" : "#67e8f9"} metalness={0.55} roughness={0.2} />
          </mesh>
        );
      default:
        return (
          <mesh>
            <boxGeometry args={[0.62, 0.46, 0.36]} />
            <meshStandardMaterial color={active ? "#38bdf8" : "#7dd3fc"} metalness={0.55} roughness={0.2} />
          </mesh>
        );
    }
  }, [active, type]);

  return (
    <Float speed={1.2} rotationIntensity={0.8} floatIntensity={0.6}>
      <group ref={ref}>{glyph}</group>
    </Float>
  );
}

function TabGlyph({ type, active }) {
  return (
    <Canvas camera={{ position: [0, 0, 2.6], fov: 42 }} style={{ width: 42, height: 42 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 2, 3]} intensity={0.7} />
      <RotatingGlyph type={type} active={active} />
    </Canvas>
  );
}

function TabButton({ tab, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex min-h-20 min-w-0 flex-1 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
        active
          ? "border-cyan-400/40 bg-white/10 text-white shadow-[0_16px_40px_rgba(8,145,178,0.18)]"
          : "border-white/8 bg-white/[0.03] text-slate-300 hover:border-cyan-300/30 hover:bg-white/7 hover:text-white"
      }`}
    >
      <div className={`rounded-2xl border p-1.5 transition-transform duration-300 ${active ? "border-cyan-300/40 bg-cyan-400/10 scale-105" : "border-white/8 bg-white/5 group-hover:scale-105"}`}>
        <TabGlyph type={tab.key} active={active} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold transition-colors duration-300">{tab.label}</span>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors duration-300 ${active ? "bg-cyan-400/15 text-cyan-200" : "bg-white/7 text-slate-300 group-hover:bg-white/10"}`}>
            {tab.count}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400 transition-colors duration-300 group-hover:text-slate-300">{tab.subtitle}</p>
      </div>

      {active ? (
        <motion.div
          layoutId="profile-tab-underline"
          className="absolute inset-x-4 -bottom-[1px] h-[5px] rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 shadow-[0_0_18px_rgba(34,211,238,0.55)]"
          style={{ transform: "perspective(900px) rotateX(42deg)" }}
          transition={{ type: "spring", stiffness: 500, damping: 42 }}
        />
      ) : null}
    </button>
  );
}

function TabPanelShell({ title, summary, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 shadow-2xl shadow-black/20 backdrop-blur-glass"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-300">{summary}</p>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

function ModelCard({ name, category, likes, status }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-300/20 hover:bg-white/[0.06]">
      <div className="aspect-[4/3] rounded-2xl bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.3),rgba(15,23,42,0.2)_60%),linear-gradient(135deg,rgba(30,41,59,0.85),rgba(15,23,42,0.95))] p-4 shadow-inner shadow-black/20">
        <div className="flex h-full items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-4xl font-black text-cyan-200/90">
          3D
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{name}</h3>
          <p className="mt-1 text-xs text-slate-400">{category}</p>
        </div>
        <span className="rounded-full bg-white/7 px-2 py-1 text-[11px] font-semibold text-slate-300">{status}</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>{likes.toLocaleString()} likes</span>
        <button type="button" className="text-cyan-300 transition hover:text-cyan-200">Open</button>
      </div>
    </div>
  );
}

export default function AnimatedProfileTabs() {
  const tabs = useMemo(
    () => [
      {
        key: "models",
        label: "Models",
        count: 24,
        subtitle: "Published assets and 3D experiments",
        icon: Boxes,
      },
      {
        key: "liked",
        label: "Liked",
        count: 138,
        subtitle: "Models saved from around the marketplace",
        icon: Heart,
      },
      {
        key: "collections",
        label: "Collections",
        count: 7,
        subtitle: "Curated sets for fast browsing",
        icon: Layers3,
      },
      {
        key: "activity",
        label: "Activity",
        count: 52,
        subtitle: "Recent uploads, follows, and comments",
        icon: Clock3,
      },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState(tabs[0].key);

  const activeMeta = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];

  const panels = {
    models: (
      <TabPanelShell title="Published models" summary="Your latest uploads and work in progress assets.">
        <ProfileModelsGrid isOwner />
      </TabPanelShell>
    ),
    liked: (
      <TabPanelShell title="Liked models" summary="Everything you bookmarked while browsing the marketplace.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ModelCard name="Orbital Helmet" category="Character gear" likes={5412} status="Saved" />
          <ModelCard name="Arc Console" category="Sci-fi prop" likes={2991} status="Saved" />
          <ModelCard name="Prism Runner" category="Vehicle" likes={6420} status="Saved" />
        </div>
      </TabPanelShell>
    ),
    collections: (
      <TabPanelShell title="Collections" summary="Quick access to themed groups of models and references.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ModelCard name="Studio favorites" category="12 models" likes={0} status="Private" />
          <ModelCard name="Client shortlist" category="9 models" likes={0} status="Shared" />
          <ModelCard name="Reference pack" category="18 models" likes={0} status="Public" />
        </div>
      </TabPanelShell>
    ),
    activity: (
      <TabPanelShell title="Activity feed" summary="A rolling log of uploads, likes, and community interactions.">
        <Timeline />
      </TabPanelShell>
    ),
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          return <TabButton key={tab.key} tab={tab} active={active} onClick={() => setActiveTab(tab.key)} />;
        })}
      </div>

      <div className="rounded-[1.9rem] border border-white/8 bg-gradient-to-b from-white/[0.03] to-transparent p-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {panels[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 px-2 text-xs text-slate-400">
        <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
        <span>Currently viewing {activeMeta.label.toLowerCase()}.</span>
      </div>
    </div>
  );
}
