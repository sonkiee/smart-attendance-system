import { clockin, lecturerSignin, studentSignin } from "@/service";
import { useAuthStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStudentSignin = () => {
  return useMutation({
    mutationFn: studentSignin,
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.token, { role: "student" });
    },
    onError: (error) => {
      console.error("Signin failed:", error);
    },
  });
};

export const useLecturerSignin = () => {
  return useMutation({
    mutationFn: lecturerSignin,
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.token, { role: "admin" });
    },
    onError: (error) => {
      console.error("Signin failed:", error);
    },
  });
};

export const useClockIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clockin,
    onSuccess: (data, variables) => {
      console.log("Clock-in successful:", data);
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
      if (variables?.sessionId) {
        queryClient.invalidateQueries({
          queryKey: ["sessions", variables.sessionId],
        });
        queryClient.invalidateQueries({
          queryKey: ["sessions", variables.sessionId, "students"],
        });
      }
    },
    onError: (error) => {
      console.error("Clock-in failed:", error);
    },
  });
};
