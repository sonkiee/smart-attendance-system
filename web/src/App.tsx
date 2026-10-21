import { useEffect, useState, useCallback } from "react";
import { Navbar, type ActiveTab } from "./components/Navbar";
import { OverviewTab } from "./components/OverviewTab";
import { UserManagementTab } from "./components/UserManagementTab";
import { CourseManagementTab } from "./components/CourseManagementTab";
import { VenueManagementTab } from "./components/VenueManagementTab";
import { AccessPointTab } from "./components/AccessPointTab";
import { LoginScreen } from "./components/LoginScreen";
import {
  api,
  type AdminStats,
  type UserRecord,
  type StudentRecord,
  type LecturerRecord,
  type CourseRecord,
  type VenueRecord,
  type SessionRecord,
} from "./services/api";
import { AlertCircle, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";

export function App() {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    role: string;
  } | null>(() => {
    const saved = localStorage.getItem("admin_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [lecturers, setLecturers] = useState<LecturerRecord[]>([]);
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [venues, setVenues] = useState<VenueRecord[]>([]);
  const [activeSessions, setActiveSessions] = useState<SessionRecord[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // Parallel fetch of core admin collections
      const [
        statsData,
        usersData,
        studentsData,
        lecturersData,
        coursesData,
        venuesData,
      ] = await Promise.all([
        api.getStats().catch((err) => {
          console.warn("Could not load stats:", err);
          return null;
        }),
        api.getUsers().catch(() => []),
        api.getStudents().catch(() => []),
        api.getLecturers().catch(() => []),
        api.getCourses().catch(() => []),
        api.getVenues().catch(() => []),
      ]);

      if (statsData) {
        setStats(statsData);
        if (statsData.activeSessionsList) {
          setActiveSessions(statsData.activeSessionsList);
        }
        setIsServerOnline(true);
      } else {
        const healthy = await api.checkHealth();
        setIsServerOnline(healthy);
      }

      setUsers(usersData);
      setStudents(studentsData);
      setLecturers(lecturersData);
      setCourses(coursesData);
      setVenues(venuesData);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setIsServerOnline(false);
      setErrorMessage(
        "Could not connect to the backend server at http://localhost:3000. Please ensure the server is running."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [currentUser, loadData]);

  const handleLoginSuccess = (
    user: { id: string; email: string; role: string },
    token: string
  ) => {
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(user));
    setCurrentUser(user);
    loadData();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setCurrentUser(null);
  };

  // If not logged in as Admin, show the login screen
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-800">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isServerOnline={isServerOnline}
        refreshAll={loadData}
        adminEmail={currentUser.email}
        onLogout={handleLogout}
      />

      {/* Offline Alert Banner */}
      {!isServerOnline && !isLoading && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-amber-800 text-xs sm:text-sm font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Backend Server Offline:</strong>{" "}
              {errorMessage || (
                <>
                  Ensure the Node/Express backend is running on{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono text-xs">
                    http://localhost:3000
                  </code>
                </>
              )}
            </span>
            <button
              onClick={loadData}
              className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-amber-600 text-white hover:bg-amber-700 transition"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && !stats ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-[#004ac6] rounded-full animate-spin" />
            <p className="text-sm font-medium text-gray-500">
              Connecting to campus database &amp; loading records...
            </p>
          </div>
        ) : (
          <>
            {activeTab === "overview" && (
              <OverviewTab
                stats={stats}
                activeSessions={activeSessions}
                onNavigate={(tab) => setActiveTab(tab)}
                isLoading={isLoading}
              />
            )}

            {activeTab === "users" && (
              <UserManagementTab
                users={users}
                students={students}
                lecturers={lecturers}
                onRefresh={loadData}
              />
            )}

            {activeTab === "courses" && (
              <CourseManagementTab
                courses={courses}
                lecturers={lecturers}
                onRefresh={loadData}
              />
            )}

            {activeTab === "venues" && (
              <VenueManagementTab venues={venues} onRefresh={loadData} />
            )}

            {activeTab === "access-point" && <AccessPointTab />}
          </>
        )}
      </main>

      {/* University & Final Year Project Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-[#004ac6] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                CA
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">
                  ClassAttendance Admin Portal &amp; Evaluation Access Point
                </p>
                <p className="text-[11px] text-gray-500">
                  Final-Year Capstone Project &bull; 3 Personas: Administrator (Web), Lecturer (Mobile), Student (Mobile)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006c4a]" />
                Role-Based Access
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#004ac6]" />
                Geofenced Biometrics
              </span>
              <span className="text-[11px] text-gray-400">
                PostgreSQL &bull; Drizzle &bull; Express 5 &bull; React &bull; React Native
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
