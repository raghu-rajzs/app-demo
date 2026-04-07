import React, { useState, useEffect } from "react";
import {
  Home,
  MapIcon,
  Users,
  ClipboardList,
  CheckSquare,
  BookOpen,
  Truck,
  UserCog,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Button } from "./ui/button";
import {
  Menu,
  User,
  RefreshCw,
  Settings,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  region: string;
  season: string;
  onRegionChange: (region: string) => void;
  onSeasonChange: (season: string) => void;
  role: string;
  onRoleChange: (role: string) => void;
}

const NAV_ITEMS = [
  { label: "Home", icon: Home, id: "analytics" },
  { label: "Growers", icon: Users, id: "growers" },
  { label: "Fields", icon: MapIcon, id: "plots" },
  { label: "Advisory Tasks", icon: ClipboardList, id: "advisory" },
  { label: "Dispatch", icon: Truck, id: "dispatch" },
];

export function Layout({
  children,
  activeTab,
  onTabChange,
  region,
  season,
  onRegionChange,
  onSeasonChange,
  role,
  onRoleChange,
}: LayoutProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hybridType, setHybridType] = useState("all");
  const [filterUnit, setFilterUnit] = useState("all");
  const [filterTerritory, setFilterTerritory] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterBlock, setFilterBlock] = useState("all");
  const [filterVillage, setFilterVillage] = useState("all");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const visibleGeoFilters =
    role === "FDO"
      ? ["village"]
      : role === "Territory Manager"
        ? ["location", "block", "village"]
        : ["unit", "territory", "location", "block", "village"]; // Unit Lead

  const handleRoleChange = (newRole: string) => {
    onRoleChange(newRole);
    const newVisible =
      newRole === "FDO"
        ? ["village"]
        : newRole === "Territory Manager"
          ? ["location", "block", "village"]
          : ["unit", "territory", "location", "block", "village"];
    if (!newVisible.includes("unit")) setFilterUnit("all");
    if (!newVisible.includes("territory")) setFilterTerritory("all");
    if (!newVisible.includes("location")) setFilterLocation("all");
    if (!newVisible.includes("block")) setFilterBlock("all");
    if (!newVisible.includes("village")) setFilterVillage("all");
  };

  const activeFilterCount = [
    hybridType,
    ...(visibleGeoFilters.includes("unit") ? [filterUnit] : []),
    ...(visibleGeoFilters.includes("territory") ? [filterTerritory] : []),
    ...(visibleGeoFilters.includes("location") ? [filterLocation] : []),
    ...(visibleGeoFilters.includes("block") ? [filterBlock] : []),
    ...(visibleGeoFilters.includes("village") ? [filterVillage] : []),
  ].filter((v) => v !== "all").length;

  // Show all nav items in bottom navigation
  const bottomNavItems = NAV_ITEMS;

  return (
    <div className="relative flex flex-col h-full w-full bg-gray-50 overflow-hidden">
      {/* Mobile Top Header */}
      <div className="py-3 bg-[#4CAF50] text-white shadow-md z-20 px-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white truncate">
            Rajiv Sharma
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 ${isOnline ? "bg-white" : "bg-red-100"} px-2 py-1 rounded-full flex-shrink-0`}
            >
              {isOnline ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-[#4CAF50] animate-pulse" />
                  <span className="text-[10px] text-[#4CAF50] font-medium whitespace-nowrap">
                    Online
                  </span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-[10px] text-red-600 font-medium whitespace-nowrap">
                    Offline
                  </span>
                </>
              )}
            </div>
            <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 rounded-full h-9 w-9 flex-shrink-0"
                >
                  <User className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="px-6 py-5 border-b bg-white">
                    <SheetTitle className="text-lg font-semibold text-slate-900">
                      Profile & Settings
                    </SheetTitle>
                    <SheetDescription className="text-sm text-slate-500 mt-1">
                      Manage your profile and preferences
                    </SheetDescription>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 space-y-6">
                    {/* User Profile Card */}
                    <div className="bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-xl p-5 shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-[#4CAF50] font-bold text-2xl shadow-lg ring-4 ring-white/30">
                          JF
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">
                            John Field
                          </h3>
                          <p className="text-sm text-white/90 mt-0.5">{role}</p>
                          <p className="text-xs text-white/75 mt-1">
                            ID: FA-2024-001
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Last Synced Section */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                        Sync Status
                      </h4>
                      <button className="flex items-center justify-between w-full p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200">
                        <div className="text-left">
                          <p className="text-sm font-semibold text-slate-800">
                            Last Synced
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Today, 10:30 AM
                          </p>
                        </div>
                        <RefreshCw className="h-5 w-5 text-[#4CAF50] flex-shrink-0" />
                      </button>
                    </div>

                    {/* Preferences Section */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                        Preferences
                      </h4>
                      <div className="space-y-2">
                        <div className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200">
                          <div className="flex items-center gap-3 mb-3">
                            <UserCog className="h-5 w-5 text-slate-600" />
                            <span className="text-sm font-semibold text-slate-800">
                              Role
                            </span>
                          </div>
                          <Select value={role} onValueChange={handleRoleChange}>
                            <SelectTrigger className="h-10 bg-white border-slate-300 text-slate-800 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FDO">FDO</SelectItem>
                              <SelectItem value="Territory Manager">
                                Territory Manager
                              </SelectItem>
                              <SelectItem value="Unit Lead">
                                Unit Lead
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full justify-between h-12 text-sm font-medium hover:bg-slate-50 border-slate-200"
                        >
                          <div className="flex items-center gap-3">
                            <Settings className="h-5 w-5 text-slate-600" />
                            <span className="text-slate-800">Settings</span>
                          </div>
                        </Button>
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                          <div className="flex items-center gap-2 mb-2">
                            {isOnline ? (
                              <Wifi className="h-5 w-5 text-[#4CAF50]" />
                            ) : (
                              <WifiOff className="h-5 w-5 text-red-500" />
                            )}
                            <span className="text-sm font-semibold text-slate-800">
                              Network Status
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            {isOnline
                              ? "Connected to network"
                              : "No internet connection"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Account Section */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                        Account
                      </h4>
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                      >
                        <svg
                          className="h-5 w-5 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="font-semibold">Logout</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto pb-20 px-1 pt-1 bg-[#f5f5f5] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {children}
      </main>

      {/* Geography + Hybrid Filter Panel */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl max-h-[85vh] p-0 overflow-hidden flex flex-col"
        >
          <div className="px-5 py-4 border-b bg-white flex items-center justify-between flex-shrink-0">
            <SheetTitle className="text-base font-semibold text-slate-900">
              Filters
            </SheetTitle>
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setHybridType("all");
                  setFilterUnit("all");
                  setFilterTerritory("all");
                  setFilterLocation("all");
                  setFilterBlock("all");
                  setFilterVillage("all");
                }}
                className="text-xs text-[#4CAF50] font-semibold"
              >
                Reset All
              </button>
            )}
            <SheetDescription className="sr-only">
              Filter by hybrid type and geography
            </SheetDescription>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {/* Hybrid Type */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Hybrid Type
              </p>
              <Select value={hybridType} onValueChange={setHybridType}>
                <SelectTrigger className="h-10 text-sm border-slate-200">
                  <SelectValue placeholder="All Hybrids" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hybrids</SelectItem>
                  <SelectItem value="dkc-9144">DKC 9144</SelectItem>
                  <SelectItem value="p3396">P 3396</SelectItem>
                  <SelectItem value="nk-6240">NK 6240</SelectItem>
                  <SelectItem value="9001-gold">9001 GOLD</SelectItem>
                  <SelectItem value="pioneer-3396">Pioneer 3396</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Geography Filters */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Geography
              </p>
              <div className="space-y-3">
                {/* Unit — Unit Lead only */}
                {visibleGeoFilters.includes("unit") && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1.5">Unit</p>
                    <Select
                      value={filterUnit}
                      onValueChange={(v) => {
                        setFilterUnit(v);
                        setFilterTerritory("all");
                        setFilterLocation("all");
                        setFilterBlock("all");
                        setFilterVillage("all");
                      }}
                    >
                      <SelectTrigger className="h-10 text-sm border-slate-200">
                        <SelectValue placeholder="All Units" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Units</SelectItem>
                        <SelectItem value="unit-north">Unit North</SelectItem>
                        <SelectItem value="unit-south">Unit South</SelectItem>
                        <SelectItem value="unit-east">Unit East</SelectItem>
                        <SelectItem value="unit-west">Unit West</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Territory — Unit Lead only */}
                {visibleGeoFilters.includes("territory") && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1.5">Territory</p>
                    <Select
                      value={filterTerritory}
                      onValueChange={(v) => {
                        setFilterTerritory(v);
                        setFilterLocation("all");
                        setFilterBlock("all");
                        setFilterVillage("all");
                      }}
                    >
                      <SelectTrigger className="h-10 text-sm border-slate-200">
                        <SelectValue placeholder="All Territories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Territories</SelectItem>
                        <SelectItem value="territory-1">Territory 1</SelectItem>
                        <SelectItem value="territory-2">Territory 2</SelectItem>
                        <SelectItem value="territory-3">Territory 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Location — Territory Manager + Unit Lead */}
                {visibleGeoFilters.includes("location") && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1.5">Location</p>
                    <Select
                      value={filterLocation}
                      onValueChange={(v) => {
                        setFilterLocation(v);
                        setFilterBlock("all");
                        setFilterVillage("all");
                      }}
                    >
                      <SelectTrigger className="h-10 text-sm border-slate-200">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="location-a">Location A</SelectItem>
                        <SelectItem value="location-b">Location B</SelectItem>
                        <SelectItem value="location-c">Location C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Block — Territory Manager + Unit Lead */}
                {visibleGeoFilters.includes("block") && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1.5">Block</p>
                    <Select
                      value={filterBlock}
                      onValueChange={(v) => {
                        setFilterBlock(v);
                        setFilterVillage("all");
                      }}
                    >
                      <SelectTrigger className="h-10 text-sm border-slate-200">
                        <SelectValue placeholder="All Blocks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Blocks</SelectItem>
                        <SelectItem value="block-1">Block 1</SelectItem>
                        <SelectItem value="block-2">Block 2</SelectItem>
                        <SelectItem value="block-3">Block 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Village — all roles */}
                {visibleGeoFilters.includes("village") && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1.5">Village</p>
                    <Select
                      value={filterVillage}
                      onValueChange={setFilterVillage}
                    >
                      <SelectTrigger className="h-10 text-sm border-slate-200">
                        <SelectValue placeholder="All Villages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Villages</SelectItem>
                        <SelectItem value="village-1">Village 1</SelectItem>
                        <SelectItem value="village-2">Village 2</SelectItem>
                        <SelectItem value="village-3">Village 3</SelectItem>
                        <SelectItem value="village-4">Village 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t bg-white flex-shrink-0">
            <Button
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white h-11 text-sm font-semibold"
              onClick={() => setIsFilterOpen(false)}
            >
              Apply Filters
              {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation - All tabs in 1 row */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20 w-full">
        <div className="grid grid-cols-5 gap-0 w-full">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 px-0.5 transition-all duration-200 border-b-2 min-h-[60px] ${
                  isActive
                    ? "text-[#4CAF50] border-[#4CAF50] bg-green-50"
                    : "text-gray-400 border-transparent"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "scale-110" : ""}`} />
                <span className="text-[8px] font-medium whitespace-nowrap mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
