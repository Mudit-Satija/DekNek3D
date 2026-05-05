import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const DENSITY_COUNTS = {
	low: 900,
	medium: 1800,
	high: 3200,
};

class CenterpieceBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) return this.props.fallback;
		return this.props.children;
	}
}

function CenterpieceModel({ modelUrl, wireframe, colorStart }) {
	const { scene } = useGLTF(modelUrl);
	const groupRef = useRef();
	const clone = useMemo(() => scene.clone(true), [scene]);

	useFrame((state, delta) => {
		if (!groupRef.current) return;
		groupRef.current.rotation.y += delta * 0.16;
		groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
	});

	return (
		<group ref={groupRef} scale={1.05}>
			<primitive object={clone} />
			{wireframe ? (
				<mesh>
					<icosahedronGeometry args={[0.9, 1]} />
					<meshStandardMaterial color={colorStart} wireframe transparent opacity={0.25} />
				</mesh>
			) : null}
		</group>
	);
}

function CenterpieceFallback({ colorStart, colorEnd, wireframe }) {
	const ref = useRef();

	useFrame((state, delta) => {
		if (!ref.current) return;
		ref.current.rotation.y += delta * 0.28;
		ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.14;
	});

	return (
		<group ref={ref}>
			<mesh>
				<icosahedronGeometry args={[0.82, 1]} />
				<meshStandardMaterial
					color={colorStart}
					emissive={colorEnd}
					emissiveIntensity={0.22}
					metalness={0.7}
					roughness={0.2}
					wireframe={wireframe}
				/>
			</mesh>
			<mesh position={[0.78, 0.45, 0.16]} scale={0.45}>
				<octahedronGeometry args={[0.38, 0]} />
				<meshStandardMaterial
					color={colorEnd}
					emissive={colorStart}
					emissiveIntensity={0.14}
					metalness={0.65}
					roughness={0.24}
					wireframe={wireframe}
				/>
			</mesh>
		</group>
	);
}

function ParticleInstancedField({
	count,
	spread,
	colorStart,
	colorEnd,
	particleSize,
	wireframe,
	mouseInfluence,
	driftSpeed,
	rotationSpeed,
	floatStrength,
}) {
	const meshRef = useRef();
	const groupRef = useRef();
	const dummy = useMemo(() => new THREE.Object3D(), []);
	const pointerRef = useRef({ x: 0, y: 0 });

	const particles = useMemo(() => {
		return Array.from({ length: count }, (_, index) => {
			const t = count > 1 ? index / (count - 1) : 0;
			const radius = THREE.MathUtils.lerp(spread * 0.25, spread * 0.5, Math.random());
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
			const baseX = (Math.random() - 0.5) * spread;
			const baseY = (Math.random() - 0.5) * spread;
			const baseZ = (Math.random() - 0.5) * spread;

			return {
				base: [baseX, baseY, baseZ],
				orbitRadius: radius,
				theta,
				phi,
				driftPhase: Math.random() * Math.PI * 2,
				driftRate: THREE.MathUtils.lerp(0.3, 1.0, Math.random()) * driftSpeed,
				spinRate: THREE.MathUtils.lerp(0.12, 0.55, Math.random()) * rotationSpeed,
				size: THREE.MathUtils.lerp(0.45, 1.2, Math.random()),
				mouseWeight: THREE.MathUtils.lerp(0.2, 1, Math.random()) * mouseInfluence,
				tint: t,
			};
		});
	}, [count, driftSpeed, mouseInfluence, rotationSpeed, spread]);

	useEffect(() => {
		const handlePointerMove = (event) => {
			pointerRef.current = {
				x: event.clientX / window.innerWidth - 0.5,
				y: event.clientY / window.innerHeight - 0.5,
			};
		};

		window.addEventListener("pointermove", handlePointerMove, { passive: true });
		return () => window.removeEventListener("pointermove", handlePointerMove);
	}, []);

	useEffect(() => {
		if (!meshRef.current) return;
		const startColor = new THREE.Color(colorStart);
		const endColor = new THREE.Color(colorEnd);
		const colors = new Float32Array(count * 3);

		particles.forEach((particle, index) => {
			const color = startColor.clone().lerp(endColor, particle.tint);
			colors[index * 3] = color.r;
			colors[index * 3 + 1] = color.g;
			colors[index * 3 + 2] = color.b;
		});

		meshRef.current.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
		meshRef.current.instanceColor.needsUpdate = true;
	}, [colorEnd, colorStart, count, particles]);

	useFrame((state, delta) => {
		if (!meshRef.current) return;

		const time = state.clock.elapsedTime;
		const pointer = pointerRef.current;
		const pointerX = pointer.x * 2;
		const pointerY = -pointer.y * 2;

		if (groupRef.current) {
			groupRef.current.rotation.y += delta * 0.035;
			groupRef.current.rotation.x = Math.sin(time * 0.12) * 0.08 + pointerY * 0.05;
			groupRef.current.position.y = Math.sin(time * 0.28) * floatStrength;
		}

		particles.forEach((particle, index) => {
			const [baseX, baseY, baseZ] = particle.base;
			const sway = Math.sin(time * particle.driftRate + particle.driftPhase);
			const bob = Math.cos(time * (particle.driftRate * 0.85) + particle.driftPhase * 1.5);
			const spin = time * particle.spinRate;
			const mouseOffsetX = pointerX * particle.mouseWeight * (0.6 + particle.tint * 0.4);
			const mouseOffsetY = pointerY * particle.mouseWeight * (0.6 + particle.tint * 0.4);

			dummy.position.set(
				baseX + Math.cos(particle.theta + time * 0.12) * particle.orbitRadius * 0.08 + sway * 0.35 + mouseOffsetX,
				baseY + bob * 0.35 + mouseOffsetY + Math.sin(particle.phi + time * 0.08) * 0.1,
				baseZ + Math.sin(particle.theta + time * 0.11) * particle.orbitRadius * 0.06
			);
			dummy.rotation.set(spin * 0.2, spin * 0.8, spin * 0.35);
			const scale = particleSize * particle.size * (1 + Math.sin(time * 0.7 + particle.driftPhase) * 0.08);
			dummy.scale.setScalar(scale);
			dummy.updateMatrix();
			meshRef.current.setMatrixAt(index, dummy.matrix);
		});

		meshRef.current.instanceMatrix.needsUpdate = true;
	});

	return (
		<group ref={groupRef}>
			<instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
				<icosahedronGeometry args={[1, 0]} />
				<meshStandardMaterial
					vertexColors
					transparent
					opacity={0.9}
					depthWrite={false}
					wireframe={wireframe}
					metalness={0.08}
					roughness={0.35}
				/>
			</instancedMesh>
		</group>
	);
}

function SceneLights({ colorStart, colorEnd, glow }) {
	return (
		<>
			<ambientLight intensity={0.55} color={colorStart} />
			<pointLight position={[4, 3, 5]} intensity={glow ? 2.2 : 1.2} color={colorStart} />
			<pointLight position={[-4, -2, -3]} intensity={glow ? 1.2 : 0.7} color={colorEnd} />
			<pointLight position={[0, 0, 6]} intensity={0.8} color="#ffffff" />
		</>
	);
}

export default function ParticleBackground({
	density = "medium",
	colorStart = "#22d3ee",
	colorEnd = "#a855f7",
	wireframe = false,
	overlay = true,
	className = "",
	style,
	centerModelUrl,
	showCenterpiece = true,
	particleSize = 0.03,
	spread = 18,
	mouseInfluence = 0.45,
	driftSpeed = 1,
	rotationSpeed = 1,
	floatStrength = 0.14,
	glow = true,
}) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const count = DENSITY_COUNTS[density] ?? DENSITY_COUNTS.medium;
	const wrapperClassName = [
		overlay ? "absolute inset-0 pointer-events-none" : "relative w-full h-full",
		className,
	].filter(Boolean).join(" ");

	return (
		<div className={wrapperClassName} style={style} aria-hidden="true">
			{mounted ? (
				<Canvas
					className="h-full w-full"
					camera={{ position: [0, 0, 8], fov: 52 }}
					gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
					dpr={[1, 1.5]}
				>
					<SceneLights colorStart={colorStart} colorEnd={colorEnd} glow={glow} />
					<ParticleInstancedField
						count={count}
						spread={spread}
						colorStart={colorStart}
						colorEnd={colorEnd}
						particleSize={particleSize}
						wireframe={wireframe}
						mouseInfluence={mouseInfluence}
						driftSpeed={driftSpeed}
						rotationSpeed={rotationSpeed}
						floatStrength={floatStrength}
					/>
					{showCenterpiece ? (
						<CenterpieceBoundary
							fallback={<CenterpieceFallback colorStart={colorStart} colorEnd={colorEnd} wireframe={wireframe} />}
						>
							<Suspense fallback={<CenterpieceFallback colorStart={colorStart} colorEnd={colorEnd} wireframe={wireframe} />}>
								{centerModelUrl ? (
									<CenterpieceModel modelUrl={centerModelUrl} wireframe={wireframe} colorStart={colorStart} />
								) : (
									<CenterpieceFallback colorStart={colorStart} colorEnd={colorEnd} wireframe={wireframe} />
								)}
							</Suspense>
						</CenterpieceBoundary>
					) : null}
				</Canvas>
			) : null}
		</div>
	);
}
