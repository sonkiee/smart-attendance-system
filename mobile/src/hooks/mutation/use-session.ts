import { closeSession, startSession } from "@/service";
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
