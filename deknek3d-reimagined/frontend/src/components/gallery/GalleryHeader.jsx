import React, { useState } from "react";
import { Search } from "lucide-react";

export default function GalleryHeader({ onSearch }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");

  return (
    <header className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-r from-slate-900/40 to-slate-950/60 p-8">
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 animate-gradient-x">Explore 3D Models</h1>
        <p className="mt-3 text-sm text-slate-300">Search, filter and discover models from the community.</p>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/3 px-3 py-2 shadow-sm transition md:min-w-[340px]">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/6 text-cyan-300">
              <Search className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && onSearch) onSearch(query); }}
                placeholder="Search models, tags, authors..."
                className="w-full bg-transparent outline-none text-slate-200 placeholder:text-slate-400"
              />
            </div>
            <button onClick={() => onSearch && onSearch(query)} className="rounded-md bg-cyan-500 px-3 py-2 text-sm text-black">Search</button>
          </div>

          <div className="flex items-center gap-3">
            <select className="rounded-md bg-white/5 px-3 py-2 text-sm text-slate-200">
              <option>All categories</option>
              <option>Furniture</option>
              <option>Characters</option>
            </select>
            <select className="rounded-md bg-white/5 px-3 py-2 text-sm text-slate-200">
              <option>Any format</option>
              <option>.glb</option>
              <option>.obj</option>
            </select>
            <select className="rounded-md bg-white/5 px-3 py-2 text-sm text-slate-200">
              <option>Popular</option>
              <option>Recent</option>
              <option>Most Liked</option>
            </select>

            <div className="flex items-center gap-2 rounded-md bg-white/5 p-1">
              <button onClick={() => setView('grid')} className={`p-2 rounded ${view === 'grid' ? 'bg-white/8' : ''}`} aria-label="Grid view">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>
              </button>
              <button onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'bg-white/8' : ''}`} aria-label="List view">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><rect x="3" y="4" width="18" height="3" rx="1"/><rect x="3" y="10.5" width="18" height="3" rx="1"/><rect x="3" y="17" width="18" height="3" rx="1"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
