import { SubHeader } from "@/components/sub-header";
import { Stack } from "expo-router";

export default function StudentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="attendance/[id]"
        options={{
          headerShown: true,
          title: "Attendance Details",
          header: ({ options }) => <SubHeader title={options.title} />,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          title: "Account Settings",
          header: ({ options }) => <SubHeader title={options.title} />,
        }}
      />
    </Stack>
  );
}
