import { closeSession } from "@/service";
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
    },
    onError: (error) => {
      console.error("Close session failed:", error);
    },
  });
};
