import { Canvas, useFrame } from "@react-three/fiber";
import {
	Float,
	MeshDistortMaterial,
	MeshWobbleMaterial,
	Sparkles,
	Stars,
} from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Check, LoaderCircle, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const takenUsernames = new Set(["admin", "creator", "studio", "demo"]);

function CelebrationShape({ geometry, color, position, speed, scale = 1 }) {
	const ref = useRef();

	useFrame((state, delta) => {
		if (!ref.current) return;
		ref.current.rotation.x += delta * speed * 0.55;
		ref.current.rotation.y += delta * speed;
		ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.9 + position[0]) * 0.2;
	});

	return (
		<Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.2}>
			<mesh ref={ref} position={position} scale={scale}>
				{geometry}
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={0.5}
					roughness={0.25}
					metalness={0.6}
					transparent
					opacity={0.95}
				/>
			</mesh>
		</Float>
	);
}

function CelebrationParticles() {
	const pointsRef = useRef();
	const positions = useMemo(() => {
		const values = [];
		for (let index = 0; index < 360; index += 1) {
			values.push((Math.random() - 0.5) * 16);
			values.push((Math.random() - 0.5) * 16);
			values.push((Math.random() - 0.5) * 12);
		}
		return new Float32Array(values);
	}, []);

	useFrame((state) => {
		if (!pointsRef.current) return;
		pointsRef.current.rotation.y = state.clock.elapsedTime * 0.035;
		pointsRef.current.rotation.x = state.clock.elapsedTime * 0.018;
	});

	return (
		<points ref={pointsRef}>
			<bufferGeometry>
				<bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
			</bufferGeometry>
			<pointsMaterial size={0.05} color="#f5d0fe" transparent opacity={0.92} sizeAttenuation />
		</points>
	);
}

function SignupScene() {
	return (
		<div className="relative h-full min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/55 shadow-2xl shadow-fuchsia-950/20">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(250,204,21,0.22),transparent_34%),radial-gradient(circle_at_20%_30%,rgba(236,72,153,0.18),transparent_30%),radial-gradient(circle_at_78%_70%,rgba(34,197,94,0.14),transparent_26%)]" />
			<Canvas className="absolute inset-0" camera={{ position: [0, 0, 7], fov: 50 }} gl={{ alpha: true, antialias: true }}>
				<ambientLight intensity={0.9} color="#f5d0fe" />
				<pointLight position={[4.5, 3.2, 4]} intensity={2.2} color="#f472b6" />
				<pointLight position={[-4.5, -2, 3]} intensity={1.6} color="#22d3ee" />
				<pointLight position={[0, 4.5, 0]} intensity={1.5} color="#facc15" />
				<CelebrationShape
					position={[-2.2, 1.1, 0.5]}
					color="#facc15"
					speed={0.55}
					scale={1.05}
					geometry={<dodecahedronGeometry args={[0.7, 0]} />}
				/>
				<CelebrationShape
					position={[0.8, -0.25, 0.2]}
					color="#22d3ee"
					speed={0.42}
					scale={1.15}
					geometry={<icosahedronGeometry args={[0.82, 0]} />}
				/>
				<CelebrationShape
					position={[2.2, 1, -0.5]}
					color="#f472b6"
					speed={0.52}
					scale={0.92}
					geometry={<octahedronGeometry args={[0.68, 0]} />}
				/>
				<mesh position={[-0.8, -1.8, -0.8]} scale={0.95}>
					<torusKnotGeometry args={[0.55, 0.18, 140, 18]} />
					<MeshDistortMaterial color="#34d399" speed={3} distort={0.3} roughness={0.2} />
				</mesh>
				<mesh position={[1.6, -1.6, -0.9]} scale={0.82}>
					<torusGeometry args={[0.72, 0.2, 18, 80]} />
					<MeshWobbleMaterial color="#a855f7" factor={0.35} speed={2} />
				</mesh>
				<Sparkles count={60} scale={4.2} size={2.2} speed={0.45} color="#fff7ed" opacity={0.9} />
				<Stars radius={16} depth={30} count={900} factor={3.5} saturation={0.9} fade speed={1} />
				<CelebrationParticles />
			</Canvas>
			<div className="absolute inset-0 bg-gradient-to-br from-slate-950/30 via-slate-950/10 to-slate-950/75" />
			<div className="absolute inset-0 bg-slate-950/15 backdrop-blur-xs" />
			<div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100/85 backdrop-blur-glass">
				<span className="inline-flex items-center gap-2">
					<ShieldCheck className="h-4 w-4 text-emerald-300" />
					Celebrate your new account with instant access to the platform
				</span>
			</div>
		</div>
	);
}

function FieldShell({ label, children, helper, tone = "slate" }) {
	const toneClasses =
		tone === "success"
			? "border-emerald-400/30 focus-within:border-emerald-300/60"
			: tone === "error"
				? "border-rose-400/30 focus-within:border-rose-300/60"
				: tone === "warn"
					? "border-amber-400/30 focus-within:border-amber-300/60"
					: "border-white/10 focus-within:border-cyan-300/60";

	return (
		<div className="space-y-2">
			<div className={`relative rounded-2xl border bg-slate-950/55 px-4 pb-3 pt-6 outline-none transition ${toneClasses}`}>
				{children}
				<label className="pointer-events-none absolute left-4 top-4 text-sm text-slate-300 transition-all">
					{label}
				</label>
			</div>
			{helper ? <p className="text-xs text-slate-300/80">{helper}</p> : null}
		</div>
	);
}

function PasswordStrength({ score }) {
	const labels = ["Weak", "Medium", "Strong"];
	const width = `${Math.max(score, 1) * 33.333}%`;
	const colors = ["bg-rose-500", "bg-amber-400", "bg-emerald-400"];

	return (
		<div className="space-y-2">
			<div className="h-2 overflow-hidden rounded-full bg-white/10">
				<motion.div
					animate={{ width }}
					transition={{ duration: 0.35, ease: "easeOut" }}
					className={`h-full rounded-full ${colors[Math.min(score - 1, 2)]}`}
				/>
			</div>
			<p className="text-xs uppercase tracking-[0.24em] text-slate-300">Password strength: {labels[Math.max(score - 1, 0)]}</p>
		</div>
	);
}

function GoogleIcon() {
	return (
		<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
			<path fill="#ffffff" d="M21.35 11.1h-9.18v2.96h5.28c-.23 1.35-1.06 2.5-2.26 3.27v2.72h3.66c2.14-1.97 3.37-4.87 3.37-8.32 0-.67-.06-1.32-.17-1.96Z" />
			<path fill="#ffffff" d="M12.17 22c2.97 0 5.46-.98 7.28-2.69l-3.66-2.72c-1.02.69-2.33 1.09-3.62 1.09-2.78 0-5.14-1.87-5.99-4.39H2.4v2.77A10 10 0 0 0 12.17 22Z" opacity="0.9" />
			<path fill="#ffffff" d="M6.18 13.29a5.99 5.99 0 0 1 0-3.78V6.74H2.4a10 10 0 0 0 0 8.32l3.78-1.77Z" opacity="0.75" />
			<path fill="#ffffff" d="M12.17 4.11c1.62 0 3.08.56 4.23 1.66l3.16-3.16A10 10 0 0 0 12.17 0 10 10 0 0 0 2.4 6.74l3.78 1.77C7.03 5.98 9.39 4.11 12.17 4.11Z" opacity="0.95" />
		</svg>
	);
}

function GithubIcon() {
	return (
		<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
			<path
				fill="#ffffff"
				d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.12-1.51-1.12-1.51-.92-.65.07-.64.07-.64 1.02.07 1.56 1.07 1.56 1.07.9 1.57 2.36 1.12 2.93.86.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.2 9.2 0 0 1 12 6.99c.85 0 1.7.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.94-2.34 4.8-4.57 5.06.36.31.68.93.68 1.88 0 1.35-.01 2.44-.01 2.77 0 .26.18.59.69.48A10.24 10.24 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
			/>
		</svg>
	);
}

function ConfettiBurst() {
	const pieces = useMemo(
		() =>
			Array.from({ length: 22 }, (_, index) => ({
				id: index,
				x: (index % 7) * 18 - 54,
				y: Math.floor(index / 7) * 14 - 20,
				rotate: index * 17,
				delay: index * 0.03,
				color: ["#22d3ee", "#a855f7", "#f472b6", "#facc15", "#34d399"][index % 5],
			})),
		[]
	);

	return (
		<div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
			{pieces.map((piece) => (
				<motion.span
					key={piece.id}
					initial={{ opacity: 0, y: 0, scale: 0.2, rotate: 0 }}
					animate={{ opacity: [0, 1, 1, 0], y: [-10, -120, -180], x: [0, piece.x, piece.x * 1.1], rotate: [0, piece.rotate, piece.rotate * 2], scale: [0.2, 1, 0.7] }}
					transition={{ duration: 1.8, delay: piece.delay, ease: "easeOut" }}
					className="absolute left-1/2 top-1/2 h-3 w-2 rounded-sm"
					style={{ backgroundColor: piece.color, marginLeft: `${piece.x}px`, marginTop: `${piece.y}px` }}
				/>
			))}
		</div>
	);
}

export default function Signup() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		terms: false,
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuth();

	const usernameAvailable = formData.username.length >= 3 && !takenUsernames.has(formData.username.toLowerCase());
	const emailValid = /^\S+@\S+\.\S+$/.test(formData.email);
	const passwordScore = [
		formData.password.length >= 8,
		/[A-Z]/.test(formData.password) || /[a-z]/.test(formData.password),
		/\d/.test(formData.password),
		/[^A-Za-z0-9]/.test(formData.password),
	].filter(Boolean).length;
	const passwordStrength = passwordScore >= 4 ? 3 : passwordScore >= 3 ? 2 : passwordScore >= 1 ? 1 : 0;
	const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;

	const fieldVariants = {
		hidden: { opacity: 0, y: 16 },
		show: { opacity: 1, y: 0 },
	};

	const updateField = (event) => {
		const { name, type, checked, value } = event.target;
		setFormData((current) => ({
			...current,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!usernameAvailable || !emailValid || passwordStrength === 0 || !passwordsMatch || !formData.terms) return;
		setLoading(true);

		try {
			const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
			const { data } = await axios.post(`${base}/api/auth/register`, {
				name: formData.username,
				email: formData.email,
				password: formData.password,
			});

			login({
				token: data.token,
				user: {
					id: data._id,
					name: data.name,
					email: data.email,
				},
			});

			setLoading(false);
			setSuccess(true);
			window.setTimeout(() => {
				setSuccess(false);
				navigate("/dashboard", { replace: true });
			}, 700);
		} catch (error) {
			const message = error?.response?.data?.message || "Signup failed";
			alert(message);
			setLoading(false);
		}
	};

	const readyToSubmit = usernameAvailable && emailValid && passwordStrength > 0 && passwordsMatch && formData.terms;

	return (
		<div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(250,204,21,0.18),transparent_0_24%),radial-gradient(circle_at_82%_14%,rgba(244,114,182,0.16),transparent_0_24%),radial-gradient(circle_at_50%_84%,rgba(34,211,238,0.12),transparent_0_22%)]" />
			<div className="absolute inset-0 signup-particles opacity-90" />
			<div className="relative z-10 grid min-h-screen lg:grid-cols-2">
				<div className="p-4 lg:p-6">
					<SignupScene />
				</div>

				<div className="flex items-center justify-center px-5 py-10 lg:px-8">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.55, ease: "easeOut" }}
						className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/30 backdrop-blur-deep sm:p-8"
					>
						<AnimatePresence>{success ? <ConfettiBurst /> : null}</AnimatePresence>

						<div className="mb-8">
							<p className="text-sm uppercase tracking-[0.35em] text-fuchsia-300/80">Join the platform</p>
							<h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white">
								Create your account
							</h1>
							<p className="mt-3 text-sm leading-6 text-slate-300">
								Start building, sharing, and collaborating in a vibrant 3D creator space.
							</p>
						</div>

						<AnimatePresence mode="wait">
							{success ? (
								<motion.div
									key="success"
									initial={{ opacity: 0, scale: 0.96 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.98 }}
									className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-center"
								>
									<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
										<Check className="h-8 w-8" />
									</div>
									<h2 className="mt-4 text-2xl font-semibold text-white">Signup successful</h2>
									<p className="mt-2 text-sm leading-6 text-slate-300">
										Your account is ready. Welcome to the 3D creator community.
									</p>
								</motion.div>
							) : (
								<motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
									<motion.div variants={fieldVariants} initial="hidden" animate="show" transition={{ duration: 0.4 }}>
										<FieldShell
											label="Username"
											helper={formData.username.length === 0 ? "Choose a unique username." : usernameAvailable ? "Username available" : "Username already taken"}
											tone={formData.username.length === 0 ? "slate" : usernameAvailable ? "success" : "error"}
										>
											<input
												name="username"
												value={formData.username}
												onChange={updateField}
												placeholder=" "
												className="peer w-full bg-transparent text-white outline-none"
											/>
										</FieldShell>
									</motion.div>

									<motion.div variants={fieldVariants} initial="hidden" animate="show" transition={{ duration: 0.4, delay: 0.04 }}>
										<FieldShell
											label="Email"
											helper={formData.email.length === 0 ? "Use a valid email address." : emailValid ? "Email looks good" : "Enter a valid email address"}
											tone={formData.email.length === 0 ? "slate" : emailValid ? "success" : "error"}
										>
											<input
												name="email"
												type="email"
												value={formData.email}
												onChange={updateField}
												placeholder=" "
												className="peer w-full bg-transparent text-white outline-none"
											/>
										</FieldShell>
									</motion.div>

									<motion.div variants={fieldVariants} initial="hidden" animate="show" transition={{ duration: 0.4, delay: 0.08 }}>
										<FieldShell label="Password" helper={passwordStrength === 0 ? "Use 8+ chars with letters, numbers, and symbols." : null}>
											<input
												name="password"
												type="password"
												value={formData.password}
												onChange={updateField}
												placeholder=" "
												className="peer w-full bg-transparent text-white outline-none"
											/>
										</FieldShell>
										<PasswordStrength score={passwordStrength} />
									</motion.div>

									<motion.div variants={fieldVariants} initial="hidden" animate="show" transition={{ duration: 0.4, delay: 0.12 }}>
										<FieldShell
											label="Confirm password"
											helper={formData.confirmPassword.length === 0 ? "Re-enter your password." : passwordsMatch ? "Passwords match" : "Passwords do not match"}
											tone={formData.confirmPassword.length === 0 ? "slate" : passwordsMatch ? "success" : "error"}
										>
											<input
												name="confirmPassword"
												type="password"
												value={formData.confirmPassword}
												onChange={updateField}
												placeholder=" "
												className="peer w-full bg-transparent text-white outline-none"
											/>
										</FieldShell>
									</motion.div>

									<motion.div variants={fieldVariants} initial="hidden" animate="show" transition={{ duration: 0.4, delay: 0.16 }} className="flex items-center justify-between gap-4">
										<label className="flex items-center gap-3 text-sm text-slate-300">
											<input
												name="terms"
												type="checkbox"
												checked={formData.terms}
												onChange={updateField}
												className="h-4 w-4 rounded border-white/20 bg-slate-900 text-fuchsia-400 focus:ring-fuchsia-300"
											/>
											I agree to the terms & conditions
										</label>
									</motion.div>

									<motion.div variants={fieldVariants} initial="hidden" animate="show" transition={{ duration: 0.4, delay: 0.2 }} className="grid gap-3 sm:grid-cols-2">
										<button
											type="button"
											className="inline-flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-[0_0_26px_rgba(255,255,255,0.14)]"
										>
											<GoogleIcon /> Continue with Google
										</button>
										<button
											type="button"
											className="inline-flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-[0_0_26px_rgba(255,255,255,0.14)]"
										>
											<GithubIcon /> Continue with GitHub
										</button>
									</motion.div>

									<motion.button
										type="submit"
										whileHover={{ scale: loading ? 1 : 1.01 }}
										whileTap={{ scale: loading ? 1 : 0.99 }}
										disabled={loading || !readyToSubmit}
										className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-950/30 transition hover:shadow-[0_0_30px_rgba(244,114,182,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
									>
										{loading ? (
											<>
												<LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Creating account...
											</>
										) : (
											"Create account"
										)}
									</motion.button>

									<motion.p variants={fieldVariants} initial="hidden" animate="show" transition={{ duration: 0.4, delay: 0.24 }} className="text-center text-sm text-slate-300">
										Already have an account?{" "}
										<Link to="/login" className="font-semibold text-fuchsia-300 transition hover:text-fuchsia-200">
											Login
										</Link>
									</motion.p>
								</motion.form>
							)}
						</AnimatePresence>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

