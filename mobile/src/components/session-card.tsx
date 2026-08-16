import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface SessionCardProps {
  title?: string;
  location?: string;
  time?: string;
  item?: {
    id?: string | number;
    title?: string;
    location?: string;
    time?: string;
  };
  interactive?: boolean;
  rightAction?: "chevron" | "ellipsis" | "none";
  onPress?: () => void;
  onRightActionPress?: () => void;
}

export function SessionCard({
  title,
  location,
  time,
  item,
  interactive = true,
  rightAction = "chevron",
  onPress,
  onRightActionPress,
}: SessionCardProps) {
  const displayTitle = item?.title || title || "CSC 423: Compiler Construction I";
  const displayLocation = item?.location || location || "Hall A2";
  const displayTime = item?.time || time || "10:00 - 12:00";
  const id = item?.id || "1";

  const Container = interactive ? TouchableOpacity : View;

  return (
    <Container
      style={styles.activeClassCard}
      onPress={interactive ? (onPress || (() => router.push(`/(student)/attendance/${id}`))) : undefined}
      activeOpacity={0.8}
    >
      <View style={styles.cardDecorativeCircle} />
      <View style={styles.activeTagRow}>
        <View style={styles.activePill}>
          <Text style={[styles.activePillText, Theme.typography.labelMd]}>
            ACTIVE NOW
          </Text>
        </View>
        {rightAction !== "none" && (
          <TouchableOpacity
            style={styles.moreBtn}
            disabled={!interactive && !onRightActionPress}
            onPress={onRightActionPress}
          >
            <Ionicons
              name={rightAction === "chevron" ? "chevron-forward" : "ellipsis-vertical"}
              size={20}
              color={Theme.colors.outline}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.classTitle, Theme.typography.headlineMd]}>
        {displayTitle}
      </Text>

      <View style={styles.classDetailsGrid}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={20} color={Theme.colors.primary} />
          <Text style={[styles.detailText, Theme.typography.bodyMd]}>
            {displayLocation}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time" size={20} color={Theme.colors.primary} />
          <Text style={[styles.detailText, Theme.typography.bodyMd]}>
            {displayTime}
          </Text>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  activeClassCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    position: "relative",
    overflow: "hidden",
    ...Theme.shadows.soft,
  },
  cardDecorativeCircle: {
    position: "absolute",
    top: -48,
    right: -48,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Theme.colors.primary + "05",
  },
  activeTagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  activePill: {
    backgroundColor: Theme.colors.primary + "15",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.rounded.full,
  },
  activePillText: {
    color: Theme.colors.primary,
    fontWeight: "600",
  },
  moreBtn: {
    padding: Theme.spacing.base,
  },
  classTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
    marginBottom: Theme.spacing.md,
  },
  classDetailsGrid: {
    flexDirection: "row",
    gap: Theme.spacing.lg,
    borderTopWidth: 0.3,
    borderTopColor: Theme.colors.outlineVariant,
    paddingTop: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  detailText: {
    color: Theme.colors.onSurfaceVariant,
  },
});
