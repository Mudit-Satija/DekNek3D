import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

function FloatingShape({ geometry, color, position, speed = 0.35, scale = 1 }) {
	const ref = useRef();

	useFrame((state, delta) => {
		if (!ref.current) return;
		ref.current.rotation.x += delta * speed * 0.6;
		ref.current.rotation.y += delta * speed;
		ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + position[0]) * 0.16;
	});

	return (
		<Float speed={1.2} rotationIntensity={0.65} floatIntensity={0.9}>
			<mesh ref={ref} position={position} scale={scale}>
				{geometry}
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={0.22}
					roughness={0.32}
					metalness={0.55}
					transparent
					opacity={0.95}
				/>
			</mesh>
		</Float>
	);
}

function ParticleField() {
	const pointsRef = useRef();
	const positions = useMemo(() => {
		const values = [];
		for (let index = 0; index < 260; index += 1) {
			values.push((Math.random() - 0.5) * 14);
			values.push((Math.random() - 0.5) * 14);
			values.push((Math.random() - 0.5) * 12);
		}
		return new Float32Array(values);
	}, []);

	useFrame((state) => {
		if (!pointsRef.current) return;
		pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
		pointsRef.current.rotation.x = state.clock.elapsedTime * 0.015;
	});

	return (
		<points ref={pointsRef}>
			<bufferGeometry>
				<bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
			</bufferGeometry>
			<pointsMaterial size={0.045} color="#c4b5fd" transparent opacity={0.9} sizeAttenuation />
		</points>
	);
}

function LoginScene() {
	return (
		<div className="relative h-full min-h-[32rem] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/50">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_70%_25%,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_25%_72%,rgba(34,211,238,0.16),transparent_26%)]" />
			<Canvas
				className="absolute inset-0"
				camera={{ position: [0, 0, 7], fov: 50 }}
				gl={{ alpha: true, antialias: true }}
			>
				<ambientLight intensity={0.8} color="#c084fc" />
				<pointLight position={[4, 3, 4]} intensity={1.7} color="#22d3ee" />
				<pointLight position={[-4, -2, 3]} intensity={1.1} color="#3b82f6" />
				<FloatingShape
					position={[-2.2, 1.2, 0.6]}
					color="#22d3ee"
					speed={0.45}
					scale={0.95}
					geometry={<dodecahedronGeometry args={[0.65, 0]} />}
				/>
				<FloatingShape
					position={[0.8, -0.3, 0.5]}
					color="#a855f7"
					speed={0.35}
					scale={1.1}
					geometry={<icosahedronGeometry args={[0.8, 0]} />}
				/>
				<FloatingShape
					position={[2.1, 1, -0.4]}
					color="#60a5fa"
					speed={0.42}
					scale={0.9}
					geometry={<octahedronGeometry args={[0.7, 0]} />}
				/>
				<ParticleField />
			</Canvas>
			<div className="absolute inset-0 bg-gradient-to-br from-slate-950/35 via-slate-950/20 to-slate-950/75" />
			<div className="absolute inset-0 bg-slate-950/20 backdrop-blur-xs" />
			<div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200/80 backdrop-blur-glass">
				<span className="inline-flex items-center gap-2">
					<span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
					Secure access to your 3D workspace
				</span>
			</div>
		</div>
	);
}

export default function Login() {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({ email: "", password: "", remember: true });
	const navigate = useNavigate();
	const { login } = useAuth();
	const location = useLocation();
	const redirectTo = location.state?.from || "/dashboard";

	const fieldVariants = {
		hidden: { opacity: 0, y: 16 },
		show: { opacity: 1, y: 0 },
	};

	const handleChange = (event) => {
		const { name, value, type, checked } = event.target;
		setFormData((current) => ({
			...current,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!formData.email || !formData.password) {
			alert("Please enter email and password");
			return;
		}

		setLoading(true);
		try {
			const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
			const { data } = await axios.post(`${base}/api/auth/login`, {
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

			navigate(redirectTo, { replace: true });
		} catch (error) {
			const message = error?.response?.data?.message || "Login failed";
			alert(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_0_22%),radial-gradient(circle_at_80%_15%,rgba(168,85,247,0.16),transparent_0_24%),radial-gradient(circle_at_50%_80%,rgba(34,211,238,0.12),transparent_0_20%)]" />
			<div className="absolute inset-0 login-particles opacity-75" />
			<div className="relative z-10 grid min-h-screen lg:grid-cols-2">
				<div className="p-4 lg:p-6">
					<LoginScene />
				</div>

				<div className="flex items-center justify-center px-5 py-10 lg:px-8">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.55, ease: "easeOut" }}
						className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/30 backdrop-blur-deep sm:p-8"
					>
						<div className="mb-8">
							<p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Welcome back</p>
							<h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white">
								Login to your account
							</h1>
							<p className="mt-3 text-sm leading-6 text-slate-300">
								Access your models, previews, and studio tools from one place.
							</p>
						</div>

						<motion.form onSubmit={handleSubmit} className="space-y-5">
							<motion.div variants={fieldVariants} initial="hidden" animate="show" transition={{ duration: 0.45 }}>
								<div className="relative">
									<input
										id="email"
										name="email"
										type="email"
										value={formData.email}
										onChange={handleChange}
										placeholder=" "
										className="peer w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 pb-3 pt-6 text-white outline-none transition focus:border-cyan-300/60"
									/>
									<label
										htmlFor="email"
										className="pointer-events-none absolute left-4 top-4 text-sm text-slate-300 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:top-4 peer-focus:text-sm peer-focus:text-cyan-200"
									>
										Email address
									</label>
								</div>
							</motion.div>

							<motion.div variants={fieldVariants} initial="hidden" animate="show" transition={{ duration: 0.45, delay: 0.05 }}>
								<div className="relative">
									<input
										id="password"
										name="password"
										type="password"
										value={formData.password}
										onChange={handleChange}
										placeholder=" "
										className="peer w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 pb-3 pt-6 text-white outline-none transition focus:border-cyan-300/60"
									/>
									<label
										htmlFor="password"
										className="pointer-events-none absolute left-4 top-4 text-sm text-slate-300 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:top-4 peer-focus:text-sm peer-focus:text-cyan-200"
									>
										Password
									</label>
								</div>
							</motion.div>

							<motion.div
								variants={fieldVariants}
								initial="hidden"
								animate="show"
								transition={{ duration: 0.45, delay: 0.1 }}
								className="flex items-center justify-between gap-4"
							>
								<label className="flex items-center gap-3 text-sm text-slate-300">
									<input
										name="remember"
										type="checkbox"
										checked={formData.remember}
										onChange={handleChange}
										className="h-4 w-4 rounded border-white/20 bg-slate-900 text-cyan-400 focus:ring-cyan-300"
									/>
									Remember me
								</label>
								<Link to="/" className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200">
									Forgot password?
								</Link>
							</motion.div>

							<motion.button
								type="submit"
								whileHover={{ scale: loading ? 1 : 1.01 }}
								whileTap={{ scale: loading ? 1 : 0.99 }}
								disabled={loading}
								className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
							>
								{loading ? "Logging in..." : "Login"}
							</motion.button>

							<motion.p
								variants={fieldVariants}
								initial="hidden"
								animate="show"
								transition={{ duration: 0.45, delay: 0.15 }}
								className="text-center text-sm text-slate-300"
							>
								Don&apos;t have an account?{" "}
								<Link to="/signup" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
									Sign up
								</Link>
							</motion.p>
						</motion.form>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

