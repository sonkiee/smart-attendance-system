import React, { useState } from "react";
import { Shield, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { api } from "../services/api";

interface LoginScreenProps {
  onLoginSuccess: (user: { id: string; email: string; role: string }, token: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await api.adminSignin({
        email: email.trim(),
        password,
      });

      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Invalid administrative credentials. Please verify your email and password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        {/* Institutional Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#004ac6] flex items-center justify-center text-white shadow-sm mb-3">
            <Shield className="w-6 h-6" strokeWidth={2.2} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            ClassAttendance
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Administrative Management Console
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-7 sm:p-8">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-900">
              Sign In
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your credentials to access system records and audit tools.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@attendance.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] transition placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#004ac6] hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 leading-normal">
              Institutional credentials required. Access to this administrative interface is restricted and monitored.
            </p>
          </div>
        </div>

        {/* System copyright footer */}
        <div className="text-center mt-6 text-[11px] text-slate-400">
          &copy; {new Date().getFullYear()} ClassAttendance. All rights reserved.
        </div>
      </div>
    </div>
  );
};
