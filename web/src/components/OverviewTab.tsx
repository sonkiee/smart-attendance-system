import React from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  MapPin,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Flame,
} from "lucide-react";
import { StatsCard } from "./StatsCard";
import type { AdminStats, SessionRecord } from "../services/api";

interface OverviewTabProps {
  stats: AdminStats | null;
  activeSessions: SessionRecord[];
  onNavigate: (tab: any) => void;
  isLoading: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  activeSessions,
  onNavigate,
  isLoading,
}) => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Dashboard</h1>
          <p className="text-sm text-gray-500">
            Real-time biometric attendance, active lecture geofences, and enrollment metrics.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#006c4a] border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Database Synced
          </span>
        </div>
      </div>

      {/* 4 Essential Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Registered Students"
          value={isLoading ? "..." : stats?.totalStudents ?? 0}
          subtitle="Enrolled across academic departments"
          icon={GraduationCap}
          badge="Active"
          badgeColor="green"
        />
        <StatsCard
          title="Academic Lecturers"
          value={isLoading ? "..." : stats?.totalLecturers ?? 0}
          subtitle="Authorized course instructors"
          icon={Users}
          badge="Staff"
          badgeColor="blue"
        />
        <StatsCard
          title="Active Courses"
          value={isLoading ? "..." : stats?.totalCourses ?? 0}
          subtitle="Undergraduate curriculum units"
          icon={BookOpen}
          badge="Accredited"
          badgeColor="purple"
        />
        <StatsCard
          title="Live Sessions"
          value={isLoading ? "..." : stats?.activeSessions ?? activeSessions.length}
          subtitle="Currently open for geofenced clock-in"
          icon={Flame}
          badge="Active Now"
          badgeColor="amber"
        />
      </div>

      {/* Live Sessions Alert Panel */}
      {activeSessions.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#004ac6]" />
              </span>
              <h2 className="text-base font-bold text-gray-900">
                Ongoing Geofenced Lecture Sessions ({activeSessions.length})
              </h2>
            </div>
            <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2.5 py-1 rounded-md">
              Students Currently Submitting Attendance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSessions.map((session, idx) => (
              <div
                key={session.id || idx}
                className="bg-white rounded-lg border border-blue-200/80 p-4 shadow-2xs hover:border-blue-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-blue-100 text-[#004ac6]">
                      {session.courseCode || "CSC401"}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-1.5 text-sm">
                      {session.courseTitle || "Mobile App Development"}
                    </h3>
                  </div>
                  <span className="text-xs bg-emerald-100 text-[#006c4a] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    LIVE
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{session.venueName || "CS Lab"}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 font-mono text-[#004ac6] font-bold">
                    <span>Code: {session.attendanceCode || "4921"}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {session.startTime?.substring(0, 5) || "09:00"} -{" "}
                      {session.endTime?.substring(0, 5) || "11:00"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-gray-500">Rep Marking:</span>
                    <span className="font-semibold text-gray-800">
                      {session.allowRepMarking ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main 2-Column Split: Recent Activity & Quick Admin Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent System Activity Feed (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#004ac6]" />
              <h2 className="text-base font-bold text-gray-900">Recent Attendance Activity</h2>
            </div>
            <span className="text-xs text-gray-500">Latest biometric & geofence submissions</span>
          </div>

          <div className="mt-4 divide-y divide-gray-100 overflow-x-auto">
            {(!stats?.recentActivity || stats.recentActivity.length === 0) ? (
              <div className="py-8 text-center text-gray-500 text-sm">
                No recent attendance records found.
              </div>
            ) : (
              <table className="min-w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Course</th>
                    <th className="pb-3">Venue</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentActivity.map((rec) => {
                    const isPresent = rec.status === "present";
                    const isLate = rec.status === "late";
                    return (
                      <tr key={rec.id} className="hover:bg-gray-50/70 transition">
                        <td className="py-3 font-medium text-gray-900">
                          <div className="font-semibold">{rec.studentName}</div>
                          <div className="text-[11px] text-gray-500 font-mono">
                            {rec.matricNumber}
                          </div>
                        </td>
                        <td className="py-3 text-gray-700">
                          <span className="font-semibold text-gray-900">{rec.courseCode}</span>
                          <span className="block text-[11px] text-gray-500 truncate max-w-[130px]">
                            {rec.courseTitle}
                          </span>
                        </td>
                        <td className="py-3 text-gray-600">
                          <span className="truncate block max-w-[110px]">{rec.venueName}</span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              isPresent
                                ? "bg-emerald-50 text-[#006c4a] border border-emerald-200"
                                : isLate
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {isPresent && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {rec.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-right text-gray-500 font-mono text-[11px]">
                          {rec.markedAt
                            ? new Date(rec.markedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Admin Actions & Evaluation Shortcuts (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-1">Administrative Shortcuts</h2>
            <p className="text-xs text-gray-500 mb-4">Quickly jump into management functions</p>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate("users")}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition text-left cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#004ac6] flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#004ac6]">
                      Manage User Accounts
                    </p>
                    <p className="text-[11px] text-gray-500">Reset devices, toggle accounts</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#004ac6] group-hover:translate-x-0.5 transition" />
              </button>

              <button
                onClick={() => onNavigate("courses")}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition text-left cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 group-hover:text-purple-700">
                      Course Curriculum
                    </p>
                    <p className="text-[11px] text-gray-500">Allocate lecturers, add units</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-700 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                onClick={() => onNavigate("venues")}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition text-left cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006c4a] flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#006c4a]">
                      Campus Geofences
                    </p>
                    <p className="text-[11px] text-gray-500">Inspect venue GPS & radii</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#006c4a] group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          </div>

          {/* Quick System Integrity Callout */}
          <div className="bg-gray-900 text-white rounded-xl p-5 shadow-xs">
            <div className="flex items-center space-x-2 text-blue-400 mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Security Status</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Anti-proxy enforcement active. Mobile devices verify hardware biometrics and calculate
              distance against venue geofences (Haversine formula).
            </p>
            <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-[11px] text-gray-400">
              <span>Policy: 75% Attendance Exam Clearance</span>
              <span className="text-emerald-400 font-bold">ENFORCED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
