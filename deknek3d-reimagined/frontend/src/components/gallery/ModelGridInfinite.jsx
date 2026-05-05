import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModelCard3D from "./ModelCard3D";
import ModelDetailModal from "./ModelDetailModal";

function makeMockItem(i) {
  return {
    id: `m_${i}`,
    title: `Model ${i + 1}`,
    creator: { name: `Creator ${i % 6 + 1}`, avatar: undefined },
    views: Math.floor(Math.random() * 5000),
    likes: Math.floor(Math.random() * 1000),
    downloads: Math.floor(Math.random() * 300),
    modelUrl: null, // add real urls to test GLB previews
    createdAt: Date.now() - i * 1000 * 60 * 60 * 6,
    description: "A sample 3D model preview",
  };
}

export default function ModelGridInfinite() {
  const [items, setItems] = useState(() => Array.from({ length: 12 }).map((_, i) => makeMockItem(i)));
  const [page, setPage] = useState(1);
  const loaderRef = useRef();
  const [modalItem, setModalItem] = useState(null);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // load more
          setItems((prev) => [...prev, ...Array.from({ length: 8 }).map((_, idx) => makeMockItem(prev.length + idx))]);
          setPage((p) => p + 1);
        }
      });
    }, { rootMargin: '200px' });
    if (loaderRef.current) io.observe(loaderRef.current);
    return () => io.disconnect();
  }, []);

  const openModal = useCallback((item) => setModalItem(item), []);
  const closeModal = useCallback(() => setModalItem(null), []);

  return (
    <section>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <AnimatePresence>
          {items.map((it, idx) => (
            <motion.div key={it.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}>
              <ModelCard3D item={it} onOpen={openModal} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div ref={loaderRef} className="mt-8 flex items-center justify-center text-slate-400">Loading more models…</div>

      <ModelDetailModal open={!!modalItem} onClose={closeModal} item={modalItem} />
    </section>
  );
}
