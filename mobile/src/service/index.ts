import { api } from "@/lib/api";
import { AnyUseSuspenseInfiniteQueryOptions } from "@tanstack/react-query";

type SignInCredentials = {
  id: string;
  password: string;
};

type ClockInCredentials = {
  sessionId: string;
  latitude: number;
  longitude: number;
  bleVerified: boolean;
  deviceId: string;
  attendanceCode: string;
};

export const signin = async (
  credentials: SignInCredentials,
): Promise<AnyUseSuspenseInfiniteQueryOptions> => {
  return api.post("/auth/student/signin", {
    matricNumber: credentials.id,
    password: credentials.password,
  });
};

export const clockin = async (
  credentials: ClockInCredentials,
): Promise<AnyUseSuspenseInfiniteQueryOptions> => {
  return api.post("/attendance/mark", credentials);
};

export const prefetchUser = async (): Promise<any> => {
  return api.get("/students/profile");
};

export const fetchSessions = async (): Promise<any> => {
  return api.get("/sessions/active");
};

export const fetchSessionById = async (sessionId: string): Promise<any> => {
  return api.get(`/sessions/${sessionId}`);
};
