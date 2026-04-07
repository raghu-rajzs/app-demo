import React, { useState } from "react";
import { Button } from "./ui/button";
import { X, MapPin } from "lucide-react";

interface AddPlotWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onMappingComplete?: (data: any) => void;
  initialData?: any;
  selectedRegion?: string;
}

export function AddPlotWizard({
  isOpen,
  onClose,
  onMappingComplete,
  initialData,
  selectedRegion = "all",
}: AddPlotWizardProps) {
  if (!isOpen) return null;

  const handleCompleteMapping = () => {
    if (onMappingComplete) {
      onMappingComplete({
        mappingComplete: true,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex justify-between items-center">
        <div className="flex-1">
          <h2 className="text-lg font-bold leading-none">Map Field</h2>
          <p className="text-xs mt-1 text-white/80">
            Step 1 of 2 - Field Mapping
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition"
        >
          <X size={24} />
        </button>
      </div>

      {/* Satellite Map with Drawing Tools */}
      <div className="relative w-full h-full flex-1 bg-slate-200 overflow-hidden">
        {/* Satellite Image Background */}
        <div
          className="absolute inset-x-0 top-0 bottom-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1722082840106-c6508ee966ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBhZ3JpY3VsdHVyYWwlMjBwbG90c3xlbnwxfHx8fDE3NjUzNjc2NDB8MA&ixlib=rb-4.1.0&q=80&w=1080)",
          }}
        />

        {/* SVG Overlay for Field Outlines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Example field outlines */}
          <rect
            x="50"
            y="100"
            width="120"
            height="90"
            fill="rgba(59, 130, 246, 0.15)"
            stroke="#3B82F6"
            strokeWidth="2.5"
          />
          <rect
            x="240"
            y="90"
            width="100"
            height="100"
            fill="rgba(59, 130, 246, 0.15)"
            stroke="#3B82F6"
            strokeWidth="2.5"
          />
          <rect
            x="100"
            y="250"
            width="150"
            height="100"
            fill="rgba(59, 130, 246, 0.15)"
            stroke="#3B82F6"
            strokeWidth="2.5"
          />
          <polygon
            points="350,100 420,80 440,160 380,180"
            fill="rgba(59, 130, 246, 0.15)"
            stroke="#3B82F6"
            strokeWidth="2.5"
          />
        </svg>

        {/* Top Left - Instructions */}
        <div className="absolute top-4 left-4 right-4 z-10 max-w-sm">
          <div className="relative bg-white rounded-lg shadow-lg">
            <div className="p-4">
              <h3 className="font-bold text-slate-900 mb-2">
                Draw Field Boundary
              </h3>
              <p className="text-sm text-slate-600">
                Use the tools below to mark your field boundary on the satellite
                map
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Right - Drawing Tools */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-white hover:bg-slate-100 shadow-xl border-2 border-slate-300 transition-all"
            title="Auto-detect field boundary"
          >
            <MapPin className="h-6 w-6 text-[#4CAF50]" />
          </Button>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-white hover:bg-slate-100 shadow-xl border-2 border-slate-300 transition-all"
            title="Draw field manually"
          >
            <svg
              className="h-6 w-6 text-[#4CAF50]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 12 3 20 20 20 20 3 11 3" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Footer with Actions */}
      <div className="px-4 py-3 border-t bg-slate-50 flex gap-2 justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="outline" onClick={handleCompleteMapping}>
          Skip Measurement
        </Button>
        <Button
          onClick={handleCompleteMapping}
          className="bg-[rgb(76,175,80)] hover:bg-[rgb(60,150,60)]"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
}
