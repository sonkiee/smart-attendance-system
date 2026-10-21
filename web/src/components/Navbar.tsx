import React from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MapPin,
  KeyRound,
  ShieldCheck,
  Radio,
  LogOut,
} from "lucide-react";

export type ActiveTab = "overview" | "users" | "courses" | "venues" | "access-point";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isServerOnline: boolean;
  refreshAll: () => void;
  adminEmail?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isServerOnline,
  refreshAll,
  adminEmail,
  onLogout,
}) => {
  const tabs = [
    { id: "overview" as ActiveTab, label: "Overview", icon: LayoutDashboard },
    { id: "users" as ActiveTab, label: "User Management", icon: Users },
    { id: "courses" as ActiveTab, label: "Course Management", icon: BookOpen },
    { id: "venues" as ActiveTab, label: "Campus Venues", icon: MapPin },
    { id: "access-point" as ActiveTab, label: "Evaluation Access Point", icon: KeyRound },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#004ac6] flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900 text-lg leading-tight">
                  Geofence Attendance
                </span>
                <span className="bg-blue-50 text-[#004ac6] text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                University Biometric & Geofencing System
              </p>
            </div>
          </div>

          {/* Right Header Status & Admin Pill */}
          <div className="flex items-center space-x-4">
            {/* Live Server Health Indicator */}
            <button
              onClick={refreshAll}
              title="Click to refresh connection and stats"
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border transition cursor-pointer ${
                isServerOnline
                  ? "bg-emerald-50 text-[#006c4a] border-emerald-200 hover:bg-emerald-100"
                  : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
              }`}
            >
              <Radio
                className={`w-3.5 h-3.5 ${
                  isServerOnline ? "text-emerald-600 animate-pulse" : "text-rose-600"
                }`}
              />
              <span>{isServerOnline ? "API Online (Port 3000)" : "API Offline"}</span>
            </button>

            {/* Admin User Chip & Logout */}
            <div className="flex items-center space-x-2.5 pl-2 border-l border-gray-200">
              <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-[#004ac6] font-bold text-sm">
                AD
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800 leading-none">
                  System Admin
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">
                  {adminEmail || "admin@attendance.com"}
                </p>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sign out of Admin Portal"
                  className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-6 overflow-x-auto py-1 border-t border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-3 border-b-2 text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "border-[#004ac6] text-[#004ac6]"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#004ac6]" : "text-gray-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
