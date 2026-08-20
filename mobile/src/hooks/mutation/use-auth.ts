import { clockin, lecturerSignin, studentSignin } from "@/service";
import { useAuthStore } from "@/store";
import { useMutation } from "@tanstack/react-query";

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
  return useMutation({
    mutationFn: clockin,
    onSuccess: (data) => {
      console.log("Clock-in successful:", data);
    },
    onError: (error) => {
      console.error("Clock-in failed:", error);
    },
  });
};
