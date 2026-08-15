import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.onSecondaryContainer,
        tabBarInactiveTintColor: Theme.colors.onSurfaceVariant,
        tabBarActiveBackgroundColor: Theme.colors.secondaryContainer,
        tabBarInactiveBackgroundColor: "transparent",
        // tabBarStyle: {
        //   backgroundColor: Theme.colors.surfaceContainerLowest,
        //   borderTopWidth: 1,
        //   borderTopColor: Theme.colors.outlineVariant,
        //   height: 72,
        //   paddingBottom: 12,
        //   paddingTop: 8,
        //   position: "absolute",
        //   bottom: 0,
        //   left: 0,
        //   right: 0,
        //   ...Theme.shadows.soft,
        // },
        // tabBarItemStyle: {
        //   borderRadius: Theme.rounded.md,
        //   marginVertical: 8,
        //   marginHorizontal: 16,
        //   paddingVertical: 4,
        //   alignItems: "center",
        //   justifyContent: "center",
        // },
        tabBarLabelStyle: {
          // ...Theme.typography.labelMd,
          fontWeight: 700,
          // marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
