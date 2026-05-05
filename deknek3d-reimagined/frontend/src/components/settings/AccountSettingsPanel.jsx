import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Eye, EyeOff, ImagePlus, Upload, Trash2, ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";

function FloatingField({ label, children, hint, invalid, focused }) {
  return (
    <div className="relative">
      <div
        className={`group rounded-2xl border px-4 pb-3 pt-5 transition-all duration-200 ${
          invalid
            ? "border-rose-400/40 bg-rose-500/5 shadow-[0_0_0_1px_rgba(251,113,133,0.15)]"
            : focused
              ? "border-cyan-400/40 bg-white/7 shadow-[0_0_0_1px_rgba(34,211,238,0.14)]"
              : "border-white/10 bg-white/5"
        }`}
      >
        <label className={`absolute left-4 top-3 text-xs font-medium transition-all duration-200 ${focused ? "text-cyan-200" : "text-slate-400"}`}>
          {label}
        </label>
        <div className="pt-2">{children}</div>
      </div>
      {hint ? <p className={`mt-2 text-xs ${invalid ? "text-rose-300" : "text-slate-400"}`}>{hint}</p> : null}
    </div>
  );
}

function Switch({ label, checked, onChange, accent }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/7"
    >
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="mt-1 text-xs text-slate-400">Toggle this account preference.</div>
      </div>
      <span
        className={`relative h-8 w-14 rounded-full border border-white/10 p-1 transition-all duration-300 ${checked ? "bg-white/10" : "bg-slate-950/60"}`}
        style={{ boxShadow: checked ? `0 0 22px ${accent}55` : "inset 0 0 0 1px rgba(255,255,255,0.04)" }}
      >
        <motion.span
          layout
          className="block h-6 w-6 rounded-full border border-white/15 bg-gradient-to-br from-white to-slate-200 shadow-lg"
          animate={{ x: checked ? 24 : 0, boxShadow: checked ? `0 0 16px ${accent}88` : "0 6px 16px rgba(0,0,0,0.35)" }}
          transition={{ type: "spring", stiffness: 500, damping: 34 }}
        />
      </span>
    </button>
  );
}

function StatusPill({ status, tone = "cyan" }) {
  const styles = {
    cyan: "bg-cyan-400/15 text-cyan-100",
    green: "bg-emerald-400/15 text-emerald-100",
    amber: "bg-amber-400/15 text-amber-100",
    rose: "bg-rose-400/15 text-rose-100",
  };
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[tone]}`}>{status}</span>;
}

function ConfirmModal({ open, title, description, confirmLabel, danger, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            initial={{ y: 12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.98 }}
            className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-black/40"
          >
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="mt-3 text-sm text-slate-300">{description}</p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={onCancel} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10">
                Cancel
              </button>
              <button type="button" onClick={onConfirm} className={`rounded-2xl px-4 py-2 text-sm font-semibold text-white transition ${danger ? "bg-rose-500 hover:bg-rose-400" : "bg-cyan-400 text-slate-950 hover:brightness-110"}`}>
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function CropModal({ open, title, image, onCancel, onSave, mode = "avatar" }) {
  const [zoom, setZoom] = useState(100);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);

  useEffect(() => {
    if (open) {
      setZoom(100);
      setX(50);
      setY(50);
    }
  }, [open, image]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            className="w-full max-w-3xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-300">Adjust the crop area before saving the image.</p>
              </div>
              <StatusPill status={mode === "avatar" ? "Avatar crop" : "Cover adjust"} tone="cyan" />
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className={`relative overflow-hidden rounded-[1.3rem] border border-white/10 ${mode === "avatar" ? "aspect-square" : "aspect-[16/9]"}`}>
                  {image ? (
                    <img
                      src={image}
                      alt="Crop preview"
                      className="absolute left-1/2 top-1/2 max-w-none select-none"
                      style={{
                        width: `${zoom}%`,
                        transform: `translate(-${x}%, -${y}%)`,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">No image selected</div>
                  )}
                  <div className={`pointer-events-none absolute inset-0 border-4 border-dashed border-cyan-300/50 ${mode === "avatar" ? "rounded-full" : "rounded-[1.3rem]"}`} />
                </div>
              </div>

              <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Zoom</span>
                    <span>{zoom}%</span>
                  </div>
                  <input type="range" min="80" max="160" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-cyan-400" />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Horizontal</span>
                    <span>{x}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={x} onChange={(e) => setX(Number(e.target.value))} className="w-full accent-cyan-400" />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Vertical</span>
                    <span>{y}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={y} onChange={(e) => setY(Number(e.target.value))} className="w-full accent-cyan-400" />
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-xs text-slate-300">
                  Drag-and-drop is simulated with sliders for a lighter build. The result still behaves like a crop editor.
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={onCancel} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onSave({ zoom, x, y, image })}
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-110"
              >
                Save crop
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function AccountSettingsPanel({ onDirtyChange, onRequestSectionChange }) {
  const [form, setForm] = useState({
    username: "jordandoe",
    email: "jordan@deknek3d.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    coverPosition: 50,
    accent: "#22d3ee",
    emailVerified: true,
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [profileCropOpen, setProfileCropOpen] = useState(false);
  const [coverCropOpen, setCoverCropOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingMode, setPendingMode] = useState("avatar");
  const [focusKey, setFocusKey] = useState(null);
  const [dirty, setDirty] = useState(false);

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const initialSnapshot = useRef(JSON.stringify(form));

  const usernameTaken = useMemo(() => ["admin", "creator", "deknek", "jordan"].includes(form.username.trim().toLowerCase()), [form.username]);
  const usernameAvailable = form.username.trim().length >= 3 && !usernameTaken;
  const passwordMismatch = form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword;

  useEffect(() => {
    const nextDirty = JSON.stringify(form) !== initialSnapshot.current;
    setDirty(nextDirty);
    onDirtyChange?.(nextDirty);
  }, [form, onDirtyChange]);

  useEffect(() => {
    const onBeforeUnload = (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const validate = () => {
    const next = {};
    if (!usernameAvailable) next.username = usernameTaken ? "This username is already taken." : "Username must be at least 3 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.newPassword && form.newPassword.length < 8) next.newPassword = "Password must be at least 8 characters.";
    if (passwordMismatch) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setTouched((current) => ({ ...current, [key]: true }));
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setSaved(false);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSaving(false);
    setSaved(true);
    initialSnapshot.current = JSON.stringify(form);
    setDirty(false);
    onDirtyChange?.(false);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleSectionChange = (nextSection) => {
    if (dirty && nextSection !== "account") {
      const confirmLeave = window.confirm("You have unsaved changes. Leave account settings?");
      if (!confirmLeave) return;
    }
    onRequestSectionChange?.(nextSection);
  };

  const openPicker = (mode) => {
    setPendingMode(mode);
    if (mode === "avatar") profileInputRef.current?.click();
    else coverInputRef.current?.click();
  };

  const handleFile = (event, mode) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPendingMode(mode);
    setPendingImage(url);
    if (mode === "avatar") setProfileCropOpen(true);
    else setCoverCropOpen(true);
    event.target.value = "";
  };

  const saveCrop = ({ image, x, y }) => {
    if (pendingMode === "avatar") {
      setField("profileImage", image);
    } else {
      setField("coverImage", image);
      setField("coverPosition", y);
      void x;
    }
    setPendingImage(null);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5 shadow-2xl shadow-black/20 backdrop-blur-glass">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/75">Account settings</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Identity, security, and media</h3>
          </div>
          <StatusPill status={dirty ? "Unsaved changes" : "All saved"} tone={dirty ? "amber" : "green"} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FloatingField
            label="Username"
            hint={touched.username ? errors.username ?? (usernameAvailable ? "Username available" : usernameTaken ? "Username unavailable" : "") : "Pick a unique public handle."}
            invalid={Boolean(errors.username)}
            focused={focusKey === "username"}
          >
            <div className="flex items-center gap-3">
              <input
                value={form.username}
                onChange={(event) => setField("username", event.target.value)}
                onFocus={() => setFocusKey("username")}
                onBlur={() => setFocusKey(null)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                placeholder="Enter username"
              />
              {usernameAvailable ? <CheckCircle2 className="h-5 w-5 text-emerald-300" /> : <ShieldCheck className="h-5 w-5 text-slate-500" />}
            </div>
          </FloatingField>

          <FloatingField
            label="Email"
            hint={touched.email ? errors.email ?? (form.emailVerified ? "Verified email" : "Email requires verification") : "Used for login and security notifications."}
            invalid={Boolean(errors.email)}
            focused={focusKey === "email"}
          >
            <div className="flex items-center gap-3">
              <input
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                onFocus={() => setFocusKey("email")}
                onBlur={() => setFocusKey(null)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                placeholder="name@example.com"
              />
              {form.emailVerified ? <BadgeCheck className="h-5 w-5 text-cyan-300" /> : <AlertTriangle className="h-5 w-5 text-amber-300" />}
            </div>
          </FloatingField>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Password change</h4>
                <p className="mt-1 text-xs text-slate-400">Leave fields blank to keep the current password.</p>
              </div>
              <StatusPill status={form.newPassword ? "Editing" : "Optional"} tone={form.newPassword ? "amber" : "cyan"} />
            </div>

            <FloatingField label="Current password" hint={errors.currentPassword} invalid={Boolean(errors.currentPassword)} focused={focusKey === "currentPassword"}>
              <div className="flex items-center gap-3">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(event) => setField("currentPassword", event.target.value)}
                  onFocus={() => setFocusKey("currentPassword")}
                  onBlur={() => setFocusKey(null)}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  placeholder="Current password"
                />
                <button type="button" onClick={() => setShowCurrent((state) => !state)} className="text-slate-400 transition hover:text-white">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FloatingField>

            <FloatingField label="New password" hint={errors.newPassword} invalid={Boolean(errors.newPassword)} focused={focusKey === "newPassword"}>
              <div className="flex items-center gap-3">
                <input
                  type={showNew ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(event) => setField("newPassword", event.target.value)}
                  onFocus={() => setFocusKey("newPassword")}
                  onBlur={() => setFocusKey(null)}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  placeholder="New password"
                />
                <button type="button" onClick={() => setShowNew((state) => !state)} className="text-slate-400 transition hover:text-white">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FloatingField>

            <FloatingField label="Confirm new password" hint={errors.confirmPassword} invalid={Boolean(errors.confirmPassword)} focused={focusKey === "confirmPassword"}>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(event) => setField("confirmPassword", event.target.value)}
                onFocus={() => setFocusKey("confirmPassword")}
                onBlur={() => setFocusKey(null)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                placeholder="Repeat new password"
              />
            </FloatingField>
          </div>

          <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Profile media</h4>
                <p className="mt-1 text-xs text-slate-400">Update your avatar and cover with quick crop controls.</p>
              </div>
              <StatusPill status="Uploads" tone="cyan" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-white">Profile picture</div>
                    <div className="mt-1 text-xs text-slate-400">Square crop recommended.</div>
                  </div>
                  <button type="button" onClick={() => openPicker("avatar")} className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10">
                    <ImagePlus className="h-4 w-4" /> Upload
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <img src={form.profileImage} alt="Profile preview" className="h-16 w-16 rounded-2xl object-cover ring-2 ring-cyan-400/30" />
                  <p className="text-xs text-slate-400">Crop to a square so it displays well across the platform.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-white">Cover image</div>
                    <div className="mt-1 text-xs text-slate-400">Adjust the focus position below.</div>
                  </div>
                  <button type="button" onClick={() => openPicker("cover")} className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10">
                    <Upload className="h-4 w-4" /> Upload
                  </button>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                  <div className="relative h-28">
                    <img
                      src={form.coverImage}
                      alt="Cover preview"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: `center ${form.coverPosition}%` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span>Cover position</span>
                <span>{form.coverPosition}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={form.coverPosition}
                onChange={(event) => setField("coverPosition", Number(event.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
          <Switch label="Email verification required for public actions" checked={form.emailVerified} onChange={(value) => setField("emailVerified", value)} accent={form.accent} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-4">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            {saved ? <CheckCircle2 className="h-5 w-5 text-emerald-300" /> : <ShieldCheck className="h-5 w-5 text-cyan-300" />}
            <span>{saved ? "Changes saved successfully." : dirty ? "You have unsaved changes." : "All changes are up to date."}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/15"
            >
              <Trash2 className="h-4 w-4" /> Delete account
            </button>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              animate={saved ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
            </motion.button>
          </div>
        </div>
      </form>

      <CropModal
        open={profileCropOpen}
        title="Crop profile picture"
        image={pendingImage}
        mode="avatar"
        onCancel={() => {
          setProfileCropOpen(false);
          setPendingImage(null);
        }}
        onSave={(result) => {
          saveCrop(result);
          setProfileCropOpen(false);
        }}
      />

      <CropModal
        open={coverCropOpen}
        title="Adjust cover image"
        image={pendingImage}
        mode="cover"
        onCancel={() => {
          setCoverCropOpen(false);
          setPendingImage(null);
        }}
        onSave={(result) => {
          saveCrop(result);
          setCoverCropOpen(false);
        }}
      />

      <ConfirmModal
        open={showConfirm}
        title="Delete your account?"
        description="This action is permanent. All models, uploads, and account data will be removed."
        confirmLabel="Delete account"
        danger
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          window.alert("Account deletion is mocked in this workspace.");
        }}
      />
    </div>
  );
}
