import { Theme } from "@/constants/theme";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface EmptyStateProps {
  isLoading?: boolean;
}

export default function EmptyState({ isLoading }: EmptyStateProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => !isLoading && router.push("/(student)/attendance/3")}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color={Theme.colors.outlineVariant} />
      ) : (
        <>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✓</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>All caught up</Text>

            <Text style={styles.description}>
              You have no active classes right now. Enjoy your free time or
              prepare for your next session.
            </Text>
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 32,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    borderColor: Theme.colors.outlineVariant,
    marginBottom: 20,
  },

  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E9",
    marginBottom: 20,
  },

  icon: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2E7D32",
  },

  content: {
    alignItems: "center",
    maxWidth: 320,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#737373",
  },
});
