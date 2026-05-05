import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Upload, Sparkles, MonitorCog } from "lucide-react";
import { useAppearance } from "../../context/AppearanceContext";

const themeOptions = [
  {
    key: "light",
    label: "Light",
    description: "Bright surfaces and soft shadows.",
    preview: "from-white via-slate-50 to-cyan-50",
    border: "from-cyan-400/55 to-sky-300/30",
  },
  {
    key: "dark",
    label: "Dark",
    description: "High contrast and cinematic depth.",
    preview: "from-slate-950 via-slate-900 to-slate-800",
    border: "from-fuchsia-400/55 to-cyan-300/25",
  },
  {
    key: "auto",
    label: "Auto",
    description: "Matches the system preference.",
    preview: "from-slate-100 via-white to-slate-900",
    border: "from-amber-300/55 to-cyan-400/30",
  },
];

function Toggle3D({ label, checked, onChange, accent }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/7"
    >
      <span className="text-sm font-medium text-white">{label}</span>
      <span
        className={`relative h-8 w-14 rounded-full border border-white/10 p-1 transition-all duration-300 ${
          checked ? "bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" : "bg-slate-950/60"
        }`}
        style={{ boxShadow: checked ? `0 0 24px ${accent}55` : "inset 0 0 0 1px rgba(255,255,255,0.04)" }}
      >
        <motion.span
          layout
          className="block h-6 w-6 rounded-full border border-white/15 bg-gradient-to-br from-white to-slate-200 shadow-lg"
          style={{ transform: "perspective(800px) rotateX(20deg)" }}
          animate={{ x: checked ? 24 : 0, boxShadow: checked ? `0 0 18px ${accent}88` : "0 6px 18px rgba(0,0,0,0.35)" }}
          transition={{ type: "spring", stiffness: 500, damping: 34 }}
        />
      </span>
    </button>
  );
}

function ThemeCard({ option, active, onClick, accent }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-3 text-left transition hover:border-white/20"
    >
      {active ? (
        <motion.div
          layoutId="theme-card-glow"
          className={`absolute inset-0 rounded-[1.5rem] bg-gradient-to-br ${option.border} opacity-85 blur-[1px]`}
        />
      ) : null}

      <div className={`relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-gradient-to-br ${option.preview} p-4`}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.75)]" />
            <span className={`h-3 w-3 rounded-full ${active ? "bg-white/80" : "bg-black/10"}`} />
          </div>
          <span className="rounded-full bg-black/10 px-2 py-1 text-[10px] font-semibold text-slate-700">Preview</span>
        </div>

        <div className="space-y-2">
          <div className="h-2 w-2/3 rounded-full bg-black/20" />
          <div className="h-2 w-1/2 rounded-full bg-black/10" />
          <div className="mt-4 flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-2 w-3/4 rounded-full bg-black/20" />
              <div className="h-2 w-1/3 rounded-full bg-black/10" />
            </div>
          </div>
        </div>

        {active ? (
          <div
            className="absolute inset-0 rounded-[1.25rem] border-2"
            style={{
              borderColor: accent,
              boxShadow: `0 0 0 1px ${accent}55, 0 0 28px ${accent}55, inset 0 0 28px ${accent}20`,
              transform: "perspective(1000px) rotateX(11deg)",
            }}
          />
        ) : null}
      </div>

      <div className="relative mt-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">{option.label}</h3>
            <p className="mt-1 text-xs text-slate-400">{option.description}</p>
          </div>
          <span className={`rounded-full px-2 py-1 text-[10px] font-semibold transition ${active ? "bg-cyan-400/15 text-cyan-100" : "bg-white/5 text-slate-400"}`}>
            {active ? "Selected" : "Select"}
          </span>
        </div>
      </div>
    </button>
  );
}

function PreviewPanel({ settings }) {
  const resolvedTheme = settings.theme === "auto" ? "dark" : settings.theme;
  const isDark = resolvedTheme === "dark";
  const base = isDark ? "from-slate-950 via-slate-900 to-slate-800" : "from-white via-slate-50 to-cyan-50";
  const cardBg = isDark ? "bg-white/6 border-white/10 text-white" : "bg-white/80 border-slate-200 text-slate-900";

  const fontSize = useMemo(() => {
    const scale = settings.fontSize / 100;
    return {
      fontSize: `${scale * 16}px`,
      lineHeight: scale > 1 ? 1.8 : 1.6,
    };
  }, [settings.fontSize]);

  return (
    <div className={`rounded-[1.75rem] border p-5 ${isDark ? "border-white/10 bg-slate-950/50" : "border-slate-200 bg-white/70"}`}>
      <div className={`rounded-[1.5rem] border p-5 shadow-2xl ${cardBg}`} style={fontSize}>
        <div className={`rounded-[1.25rem] bg-gradient-to-br ${base} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs uppercase tracking-[0.3em] ${isDark ? "text-cyan-300/80" : "text-cyan-700/80"}`}>Live preview</p>
              <h4 className="mt-2 text-lg font-semibold">Deknek3D interface</h4>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{settings.theme}</span>
          </div>

          <div className="mt-5 grid gap-3 2xl:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-md">
              <p className="text-sm font-semibold">Accent</p>
              <div className="mt-3 h-14 rounded-2xl" style={{ background: `linear-gradient(135deg, ${settings.accent}, rgba(255,255,255,0.05))`, boxShadow: `0 0 24px ${settings.accent}44` }} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-md">
              <p className="text-sm font-semibold">Typography</p>
              <p className="mt-3 text-sm" style={fontSize}>
                The quick brown fox jumps over the lazy dog. Your chosen font size updates this text in real time.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 2xl:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-xs backdrop-blur-md">
              <div className="font-semibold">Reduced motion</div>
              <div className="mt-1 text-slate-400">{settings.reducedMotion ? "Enabled" : "Disabled"}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-xs backdrop-blur-md">
              <div className="font-semibold">Animations</div>
              <div className="mt-1 text-slate-400">{settings.animations ? "Enabled" : "Disabled"}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-xs backdrop-blur-md">
              <div className="font-semibold">Particles</div>
              <div className="mt-1 text-slate-400">{settings.particles ? "Enabled" : "Disabled"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppearancePanel() {
  const { settings, updateSettings } = useAppearance();
  const fileRef = useRef(null);

  const update = (patch) => updateSettings(patch);

  const exportTheme = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "deknek3d-theme.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      update({
        theme: parsed.theme ?? settings.theme,
        accent: parsed.accent ?? settings.accent,
        reducedMotion: Boolean(parsed.reducedMotion ?? settings.reducedMotion),
        animations: Boolean(parsed.animations ?? settings.animations),
        particles: Boolean(parsed.particles ?? settings.particles),
        fontSize: Number(parsed.fontSize ?? settings.fontSize),
      });
    } catch {
      // ignore invalid JSON; keep current settings
    } finally {
      event.target.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28 }}
      className="space-y-6"
    >
      <div className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 shadow-2xl shadow-black/20 backdrop-blur-glass">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/75">Theme switcher</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Choose your interface theme</h3>
              </div>
              <MonitorCog className="h-5 w-5 text-cyan-300" />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {themeOptions.map((option) => (
                <ThemeCard
                  key={option.key}
                  option={option}
                  active={settings.theme === option.key}
                  accent={settings.accent}
                  onClick={() => update({ theme: option.key })}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 shadow-2xl shadow-black/20 backdrop-blur-glass">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/75">Accent color</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Custom brand color</h3>
              <div className="mt-5 flex items-center gap-4">
                <input
                  type="color"
                  value={settings.accent}
                  onChange={(event) => update({ accent: event.target.value })}
                  className="h-16 w-20 cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-1"
                />
                <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-medium text-white">Accent preview</div>
                  <div className="mt-3 h-3 rounded-full" style={{ background: settings.accent, boxShadow: `0 0 18px ${settings.accent}88` }} />
                  <div className="mt-2 text-xs text-slate-400">{settings.accent.toUpperCase()}</div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 shadow-2xl shadow-black/20 backdrop-blur-glass">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/75">Interface controls</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Performance and motion</h3>
              <div className="mt-5 space-y-3">
                <Toggle3D label="Reduced motion" checked={settings.reducedMotion} onChange={(value) => update({ reducedMotion: value })} accent={settings.accent} />
                <Toggle3D label="Animations" checked={settings.animations} onChange={(value) => update({ animations: value })} accent={settings.accent} />
                <Toggle3D label="Particle effects" checked={settings.particles} onChange={(value) => update({ particles: value })} accent={settings.accent} />
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 shadow-2xl shadow-black/20 backdrop-blur-glass">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/75">Text size</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Font size slider</h3>
            <div className="mt-5">
              <input
                type="range"
                min="90"
                max="120"
                step="1"
                value={settings.fontSize}
                onChange={(event) => update({ fontSize: Number(event.target.value) })}
                className="w-full accent-cyan-400"
              />
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200" style={{ fontSize: `${settings.fontSize}%` }}>
                Live preview text scales with your chosen size. This should feel comfortable across long sessions.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 shadow-2xl shadow-black/20 backdrop-blur-glass">
            <button
              type="button"
              onClick={exportTheme}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              <Download className="h-4 w-4" /> Export theme
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Upload className="h-4 w-4" /> Import theme
            </button>
            <input ref={fileRef} type="file" accept="application/json" onChange={importTheme} className="hidden" />
            <p className="text-xs text-slate-400">Save or restore the current appearance preset as JSON.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 shadow-2xl shadow-black/20 backdrop-blur-glass">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/75">Realtime preview</p>
            </div>
            <div className="mt-4">
              <PreviewPanel settings={settings} />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            <h4 className="text-base font-semibold text-white">Current theme JSON</h4>
            <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-xs leading-6 text-slate-200">
{JSON.stringify(settings, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
