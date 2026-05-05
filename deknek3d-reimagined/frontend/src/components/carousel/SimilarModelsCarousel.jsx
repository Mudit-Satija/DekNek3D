import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ModelCardCarousel from "./ModelCardCarousel";

// Generate mock similar models
function generateMockModels(count = 8) {
  const modelTitles = [
    "Cyberpunk Robot",
    "Fantasy Wizard Staff",
    "Modern Car Design",
    "Alien Creature",
    "Futuristic Drone",
    "Medieval Castle",
    "Space Station",
    "Steampunk Engine",
  ];

  const creators = [
    "Alex Chen",
    "Morgan Lee",
    "Jordan Davis",
    "Casey Park",
    "Riley Smith",
    "Taylor Brown",
    "Morgan Wright",
    "Casey Anderson",
  ];

  const models = [];
  for (let i = 0; i < count; i++) {
    models.push({
      id: `model-${i}`,
      title: modelTitles[i % modelTitles.length],
      creator: creators[i % creators.length],
      views: Math.floor(Math.random() * 10000) + 1000,
      likes: Math.floor(Math.random() * 2000) + 100,
      modelUrl: `https://models.readyplayer.me/63a8c9e50eef98c5f0f2cc68.glb`,
    });
  }
  return models;
}

export default function SimilarModelsCarousel({ onModelClick }) {
  const [models] = useState(() => generateMockModels(8));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef();
  const containerRef = useRef();

  const itemsPerView = 4;
  const totalItems = models.length;

  // Auto-play carousel
  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalItems);
      }, 5000);
    }

    return () => clearInterval(autoPlayRef.current);
  }, [isPaused, totalItems]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 6000);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 6000);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 6000);
  };

  // Calculate visible items (with looping)
  const getVisibleModels = () => {
    const visible = [];
    for (let i = 0; i < itemsPerView; i++) {
      visible.push(models[(currentIndex + i) % totalItems]);
    }
    return visible;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg bg-white/5 border border-white/10 p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-white mb-2">Similar Models</h3>
        <p className="text-sm text-slate-400">Explore other models you might like</p>
      </div>

      {/* Carousel Container */}
      <motion.div
        onHoverStart={() => setIsPaused(true)}
        onHoverEnd={() => setIsPaused(false)}
        ref={containerRef}
        className="relative group"
      >
        {/* Cards */}
        <div className="overflow-hidden rounded-lg">
          <motion.div
            className="flex gap-4"
            animate={{ x: 0 }}
            initial={{ x: 0 }}
            key={`carousel-${currentIndex}`}
          >
            <AnimatePresence mode="wait">
              {getVisibleModels().map((model, idx) => (
                <motion.div
                  key={`${model.id}-${currentIndex}-${idx}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                >
                  <ModelCardCarousel
                    {...model}
                    onClick={() => onModelClick?.(model.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrev}
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={24} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={24} />
        </motion.button>

        {/* Pause Indicator */}
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 right-2 px-2 py-1 rounded bg-white/10 text-xs text-slate-300 backdrop-blur-sm"
          >
            Paused
          </motion.div>
        )}
      </motion.div>

      {/* Dot Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-2"
      >
        {Array.from({ length: totalItems }).map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleDotClick(idx)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`rounded-full transition-all ${
              idx === currentIndex
                ? "bg-cyan-400 w-3 h-3"
                : "bg-white/20 w-2 h-2 hover:bg-white/40"
            }`}
          />
        ))}
      </motion.div>

      {/* Info Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-between text-xs text-slate-500"
      >
        <div>
          {currentIndex + 1} - {Math.min(currentIndex + itemsPerView, totalItems)} of {totalItems}
        </div>
        <div>
          {!isPaused && <span className="text-cyan-400">● Auto-playing</span>}
        </div>
      </motion.div>
    </motion.div>
  );
}
