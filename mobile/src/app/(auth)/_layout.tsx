import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="set-password"
        // options={{
        //   headerShown: true,
        //   headerTransparent: true,
        //   header: () => <SubHeader />,
        // }}
      />
    </Stack>
  );
}
