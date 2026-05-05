import React, { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html } from "@react-three/drei";
import { motion } from "framer-motion";

const SUPPORTED = [".glb", ".gltf", ".obj", ".fbx"];

function UploadIcon({ size = 72 }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 3) * 0.25;
    ref.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 3)) * 0.08;
  });

  return (
    <Canvas style={{ width: size, height: size }} camera={{ position: [0, 0, 3.5] }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 2, 5]} intensity={0.6} />
      <group ref={ref}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderBufferGeometry args={[0.5, 0.5, 0.08, 32]} />
          <meshStandardMaterial color="#0ea5e9" metalness={0.3} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <coneBufferGeometry args={[0.3, 0.5, 32]} />
          <meshStandardMaterial color="#06b6d4" metalness={0.25} roughness={0.25} />
        </mesh>
      </group>
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  );
}

function ModelPreview({ file }) {
  const urlRef = useRef();
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!file) return;
    const u = URL.createObjectURL(file);
    urlRef.current = u;
    setUrl(u);
    return () => {
      URL.revokeObjectURL(u);
      urlRef.current = null;
    };
  }, [file]);

  if (!file) return null;
  const ext = (file.name || "").split('.').pop()?.toLowerCase();
  if (ext === 'glb' || ext === 'gltf') {
    return (
      <div className="w-full h-64 rounded-xl overflow-hidden border border-white/6 bg-black/40">
        <Canvas camera={{ position: [0, 0, 3] }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 2, 5]} intensity={0.6} />
          <Suspense fallback={<Html center className="text-sm text-slate-300">Loading preview…</Html>}>
            <GLTFModel url={url} />
          </Suspense>
        </Canvas>
      </div>
    );
  }

  // For unsupported previewable formats show filename + placeholder
  return (
    <div className="w-full h-40 rounded-xl border border-white/6 bg-white/3 flex items-center justify-center text-sm text-slate-300">
      Preview not available for {file.name}
    </div>
  );
}

function GLTFModel({ url }) {
  const { scene } = useGLTF(url, true);
  return <primitive object={scene} scale={0.9} position={[0, -0.6, 0]} />;
}

export default function UploadDropzone({ onUpload }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const controllerRef = useRef();

  const handleFiles = useCallback((files) => {
    const f = files[0];
    if (!f) return;
    const ext = (f.name || '').slice(((f.name || '').lastIndexOf('.'))).toLowerCase();
    if (!SUPPORTED.includes(ext)) {
      alert('Unsupported file type. Supported: ' + SUPPORTED.join(', '));
      return;
    }
    setFile(f);
    setSuccess(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dt = e.dataTransfer;
    if (dt && dt.files) handleFiles(dt.files);
  }, [handleFiles]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setDragging(false), []);

  const startUpload = useCallback(() => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setSuccess(false);
    // simulated upload
    controllerRef.current = { cancelled: false };
    const total = 100;
    let p = 0;
    const id = setInterval(() => {
      if (controllerRef.current.cancelled) {
        clearInterval(id);
        setUploading(false);
        setProgress(0);
        return;
      }
      p += Math.random() * 12;
      if (p >= total) {
        p = total;
        clearInterval(id);
        setUploading(false);
        setSuccess(true);
        if (onUpload) onUpload(file);
      }
      setProgress(Math.floor(p));
    }, 250);
  }, [file, onUpload]);

  const cancelUpload = useCallback(() => {
    if (controllerRef.current) controllerRef.current.cancelled = true;
    setUploading(false);
    setProgress(0);
    setFile(null);
    setSuccess(false);
  }, []);

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`rounded-2xl border-2 ${dragging ? 'border-dashed border-cyan-400/80 bg-white/3' : 'border-dashed border-white/10 bg-white/2'} p-6 transition-all`}>
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-lg overflow-hidden">
              <UploadIcon />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">Drag & drop a 3D model here</div>
                <div className="mt-1 text-xs text-slate-300">Supported: <span className="text-slate-200">{SUPPORTED.join(', ')}</span></div>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer rounded-full bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
                  Browse
                  <input type="file" accept={SUPPORTED.join(',')} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                </label>
              </div>
            </div>

            {file && (
              <div className="mt-4">
                <div className="text-xs text-slate-300">Selected: <span className="text-slate-200">{file.name}</span></div>
                <div className="mt-3">
                  <ModelPreview file={file} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="h-2 w-full rounded-full bg-white/6 overflow-hidden">
              <motion.div className="h-full bg-cyan-400" style={{ width: `${progress}%` }} animate={{ width: `${progress}%` }} transition={{ ease: "linear" }} />
            </div>
            <div className="mt-2 text-xs text-slate-300">{uploading ? `${progress}%` : success ? 'Completed' : 'Ready'}</div>
          </div>

          <div className="flex items-center gap-2">
            {!uploading && !success && (
              <button onClick={startUpload} className="rounded-full bg-cyan-500 px-4 py-2 text-sm text-black">Upload</button>
            )}

            {uploading && (
              <button onClick={cancelUpload} className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200">Cancel</button>
            )}

            {success && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                <div className="text-sm text-slate-200">Uploaded</div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
