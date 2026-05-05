import { Canvas, useFrame } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Heart, LayoutGrid, List, Pencil, Search, SlidersHorizontal, Trash2, Layers3 } from "lucide-react";
import { useMemo, useRef, useState } from "react";

function RotatingShape({ type = "box", accent = "#22d3ee" }) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.55;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.18;
  });

  const shapes = {
    sphere: <sphereGeometry args={[0.75, 40, 40]} />,
    cone: <coneGeometry args={[0.62, 1.25, 20]} />,
    torus: <torusGeometry args={[0.55, 0.2, 16, 48]} />,
    box: <boxGeometry args={[0.95, 0.7, 0.65]} />,
  };

  return (
    <group ref={ref}>
      <mesh>
        {shapes[type] ?? shapes.box}
        <meshStandardMaterial color={accent} metalness={0.55} roughness={0.2} />
      </mesh>
    </group>
  );
}

function PreviewShape({ type = "box", accent = "#22d3ee" }) {
  return (
    <RotatingShape type={type} accent={accent} />
  );
}

function ModelPreview({ model }) {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 40 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 2, 4]} intensity={0.9} />
      <PreviewShape type={model.shape} accent={model.accent} />
    </Canvas>
  );
}

function ModelCard({ model, isOwner, layoutMode }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className={`group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/15 transition-all duration-300 hover:border-cyan-300/30 hover:bg-white/[0.055] ${
        layoutMode === "list" ? "flex gap-4 p-4" : "p-4"
      }`}
    >
      <div className={`relative ${layoutMode === "list" ? "h-36 w-56 flex-shrink-0" : model.heightClass ?? "h-56"} overflow-hidden rounded-[1.35rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),rgba(15,23,42,0.15)_55%),linear-gradient(135deg,rgba(15,23,42,0.88),rgba(2,6,23,0.94))]`}>
        <ModelPreview model={model} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 flex items-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="m-4 w-full rounded-2xl border border-white/10 bg-slate-950/45 p-3 text-xs text-slate-200 shadow-2xl shadow-black/25 backdrop-blur-md">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="font-semibold text-white">{model.views.toLocaleString()}</div>
                <div className="text-slate-400">Views</div>
              </div>
              <div>
                <div className="font-semibold text-white">{model.likes.toLocaleString()}</div>
                <div className="text-slate-400">Likes</div>
              </div>
              <div>
                <div className="font-semibold text-white">{model.updated}</div>
                <div className="text-slate-400">Updated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${layoutMode === "list" ? "min-w-0 flex-1" : "mt-4"}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white transition-colors duration-300 group-hover:text-cyan-100">{model.title}</h3>
            <p className="mt-1 text-xs text-slate-400 transition-colors duration-300 group-hover:text-slate-300">{model.category} · {model.visibility}</p>
          </div>
          <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${model.status === "Draft" ? "bg-amber-500/15 text-amber-200" : model.status === "Private" ? "bg-slate-500/20 text-slate-200" : "bg-cyan-400/15 text-cyan-200"}`}>
            {model.status}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Eye className="h-3.5 w-3.5" />
            <span>{model.views.toLocaleString()} views</span>
            <span className="text-slate-600">·</span>
            <Heart className="h-3.5 w-3.5 text-pink-400" />
            <span>{model.likes.toLocaleString()}</span>
          </div>

          {isOwner ? (
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button type="button" className="inline-flex items-center gap-1 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-500/15">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-16 text-center"
    >
      <div className="h-36 w-36">
        <Canvas camera={{ position: [0, 0, 3], fov: 42 }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[2, 2, 3]} intensity={1} />
          <PreviewShape type="torus" accent="#67e8f9" />
        </Canvas>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">No models match this view</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">Try a different filter or clear sorting to bring your uploads back into view.</p>
    </motion.div>
  );
}

const VISIBILITY_FILTERS = ["All", "Public", "Private", "Draft"];
const SORT_OPTIONS = ["Recent", "Most Viewed", "Most Liked"];

const seedModels = [
  { id: "m1", title: "Nebula Chair", category: "Furniture", visibility: "Public", status: "Published", views: 14820, likes: 3420, updated: "2d", type: "box", shape: "box", accent: "#22d3ee", size: "tall", createdAt: 1746200000000 },
  { id: "m2", title: "Pulse Drone", category: "Hard Surface", visibility: "Draft", status: "Draft", views: 3220, likes: 920, updated: "6h", type: "sphere", shape: "sphere", accent: "#a855f7", size: "medium", createdAt: 1746400000000 },
  { id: "m3", title: "Horizon Lamp", category: "Interior Prop", visibility: "Private", status: "Private", views: 8140, likes: 1840, updated: "1w", type: "cone", shape: "cone", accent: "#38bdf8", size: "small", createdAt: 1746120000000 },
  { id: "m4", title: "Orbital Helmet", category: "Character Gear", visibility: "Public", status: "Published", views: 22340, likes: 6810, updated: "3d", type: "torus", shape: "torus", accent: "#fb7185", size: "large", createdAt: 1746350000000 },
  { id: "m5", title: "Arc Console", category: "Sci-fi Prop", visibility: "Public", status: "Published", views: 10990, likes: 2710, updated: "5d", type: "box", shape: "box", accent: "#67e8f9", size: "medium", createdAt: 1746270000000 },
  { id: "m6", title: "Prism Runner", category: "Vehicle", visibility: "Draft", status: "Draft", views: 1820, likes: 450, updated: "12h", type: "sphere", shape: "sphere", accent: "#c084fc", size: "large", createdAt: 1746420000000 },
];

export default function ProfileModelsGrid({ isOwner = true }) {
  const [visibility, setVisibility] = useState("All");
  const [sortBy, setSortBy] = useState("Recent");
  const [viewMode, setViewMode] = useState("grid");
  const [query, setQuery] = useState("");

  const models = useMemo(() => {
    let next = seedModels.filter((model) => {
      const matchesVisibility = visibility === "All" || model.visibility === visibility;
      const matchesQuery = !query || `${model.title} ${model.category}`.toLowerCase().includes(query.toLowerCase());
      return matchesVisibility && matchesQuery;
    });

    next = [...next].sort((a, b) => {
      if (sortBy === "Most Viewed") return b.views - a.views;
      if (sortBy === "Most Liked") return b.likes - a.likes;
      return b.createdAt - a.createdAt;
    });

    return next;
  }, [visibility, sortBy, query]);

  const columnsClass = viewMode === "grid"
    ? "columns-1 gap-4 sm:columns-2 xl:columns-3"
    : "flex flex-col gap-4";

  return (
    <section className="space-y-5 rounded-[2rem] border border-white/10 bg-slate-950/40 p-5 shadow-2xl shadow-black/20 backdrop-blur-glass">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/75">Uploaded models</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Your model library</h2>
          <p className="mt-1 text-sm text-slate-400">Filter, sort, and manage the assets published on your profile.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
            <button type="button" onClick={() => setViewMode("grid")} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${viewMode === "grid" ? "bg-cyan-400/15 text-cyan-100" : "text-slate-300 hover:text-white"}`}>
              <LayoutGrid className="h-4 w-4" /> Grid
            </button>
            <button type="button" onClick={() => setViewMode("list")} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${viewMode === "list" ? "bg-cyan-400/15 text-cyan-100" : "text-slate-300 hover:text-white"}`}>
              <List className="h-4 w-4" /> List
            </button>
          </div>

          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search uploads"
              className="w-44 bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {VISIBILITY_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setVisibility(filter)}
              className={`rounded-full px-4 py-2 text-sm transition ${visibility === filter ? "bg-cyan-400 text-slate-950 shadow-[0_0_22px_rgba(34,211,238,0.25)]" : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
          <SlidersHorizontal className="ml-3 h-4 w-4 text-slate-400" />
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSortBy(option)}
              className={`rounded-xl px-3 py-2 text-sm transition ${sortBy === option ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {models.length === 0 ? (
          <motion.div key="empty">
            <EmptyState />
          </motion.div>
        ) : (
          <motion.div key={`${visibility}-${sortBy}-${viewMode}-${query}`} layout className={columnsClass}>
            {models.map((model) => (
              <div key={model.id} className={`mb-4 break-inside-avoid ${viewMode === "list" ? "w-full" : "inline-block w-full"}`}>
                <ModelCard model={model} isOwner={isOwner} layoutMode={viewMode} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-4 text-xs text-slate-400">
        <span>{models.length} models shown</span>
        <span>Layout animates on every filter, sort, and view change.</span>
      </div>
    </section>
  );
}
