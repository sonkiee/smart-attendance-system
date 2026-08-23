import {
  fetchHistory,
  fetchSessionById,
  fetchSessionByIdStudent,
  fetchSessions,
  fetchSessionsLecturer,
  prefetchUser,
} from "@/service";
import { useAuthStore } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["profile"],
    queryFn: prefetchUser,
    enabled: !!token,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useFetchSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useFetchSessionsLecturer = () => {
  return useQuery({
    queryKey: ["sessions", "lecturer"],
    queryFn: fetchSessionsLecturer,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSessionById = (sessionId: string) => {
  return useQuery({
    queryKey: ["sessions", sessionId],
    queryFn: () => fetchSessionById(sessionId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSessionByIdStudent = (sessionId: string) => {
  return useQuery({
    queryKey: ["sessions", sessionId],
    queryFn: () => fetchSessionByIdStudent(sessionId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useFetchHistory = () => {
  return useQuery({
    queryKey: ["history"],
    queryFn: fetchHistory,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
