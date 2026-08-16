import { useAuthStore } from "@/store"; // Added useAuthStore
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router"; // Added useRouter, useSegments
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const segments = useSegments(); // Added
  const router = useRouter(); // Added
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn); //Added

  const [loaded, error] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
    "Inter-ExtraBold": Inter_800ExtraBold,
  });

  // Fonts loading effect
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Global Auth Guard Route Redirect effect
  useEffect(() => {
    if (!loaded && !error) return; // Wait until fonts/splash screenare ready

    const inAuthGroup = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuthGroup) {
      // Redirect to the login page if logged out
      router.replace("/(auth)");
    } else if (isLoggedIn && inAuthGroup) {
      // Redirect to student portal if logged in
      router.replace("/(student)/(tabs)/home");
    }
  }, [isLoggedIn, segments, loaded, error, router]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </QueryClientProvider>
  );
}
