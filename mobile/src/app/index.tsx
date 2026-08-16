import { useAuthStore } from "@/store";
import { Redirect } from "expo-router";

export default function Index() {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn) {
    return <Redirect href="/(auth)" />;
  }

  return <Redirect href={"/(student)/(tabs)/home"} />;

  // Redirect to appropriate portal based on role
  // return user.role === "lecturer" ? (
  //   <Redirect href={"/(lecturer)" as any} />
  // ) : (
  //   <Redirect href={"/(student)/(tabs)/home"} />
  // );
}
