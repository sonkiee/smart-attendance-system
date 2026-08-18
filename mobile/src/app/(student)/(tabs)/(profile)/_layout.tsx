import { SubHeader } from "@/components/sub-header";
import { Stack } from "expo-router";

export default function PorfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          title: "Account Settings",
          header: ({ options }) => <SubHeader title={options.title} />,
        }}
      />
      <Stack.Screen
        name="change-pin"
        options={{
          headerShown: true,
          title: "Change Security PIN",
          header: ({ options }) => <SubHeader title={options.title} />,
        }}
      />
      <Stack.Screen
        name="personal-details"
        options={{
          headerShown: true,
          title: "Personal Details",
          header: ({ options }) => <SubHeader title={options.title} />,
        }}
      />
    </Stack>
  );
}
