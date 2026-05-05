import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Check, Share2 } from "lucide-react";

function RotatingAvatar({ textureUrl, modelUrl }) {
  const meshRef = useRef();
  const texture = textureUrl ? useLoader(TextureLoader, textureUrl) : null;

  useFrame((state, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += 0.35 * delta;
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[0.9, 48, 48]} />
      <meshStandardMaterial
        map={texture || null}
        color={texture ? "white" : "#60a5fa"}
        metalness={0.2}
        roughness={0.3}
      />
    </mesh>
  );
}

export default function ProfileHeader({
  profile = {},
  isOwner = false,
}) {
  const {
    coverUrl = "/cover-sample.jpg",
    avatarTexture,
    username = "New Creator",
    verified = false,
    bio = "This creator loves 3D art and interactive experiences.",
    social = [
      { name: "website", url: "#" },
      { name: "twitter", url: "#" },
      { name: "instagram", url: "#" },
    ],
    stats = { followers: 1234, following: 120, models: 42, likes: 9021 },
    achievements = ["Early Adopter", "Top Creator"],
  } = profile;

  const [scrollY, setScrollY] = useState(0);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const parallax = Math.min(scrollY * 0.2, 120);

  const handleFollow = () => setFollowing((s) => !s);
  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      alert("Profile link copied to clipboard");
    } catch (e) {
      // fallback
      prompt("Copy link:", window.location.href);
    }
  };

  return (
    <div className="relative w-full bg-transparent">
      {/* Cover image with parallax translateY */}
      <div className="relative h-72 overflow-hidden rounded-b-2xl">
        <motion.div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${coverUrl})`,
            transform: `translateY(${parallax}px)`,
          }}
        />

        {/* Centered 3D avatar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-40 w-48 h-48">
          <div className="relative w-full h-full rounded-full bg-slate-900/60 shadow-2xl p-1">
            <Canvas shadows camera={{ position: [0, 0, 3], fov: 50 }} className="rounded-full">
              <ambientLight intensity={0.6} />
              <directionalLight position={[2, 2, 2]} intensity={0.8} />
              <RotatingAvatar textureUrl={avatarTexture} />
            </Canvas>
          </div>
        </div>
      </div>

      {/* Info area */}
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-8">
        <div className="flex items-start gap-6">
          <div className="flex-1 pt-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-white">
                {username}
              </h1>
              {verified && (
                <span className="flex items-center gap-1 text-sm text-cyan-400 font-semibold">
                  <Check size={14} /> Verified
                </span>
              )}
            </div>

            <p className="mt-3 text-slate-300 max-w-2xl">
              {bio}
            </p>

            <div className="mt-4 flex items-center gap-3">
              {isOwner && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  className="px-4 py-2 rounded-lg bg-white/5 text-sm font-medium text-slate-200 hover:bg-white/10"
                >
                  Edit profile
                </motion.button>
              )}

              <motion.button
                onClick={handleFollow}
                whileTap={{ scale: 0.96 }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  following ? "bg-white/10 text-slate-200" : "bg-cyan-500 text-black"
                }`}
              >
                {following ? "Following" : "Follow"}
              </motion.button>

              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.03 }}
                className="px-3 py-2 rounded-lg bg-white/5 text-sm font-medium text-slate-200 hover:bg-white/10 flex items-center gap-2"
              >
                <Share2 size={16} /> Share
              </motion.button>
            </div>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              {social.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-full bg-white/5 text-xs text-slate-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.08)] hover:text-white transition-all"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {/* Right column: stats & achievements */}
          <div className="w-64 flex-shrink-0 pt-6">
            <div className="rounded-lg bg-white/5 border border-white/8 p-4 text-center">
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                <div>
                  <div className="text-lg font-bold text-white">{stats.followers.toLocaleString()}</div>
                  <div className="text-xs">Followers</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{stats.following.toLocaleString()}</div>
                  <div className="text-xs">Following</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{stats.models}</div>
                  <div className="text-xs">Models</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{stats.likes.toLocaleString()}</div>
                  <div className="text-xs">Likes</div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {achievements.map((a, i) => (
                <motion.div
                  key={a}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-400/40 p-2 text-sm text-white"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                    {a.split(" ").map((s) => s[0]).slice(0,2).join("")}
                  </div>
                  <div className="flex-1 text-left text-xs font-semibold">{a}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
