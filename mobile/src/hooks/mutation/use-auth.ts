import { clockin, signin } from "@/service";
import { useAuthStore } from "@/store";
import { useMutation } from "@tanstack/react-query";

export const useSignin = () => {
  return useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      // Handle successful signin, e.g., store token, redirect, etc.
      console.log("Signin successful:", data);
      useAuthStore.getState().setToken(data.token);
    },
    onError: (error) => {
      // Handle signin error, e.g., show error message
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
