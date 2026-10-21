import { api } from "@/lib/api";
import { LecturerSigninSchema, StudentSigninSchema } from "@/schemas";
import { AnyUseSuspenseInfiniteQueryOptions } from "@tanstack/react-query";

type ClockInCredentials = {
  sessionId: string;
  latitude: number;
  longitude: number;
  bleVerified: boolean;
  deviceId: string;
  attendanceCode: string;
};

export const studentSignin = async (
  credentials: StudentSigninSchema,
): Promise<any> => {
  return api.post("/auth/student/signin", {
    matricNumber: credentials.matricNumber,
    password: credentials.password,
  });
};

export const lecturerSignin = async (
  credentials: LecturerSigninSchema,
): Promise<any> => {
  return api.post("/auth/lecturer/signin", {
    staffNumber: credentials.staffNumber,
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

export const prefetchLecturerUser = async (): Promise<any> => {
  return api.get("/lecturers/profile");
};

export const fetchHistory = async (): Promise<any> => {
  return api.get(`/attendance/history`);
};

export const fetchSessions = async (): Promise<any> => {
  return api.get("/sessions/active");
};

export const fetchSessionsLecturer = async (): Promise<any> => {
  return api.get("/sessions/active/lecturer");
};

export const fetchSessionById = async (sessionId: string): Promise<any> => {
  return api.get(`/sessions/${sessionId}`);
};

export const fetchSessionByIdStudent = async (
  sessionId: string,
): Promise<any> => {
  return api.get(`/sessions/${sessionId}/students`);
};

export const closeSession = async (sessionId: string): Promise<any> => {
  return api.post(`/sessions/${sessionId}/close`);
};

export const startSession = async (sessionData: any): Promise<any> => {
  return api.post("/sessions", sessionData);
};

export const fetchCourses = async (): Promise<any> => {
  return api.get("/courses");
};

export const fetchVenues = async (): Promise<any> => {
  return api.get("/venues");
};

export const manualMarkAttendance = async (data: {
  sessionId: string;
  studentId: string;
  status: "present" | "late" | "absent";
}): Promise<any> => {
  return api.post("/attendance/manual", data);
};

export const toggleRepMarking = async (data: {
  sessionId: string;
  allowRepMarking: boolean;
}): Promise<any> => {
  return api.post(`/sessions/${data.sessionId}/toggle-rep-marking`, {
    allowRepMarking: data.allowRepMarking,
  });
};

export const fetchCourseExportCsv = async (courseId: string): Promise<string> => {
  const res = await api.get(`/courses/${courseId}/export`, {
    responseType: "text",
  });
  return typeof res === "string" ? res : (res as any)?.data || String(res);
};
