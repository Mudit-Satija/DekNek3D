import React, { useState } from "react";
import GalleryHeader from "../components/gallery/GalleryHeader";
import DashboardLayout from "../components/layout/DashboardLayout";
import ModelGridInfinite from "../components/gallery/ModelGridInfinite";
import CategoryFilterSidebar from "../components/gallery/CategoryFilterSidebar";

export default function Gallery() {
  const [filters, setFilters] = useState([]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GalleryHeader onSearch={(q) => console.log('Search', q)} />
        <div className="flex gap-6">
          <CategoryFilterSidebar onFilterChange={setFilters} />
          <div className="flex-1 rounded-3xl border border-white/10 bg-slate-950/40 p-6 text-slate-300">
            <ModelGridInfinite />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
