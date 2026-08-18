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
        name="to-submit"
        options={{
          headerShown: false,
          title: "Verifying",
          presentation: "formSheet",
          sheetAllowedDetents: [0.9],
          sheetGrabberVisible: true,
          sheetInitialDetentIndex: 0,
          header: ({ options }) => <SubHeader isCancel title={options.title} />,
        }}
      />
    </Stack>
  );
}
