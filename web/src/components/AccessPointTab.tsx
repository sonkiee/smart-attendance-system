import React, { useState } from "react";
import {
  ShieldCheck,
  GraduationCap,
  Users,
  Copy,
  Check,
  Smartphone,
  Globe,
  Database,
  Zap,
} from "lucide-react";

export const AccessPointTab: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestSignin = async (type: "student" | "lecturer") => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const endpoint =
        type === "student"
          ? "http://localhost:3000/api/auth/student/signin"
          : "http://localhost:3000/api/auth/lecturer/signin";

      const body =
        type === "student"
          ? { matricNumber: "csc/2020/001", password: "Password123!" }
          : { staffNumber: "L123", password: "Password123!" };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setTestResult({
        status: res.status,
        success: res.ok,
        data,
      });
    } catch (err: any) {
      setTestResult({
        status: "Error",
        success: false,
        error: err.message,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Evaluation Access Point & Multi-User Architecture
        </h1>
        <p className="text-sm text-gray-500">
          Project demonstration panel verifying the 3 distinct system personas (Students, Lecturers, Administrators).
        </p>
      </div>

      {/* 3 User Types Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Student Card */}
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-xs relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#004ac6] flex items-center justify-center mb-3">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            Persona 1: Student
          </span>
          <h3 className="font-bold text-gray-900 mt-2 text-base">Mobile Mobile Application</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Uses high-accuracy GPS geofencing, hardware device biometric verification (Fingerprint / FaceID), and numeric session codes to verify physical presence.
          </p>

          <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-mono space-y-1.5 bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Matric:</span>
              <span className="font-bold text-gray-800">csc/2020/001</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Password:</span>
              <span className="font-bold text-gray-800">Password123!</span>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard("csc/2020/001", "student-matric")}
            className="mt-3 w-full flex items-center justify-center space-x-1 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            {copiedKey === "student-matric" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === "student-matric" ? "Copied Matric" : "Copy Student Matric"}</span>
          </button>
        </div>

        {/* Lecturer Card */}
        <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-xs relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#006c4a] flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#006c4a] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Persona 2: Lecturer
          </span>
          <h3 className="font-bold text-gray-900 mt-2 text-base">Mobile Instructor App</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Creates geofenced attendance sessions, monitors real-time roll call polling, delegates attendance to Course Reps, and exports reports as CSV/Excel.
          </p>

          <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-mono space-y-1.5 bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Staff ID:</span>
              <span className="font-bold text-gray-800">L123</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Password:</span>
              <span className="font-bold text-gray-800">Password123!</span>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard("L123", "lecturer-staff")}
            className="mt-3 w-full flex items-center justify-center space-x-1 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            {copiedKey === "lecturer-staff" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === "lecturer-staff" ? "Copied Staff ID" : "Copy Staff Number"}</span>
          </button>
        </div>

        {/* Administrator Card */}
        <div className="bg-white rounded-xl border border-purple-200 p-5 shadow-xs relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
            Persona 3: Administrator
          </span>
          <h3 className="font-bold text-gray-900 mt-2 text-base">Web Control Portal (Here)</h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Manages course curriculum, assigns instructors, configures campus venue GPS boundaries, unbinds hardware devices, and audits system integrity.
          </p>

          <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-mono space-y-1.5 bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Admin Email:</span>
              <span className="font-bold text-gray-800">admin@attendance.com</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Password:</span>
              <span className="font-bold text-gray-800">Password123!</span>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard("admin@attendance.com", "admin-email")}
            className="mt-3 w-full flex items-center justify-center space-x-1 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            {copiedKey === "admin-email" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === "admin-email" ? "Copied Admin" : "Copy Admin Email"}</span>
          </button>
        </div>
      </div>

      {/* Live API Tester / Demonstration Sandbox */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-[#004ac6]" />
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Interactive Backend API Sandbox
              </h2>
              <p className="text-xs text-gray-500">
                Test live authentication tokens directly against the Express 5 + PostgreSQL backend
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded border border-gray-200">
            http://localhost:3000/api
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Simulate Student Signin</h4>
              <p className="text-xs text-gray-500 mt-1">
                Authenticates Jane Smith (<code>csc/2020/001</code>) and retrieves JWT bearer token.
              </p>
            </div>
            <button
              onClick={() => handleTestSignin("student")}
              disabled={isTesting}
              className="mt-4 bg-[#004ac6] text-white py-2 px-4 rounded-lg text-xs font-semibold hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
            >
              {isTesting ? "Executing..." : "POST /api/auth/student/signin"}
            </button>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Simulate Lecturer Signin</h4>
              <p className="text-xs text-gray-500 mt-1">
                Authenticates Dr. John Doe (<code>L123</code>) and returns lecturer security scope.
              </p>
            </div>
            <button
              onClick={() => handleTestSignin("lecturer")}
              disabled={isTesting}
              className="mt-4 bg-[#006c4a] text-white py-2 px-4 rounded-lg text-xs font-semibold hover:bg-emerald-800 transition cursor-pointer disabled:opacity-50"
            >
              {isTesting ? "Executing..." : "POST /api/auth/lecturer/signin"}
            </button>
          </div>
        </div>

        {/* Response Inspector */}
        {testResult && (
          <div className="mt-4 p-4 rounded-lg bg-gray-900 text-gray-100 font-mono text-xs overflow-x-auto border border-gray-800">
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-gray-800 text-[11px]">
              <span className={testResult.success ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                HTTP {testResult.status} {testResult.success ? "OK" : "FAILED"}
              </span>
              <span className="text-gray-400">Response Payload</span>
            </div>
            <pre>{JSON.stringify(testResult.data || testResult.error, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* System Architecture Flow Diagram */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-gray-900 mb-2">Project Architecture Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="p-4 rounded-lg border border-gray-100 bg-blue-50/30">
            <div className="flex items-center space-x-2 font-bold text-[#004ac6] mb-1">
              <Smartphone className="w-4 h-4" />
              <span>Mobile Client Tier</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              React Native with Expo Router. Coordinates GPS coordinates via <code>expo-location</code>, enforces biometric security via <code>LocalAuthentication</code>, and caches live queries via TanStack React Query.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-gray-100 bg-emerald-50/30">
            <div className="flex items-center space-x-2 font-bold text-[#006c4a] mb-1">
              <Globe className="w-4 h-4" />
              <span>Web Administration Tier</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              React 19 with Vite & Tailwind CSS. Provides centralized dashboard for curriculum allocation, academic staff onboarding, device binding management, and geofence configuration.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-gray-100 bg-purple-50/30">
            <div className="flex items-center space-x-2 font-bold text-purple-700 mb-1">
              <Database className="w-4 h-4" />
              <span>Backend & Database Tier</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Express 5 REST API running Drizzle ORM on PostgreSQL. Computes the Haversine distance formula, generates 4-digit codes, and updates attendance roll calls in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
