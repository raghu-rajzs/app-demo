import React, { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Analytics } from "./components/Analytics";
import { PlotTracker } from "./components/PlotTracker";
import { Growers } from "./components/Growers";
import { AdvisoryInsights } from "./components/Advisory";
import { Dispatch } from "./components/Dispatch";
import { Battery, Wifi, Signal } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [region, setRegion] = useState("all");
  const [season, setSeason] = useState("current");
  const [role, setRole] = useState("FDO");
  const [advisoryFilter, setAdvisoryFilter] = useState<string | undefined>(
    undefined,
  );
  const [plotAuditFilter, setPlotAuditFilter] = useState<
    "all" | "audited" | "pending"
  >("all");
  const [plotStageFilter, setPlotStageFilter] = useState<string>("all");
  const [plotStatusFilter, setPlotStatusFilter] = useState<string>("all");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Set initial time
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();

    // Update time every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "analytics":
        return (
          <Analytics
            role={role}
            onNavigateToPlots={(
              filter = "all",
              stageFilter = "all",
              statusFilter = "all",
            ) => {
              setPlotAuditFilter(filter);
              setPlotStageFilter(stageFilter);
              setPlotStatusFilter(statusFilter);
              setActiveTab("plots");
            }}
            onNavigateToAdvisory={(filter) => {
              setAdvisoryFilter(filter);
              setActiveTab("advisory");
            }}
            onNavigateToGrowers={() => {
              setActiveTab("growers");
            }}
          />
        );
      case "plots":
        return (
          <PlotTracker
            role={role}
            initialAuditFilter={plotAuditFilter}
            initialStageFilter={plotStageFilter}
            initialStatusFilter={plotStatusFilter}
            selectedRegion={region}
          />
        );
      case "growers":
        return <Growers selectedRegion={region} />;
      case "advisory":
        return (
          <AdvisoryInsights
            initialCategory={advisoryFilter}
            selectedRegion={region}
          />
        );
      case "dispatch":
        return <Dispatch />;
      default:
        return (
          <Analytics
            role={role}
            onNavigateToPlots={(
              filter = "all",
              stageFilter = "all",
              statusFilter = "all",
            ) => {
              setPlotAuditFilter(filter);
              setPlotStageFilter(stageFilter);
              setPlotStatusFilter(statusFilter);
              setActiveTab("plots");
            }}
            onNavigateToAdvisory={(filter) => {
              setAdvisoryFilter(filter);
              setActiveTab("advisory");
            }}
            onNavigateToGrowers={() => {
              setActiveTab("growers");
            }}
          />
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
      {/* Android Phone Frame */}
      <div
        className="relative"
        style={{
          width: "43.8vh",
          maxWidth: "393px",
          height: "95vh",
          maxHeight: "852px",
        }}
      >
        {/* Android screen */}
        <div className="relative w-full h-full bg-white rounded-[2rem] overflow-hidden shadow-2xl border-4 border-slate-800 flex flex-col">
          {/* Android Status Bar */}
          <div className="bg-[#4CAF50] text-white px-4 py-1 flex items-center justify-between text-xs z-50">
            <div className="flex items-center gap-1">
              <span className="font-medium">{currentTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Signal className="h-3 w-3" />
              <Wifi className="h-3 w-3" />
              <Battery className="h-3 w-3" />
            </div>
          </div>

          {/* App Content */}
          <div className="flex-1 overflow-hidden">
            <Layout
              activeTab={activeTab}
              onTabChange={(tab) => {
                if (tab !== "advisory") {
                  setAdvisoryFilter(undefined);
                }
                if (tab !== "plots") {
                  setPlotAuditFilter("all");
                  setPlotStageFilter("all");
                  setPlotStatusFilter("all");
                }
                setActiveTab(tab);
              }}
              region={region}
              season={season}
              onRegionChange={setRegion}
              onSeasonChange={setSeason}
              role={role}
              onRoleChange={setRole}
            >
              {renderContent()}
            </Layout>
          </div>

          {/* Android Navigation Bar */}
          <div className="bg-white px-8 py-2 flex items-center justify-around z-50">
            {/* Back Button */}
            <button className="text-gray-500 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Home Button */}
            <button className="text-gray-500 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            </button>

            {/* Recent Apps Button */}
            <button className="text-gray-500 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
