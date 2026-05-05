import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";

function AnimatedSphere() {
	const meshRef = useRef();

	useFrame((state, delta) => {
		if (!meshRef.current) return;

		meshRef.current.rotation.x += delta * 0.25;
		meshRef.current.rotation.y += delta * 0.4;
	});

	return (
		<mesh ref={meshRef} position={[0, 0, 0]}>
			<icosahedronGeometry args={[1.35, 3]} />
			<meshStandardMaterial
				color="#22d3ee"
				wireframe
				emissive="#a855f7"
				emissiveIntensity={0.35}
				roughness={0.3}
				metalness={0.55}
			/>
		</mesh>
	);
}

function FloatingParticles() {
	const pointsRef = useRef();
	const particlePositions = useMemo(() => {
		const positions = [];
		for (let index = 0; index < 260; index += 1) {
			positions.push((Math.random() - 0.5) * 18);
			positions.push((Math.random() - 0.5) * 18);
			positions.push((Math.random() - 0.5) * 18);
		}
		return new Float32Array(positions);
	}, []);

	useFrame((state) => {
		if (!pointsRef.current) return;

		pointsRef.current.rotation.y = state.clock.elapsedTime * 0.06;
		pointsRef.current.rotation.x = state.clock.elapsedTime * 0.03;
	});

	return (
		<points ref={pointsRef}>
			<bufferGeometry>
				<bufferAttribute
					attach="attributes-position"
					array={particlePositions}
					count={particlePositions.length / 3}
					itemSize={3}
				/>
			</bufferGeometry>
			<pointsMaterial color="#93c5fd" size={0.045} sizeAttenuation transparent opacity={0.85} />
		</points>
	);
}

function Orbits() {
	const groupRef = useRef();

	useFrame((state, delta) => {
		if (!groupRef.current) return;

		groupRef.current.rotation.y += delta * 0.08;
		groupRef.current.children.forEach((child, index) => {
			child.rotation.x = state.clock.elapsedTime * (0.2 + index * 0.02);
			child.rotation.y = state.clock.elapsedTime * (0.12 + index * 0.02);
		});
	});

	return (
		<group ref={groupRef}>
			<mesh position={[3.2, 0.8, -2.2]}>
				<torusGeometry args={[0.8, 0.18, 16, 64]} />
				<meshStandardMaterial color="#3b82f6" wireframe opacity={0.45} transparent />
			</mesh>
			<mesh position={[-3.4, -1.2, -1.6]}>
				<octahedronGeometry args={[0.7, 0]} />
				<meshStandardMaterial color="#a855f7" wireframe opacity={0.4} transparent />
			</mesh>
		</group>
	);
}

function OrbitingCamera() {
	const { camera } = useThree();

	useFrame((state) => {
		const elapsed = state.clock.elapsedTime * 0.18;
		camera.position.x = Math.cos(elapsed) * 5.5;
		camera.position.z = Math.sin(elapsed) * 5.5;
		camera.position.y = 1.7 + Math.sin(elapsed * 0.9) * 0.35;
		camera.lookAt(0, 0, 0);
	});

	return null;
}

export default function Hero() {
	return (
		<section className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
			<div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/85 to-slate-950" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.24),transparent_30%),radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.16),transparent_26%)]" />
			<div className="absolute inset-0 bg-slate-950/30 backdrop-blur-xs" />

			<Canvas
				className="absolute inset-0"
				camera={{ position: [0, 0, 6], fov: 55 }}
				gl={{ antialias: true, alpha: true }}
			>
				<ambientLight intensity={0.65} color="#c084fc" />
				<pointLight position={[6, 4, 6]} intensity={1.6} color="#22d3ee" />
				<pointLight position={[-6, -2, -4]} intensity={0.9} color="#3b82f6" />
				<AnimatedSphere />
				<FloatingParticles />
				<Orbits />
				<OrbitingCamera />
			</Canvas>

			<div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20">
				<motion.div
					initial="hidden"
					animate="show"
					variants={{
						hidden: {},
						show: {
							transition: {
								staggerChildren: 0.14,
								delayChildren: 0.15,
							},
						},
					}}
					className="w-full max-w-6xl"
				>
					<div className="w-full px-6 py-12 text-center md:px-12 md:py-16">
						<motion.p
							variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
							className="mb-5 text-sm uppercase tracking-[0.42em] text-cyan-300/80"
						>
							Interactive 3D showcase
						</motion.p>

						<motion.h1
							variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } }}
							className="font-display mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-transparent md:text-6xl lg:text-7xl"
							style={{
								backgroundImage: "linear-gradient(90deg, #ffffff 0%, #60a5fa 32%, #a855f7 68%, #22d3ee 100%)",
								backgroundClip: "text",
								WebkitBackgroundClip: "text",
							}}
						>
							Transform Ideas into 3D Reality
						</motion.h1>

						<motion.p
							variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
							className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-300 md:text-lg"
						>
							Launch immersive 3D experiences, showcase models with cinematic lighting, and keep your ideas
							looking sharp across every screen.
						</motion.p>

						<motion.div
							variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
							className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
						>
							<Link
								to="/signup"
								className="inline-flex min-w-44 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl"
							>
								Get Started
							</Link>
							<Link
								to="/login"
								className="inline-flex min-w-44 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/10"
							>
								Login
							</Link>
						</motion.div>

						<motion.div
							variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
							className="mt-12 grid gap-4 sm:grid-cols-3"
						>
							{[
								{ label: "10k+ Models", tone: "from-blue-500/20 to-cyan-400/10" },
								{ label: "5k+ Creators", tone: "from-purple-500/20 to-blue-500/10" },
								{ label: "100+ Categories", tone: "from-cyan-400/20 to-purple-500/10" },
							].map((item) => (
								<div
									key={item.label}
									className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.tone} px-5 py-4 text-left shadow-lg shadow-slate-950/20 backdrop-blur-glass`}
								>
									<p className="text-sm uppercase tracking-[0.24em] text-slate-300/80">Community</p>
									<p className="mt-2 text-2xl font-semibold text-white">{item.label}</p>
								</div>
							))}
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

