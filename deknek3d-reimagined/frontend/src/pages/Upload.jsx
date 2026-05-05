import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import MultiStepUploadForm from "../components/upload/MultiStepUploadForm";

export default function Upload() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Upload Your 3D Model</h1>
          <p className="mt-2 text-slate-300">Share your creation with the community</p>
        </div>
        <MultiStepUploadForm />
      </div>
    </DashboardLayout>
  );
}
