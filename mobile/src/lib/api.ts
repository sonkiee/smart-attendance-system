import { useAuthStore } from "@/store";
import axios, { create } from "axios";
import { Alert } from "react-native";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.trim() || "http://localhost:3000/api";

export const api = create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach Authorization Bearer Token
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    "Request Config:",
    `${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
  );
  return config;
});

// Response Interceptor: Auto-logout on 401 Unauthorized
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const isAuthRoute = error.config?.url?.includes("/auth/");
    const hadActiveSession = !!useAuthStore.getState().token;

    // Only trigger "Session Expired" alert if the user was authenticated inside the app
    if (error.response?.status === 401 && !isAuthRoute && hadActiveSession) {
      console.warn(
        "API 401 Unauthorized: Logging out user and clearing session.",
      );
      // Clear auth state so navigation guard redirects user to /(auth)
      useAuthStore.getState().logout();

      Alert.alert(
        "Session Expired",
        "Your session has expired or is invalid. Please sign in again.",
        [{ text: "OK" }],
      );
    }

    const apiError = error.response?.data;
    const message =
      apiError?.message ||
      error?.message ||
      "An error occurred. Please try again.";
    console.error("API Error:", message);
    return Promise.reject(new Error(message));
  },
);

export default api;
