import {
  fetchCourses,
  fetchHistory,
  fetchSessionById,
  fetchSessionByIdStudent,
  fetchSessions,
  fetchSessionsLecturer,
  fetchVenues,
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
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
    enabled: !!token,
    retry: 1,
  });
};

export const useFetchSessionsLecturer = () => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["sessions", "lecturer"],
    queryFn: fetchSessionsLecturer,
    enabled: !!token,
    retry: 1,
  });
};

export const useSessionById = (sessionId: string) => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["sessions", sessionId],
    queryFn: () => fetchSessionById(sessionId),
    enabled: !!sessionId && sessionId !== "undefined" && !!token,
    retry: 1,
  });
};

export const useSessionByIdStudent = (sessionId: string) => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["sessions", sessionId, "students"],
    queryFn: () => fetchSessionByIdStudent(sessionId),
    enabled: !!sessionId && sessionId !== "undefined" && !!token,
    refetchInterval: (query) => {
      return query.state.data?.status === "active" ? 10000 : false;
    },
    retry: 1,
  });
};

export const useFetchHistory = () => {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["history"],
    queryFn: fetchHistory,
    enabled: !!token,
    retry: 1,
  });
};

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useVenues = () => {
  return useQuery({
    queryKey: ["venues"],
    queryFn: fetchVenues,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
