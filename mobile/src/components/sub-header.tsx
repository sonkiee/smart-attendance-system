import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function SubHeader({ title }: { title?: string }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.header, { paddingTop: insets.top + Theme.spacing.xs }]}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backBtn}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color={Theme.colors.onSurface} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, Theme.typography.headlineMd]}>
        {title || "Class Details"}
      </Text>
      <View style={{ width: 40 }} /> {/* Spacer to center the title */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    // backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.outlineVariant + "30",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceContainerLow,
  },
  headerTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
});
