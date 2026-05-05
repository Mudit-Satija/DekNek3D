import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserRound, Lock, ShieldCheck, Bell, Sun, CreditCard, Menu } from "lucide-react";

const sections = [
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "account", label: "Account", icon: Lock },
  { key: "privacy", label: "Privacy", icon: ShieldCheck },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "appearance", label: "Appearance", icon: Sun },
  { key: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingsSidebar({ active, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <h3 className="text-sm font-semibold text-white">Settings</h3>
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      <div className="hidden lg:block">
        <nav className="space-y-2">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = active === s.key;
            return (
              <div key={s.key} className="relative">
                {isActive ? (
                  <motion.div
                    layoutId="settings-active-bg"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/12 shadow-lg"
                    style={{ zIndex: 0 }}
                  />
                ) : null}

                <button
                  onClick={() => onChange(s.key)}
                  className={`relative z-10 flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "text-white" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <Icon className="h-5 w-5 text-cyan-300" />
                  </div>
                  <span>{s.label}</span>

                  {isActive ? (
                    <motion.div
                      layoutId="settings-indicator"
                      className="absolute bottom-2 left-1 top-2 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-indigo-400 shadow-[0_8px_30px_rgba(34,211,238,0.25)]"
                    />
                  ) : null}
                </button>
              </div>
            );
          })}
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="lg:hidden"
          >
            <nav className="space-y-2">
              {sections.map((s) => {
                const Icon = s.icon;
                const isActive = active === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => {
                      onChange(s.key);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive ? "bg-white/5 text-white" : "text-slate-300 hover:bg-white/6 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-cyan-300" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
