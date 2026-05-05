import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import SettingsSidebar from "../components/settings/SettingsSidebar";
import AppearancePanel from "../components/settings/AppearancePanel";
import AccountSettingsPanel from "../components/settings/AccountSettingsPanel";
import { motion, AnimatePresence } from "framer-motion";

function SectionShell({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.28 }}
      className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 shadow-2xl shadow-black/20 backdrop-blur-glass"
    >
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 text-slate-300">{children}</div>
    </motion.div>
  );
}

export function SettingsContent() {
  const [active, setActive] = useState("profile");
  const [accountDirty, setAccountDirty] = useState(false);

  const handleSectionChange = (nextSection) => {
    if (active === "account" && accountDirty && nextSection !== "account") {
      const confirmLeave = window.confirm("You have unsaved account changes. Leave this section?");
      if (!confirmLeave) return;
    }

    setActive(nextSection);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside>
        <SettingsSidebar active={active} onChange={handleSectionChange} />
      </aside>

      <main className="min-w-0">
        <AnimatePresence mode="wait">
          {active === "profile" && (
            <SectionShell key="profile" title="Profile settings">
              <p>Update display name, bio, avatar, and cover image.</p>
            </SectionShell>
          )}

          {active === "account" && (
            <SectionShell key="account" title="Account settings">
              <AccountSettingsPanel onDirtyChange={setAccountDirty} onRequestSectionChange={setActive} />
            </SectionShell>
          )}

          {active === "privacy" && (
            <SectionShell key="privacy" title="Privacy settings">
              <p>Control who can see your models and activity.</p>
            </SectionShell>
          )}

          {active === "notifications" && (
            <SectionShell key="notifications" title="Notification settings">
              <p>Manage email, in-app, and push notifications.</p>
            </SectionShell>
          )}

          {active === "appearance" && (
            <SectionShell key="appearance" title="Appearance">
              <AppearancePanel />
            </SectionShell>
          )}

          {active === "billing" && (
            <SectionShell key="billing" title="Billing & plans">
              <p>Payment methods, invoices, and subscription settings.</p>
            </SectionShell>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function Settings() {
  return (
    <DashboardLayout>
      <SettingsContent />
    </DashboardLayout>
  );
}
