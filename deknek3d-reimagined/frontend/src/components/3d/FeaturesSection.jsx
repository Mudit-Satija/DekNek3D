import { Canvas, useFrame } from "@react-three/fiber";
import {
	Float,
	MeshDistortMaterial,
	MeshWobbleMaterial,
	Sparkles,
	Sphere,
	Torus,
	TorusKnot,
} from "@react-three/drei";
import { motion } from "framer-motion";
import { useRef } from "react";

function RotatingCube() {
	const ref = useRef();

	useFrame((state, delta) => {
		if (!ref.current) return;
		ref.current.rotation.x += delta * 0.35;
		ref.current.rotation.y += delta * 0.5;
	});

	return (
		<Float speed={1.5} rotationIntensity={0.7} floatIntensity={0.7}>
			<mesh ref={ref} scale={1.15}>
				<boxGeometry args={[1, 1, 1]} />
				<MeshDistortMaterial color="#3b82f6" speed={2} distort={0.35} radius={0.6} roughness={0.25} />
			</mesh>
		</Float>
	);
}

function SpinningTorus() {
	const ref = useRef();

	useFrame((state, delta) => {
		if (!ref.current) return;
		ref.current.rotation.x += delta * 0.25;
		ref.current.rotation.y += delta * 0.75;
	});

	return (
		<Float speed={2} rotationIntensity={1} floatIntensity={0.65}>
			<Torus ref={ref} args={[0.8, 0.22, 18, 72]}>
				<MeshWobbleMaterial color="#a855f7" factor={0.35} speed={1.8} roughness={0.22} />
			</Torus>
		</Float>
	);
}

function SphereCluster() {
	const groupRef = useRef();

	useFrame((state, delta) => {
		if (!groupRef.current) return;
		groupRef.current.rotation.y += delta * 0.2;
		groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
	});

	return (
		<group ref={groupRef}>
			<Float speed={1.4} rotationIntensity={0.45} floatIntensity={0.55}>
				<mesh position={[0, 0, 0]} scale={0.72}>
					<Sphere args={[0.55, 32, 32]}>
						<meshStandardMaterial color="#22d3ee" emissive="#0ea5e9" emissiveIntensity={0.35} />
					</Sphere>
				</mesh>
			</Float>
			<mesh position={[0.7, 0.35, 0.15]} scale={0.28}>
				<Sphere args={[0.5, 24, 24]}>
					<meshStandardMaterial color="#60a5fa" transparent opacity={0.82} />
				</Sphere>
			</mesh>
			<mesh position={[-0.62, 0.15, 0.35]} scale={0.22}>
				<Sphere args={[0.5, 24, 24]}>
					<meshStandardMaterial color="#a855f7" transparent opacity={0.82} />
				</Sphere>
			</mesh>
			<mesh position={[0.08, -0.62, -0.1]} scale={0.2}>
				<Sphere args={[0.5, 24, 24]}>
					<meshStandardMaterial color="#22d3ee" transparent opacity={0.82} />
				</Sphere>
			</mesh>
		</group>
 	);
}

function MorphingGeometry() {
	const ref = useRef();

	useFrame((state, delta) => {
		if (!ref.current) return;
		ref.current.rotation.x += delta * 0.18;
		ref.current.rotation.y += delta * 0.55;
		ref.current.scale.setScalar(0.96 + Math.sin(state.clock.elapsedTime * 1.8) * 0.05);
	});

	return (
		<Float speed={1.1} rotationIntensity={0.5} floatIntensity={0.55}>
			<mesh ref={ref}>
				<TorusKnot args={[0.55, 0.18, 140, 18]}>
					<MeshDistortMaterial color="#38bdf8" speed={3} distort={0.25} roughness={0.18} />
				</TorusKnot>
			</mesh>
		</Float>
	);
}

const features = [
	{
		title: "AI-Powered Generation",
		description: "Create production-ready 3D assets faster with intelligent generation workflows and smart defaults.",
		icon: RotatingCube,
		accent: "from-blue-500/20 to-cyan-400/10",
	},
	{
		title: "Real-time Preview",
		description: "Inspect lighting, materials, and composition instantly before you publish or export.",
		icon: SpinningTorus,
		accent: "from-purple-500/20 to-blue-500/10",
	},
	{
		title: "Community Driven",
		description: "Share, remix, and discover ideas from a thriving network of creators and studios.",
		icon: SphereCluster,
		accent: "from-cyan-400/20 to-purple-500/10",
	},
	{
		title: "Export Anywhere",
		description: "Move from prototype to deployment with flexible formats built for every destination.",
		icon: MorphingGeometry,
		accent: "from-slate-200/10 to-blue-500/10",
	},
];

function FeatureCard({ feature, index }) {
	const Icon = feature.icon;

	return (
		<motion.article
			initial={{ opacity: 0, y: 28 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.25 }}
			transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
			whileHover={{ y: -12 }}
			className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/6 shadow-2xl shadow-slate-950/25 backdrop-blur-deep"
		>
			<div className={`relative h-64 bg-gradient-to-br ${feature.accent} p-4`}>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_38%)]" />
				<div className="relative z-10 h-full overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-950/40">
					<Canvas camera={{ position: [0, 0, 3.2], fov: 45 }} gl={{ antialias: true, alpha: true }}>
						<ambientLight intensity={0.9} color="#c084fc" />
						<pointLight position={[2.5, 2, 3]} intensity={1.8} color="#22d3ee" />
						<pointLight position={[-2.5, -1.5, 2]} intensity={1.1} color="#3b82f6" />
						<Icon />
						<Sparkles count={34} scale={2.5} size={2.4} speed={0.45} color="#dbeafe" opacity={0.6} />
					</Canvas>
				</div>
			</div>

			<div className="space-y-3 px-6 py-6">
				<h3 className="text-xl font-semibold text-white">{feature.title}</h3>
				<p className="text-sm leading-6 text-slate-300">{feature.description}</p>
			</div>
		</motion.article>
	);
}

export default function FeaturesSection() {
	return (
		<section className="mx-auto max-w-7xl px-6 py-20">
			<motion.div
				initial={{ opacity: 0, y: 18 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.5 }}
				className="mb-10 max-w-3xl"
			>
				<p className="text-sm uppercase tracking-[0.35em] text-cyan-300/75">Platform features</p>
				<h2 className="mt-3 font-display text-3xl font-semibold text-white md:text-5xl">
					Everything you need to build, preview, and share 3D experiences.
				</h2>
			</motion.div>

			<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
				{features.map((feature, index) => (
					<FeatureCard key={feature.title} feature={feature} index={index} />
				))}
			</div>
		</section>
	);
}
