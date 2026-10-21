import {
  closeSession,
  startSession,
  manualMarkAttendance,
  toggleRepMarking,
} from "@/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCloseSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: closeSession,
    onSuccess: (_, sessionId) => {
      // Invalidate query cache to trigger automatic refetches
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["sessions", sessionId] });
      queryClient.invalidateQueries({
        queryKey: ["sessions", sessionId, "students"],
      });
    },
    onError: (error) => {
      console.error("Close session failed:", error);
    },
  });
};

export const useStartSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startSession,
    onSuccess: () => {
      // Invalidate query cache to trigger automatic refetches
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
    onError: (error) => {
      console.error("Start session failed:", error);
    },
  });
};

export const useManualMarkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: manualMarkAttendance,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sessions", variables.sessionId, "students"],
      });
      queryClient.invalidateQueries({
        queryKey: ["sessions", variables.sessionId],
      });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
    onError: (error) => {
      console.error("Manual mark failed:", error);
    },
  });
};

export const useToggleRepMarking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleRepMarking,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sessions", variables.sessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["sessions", variables.sessionId, "students"],
      });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (error) => {
      console.error("Toggle rep marking failed:", error);
    },
  });
};
