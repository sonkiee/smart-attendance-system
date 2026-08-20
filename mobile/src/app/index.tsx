import { useAuthStore } from "@/store/auth-store";
import { Redirect } from "expo-router";

export default function Index() {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  // Redirect to appropriate portal based on role
  return user?.role === "admin" ? (
    <Redirect href={"/(lecturer)/(tabs)/home"} />
  ) : (
    <Redirect href={"/(student)/(tabs)/home"} />
  );
}
