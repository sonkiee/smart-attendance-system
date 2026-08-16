import { fetchSessionById, fetchSessions, prefetchUser } from "@/service";
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

export const useSessionById = (sessionId: string) => {
  return useQuery({
    queryKey: ["sessions", sessionId],
    queryFn: () => fetchSessionById(sessionId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
