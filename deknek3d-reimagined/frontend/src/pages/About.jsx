import React from "react";
import { motion } from "framer-motion";
import ParticleBackground from "../components/shared/ParticleBackground";

const highlights = [
  {
    title: "Built for 3D creators",
    text: "Immersive previews, model management, and polished presentation tools live in one place.",
  },
  {
    title: "Designed to feel alive",
    text: "Motion, lighting, and layered depth give every page a more tactile studio feel.",
  },
  {
    title: "Fast enough to browse",
    text: "The experience favors responsive layouts and lightweight interactions over heavy UI clutter.",
  },
];

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <ParticleBackground overlay density="low" colorStart="#22d3ee" colorEnd="#a855f7" spread={24} particleSize={0.018} mouseInfluence={0.2} floatStrength={0.04} driftSpeed={0.7} rotationSpeed={0.5} glow={false} className="opacity-30" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-glass md:p-10"
        >
          <p className="text-xs uppercase tracking-[0.42em] text-cyan-300/80">About Deknek3D</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">A creative studio for immersive 3D publishing.</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            Deknek3D Reimagined brings together model galleries, profile tools, viewer experiences, and studio settings in a single interface.
            The goal is simple: make publishing and exploring 3D assets feel premium, clear, and fast.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
