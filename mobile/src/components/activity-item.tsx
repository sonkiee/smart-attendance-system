import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type RecentProps = {
  course: string;
  date: string;
  time: string;
  status: string;
};

export function ActivityItem({ course, date }) {
  return (
    <View style={styles.activityItem}>
      <View style={styles.activityIconBox}>
        <Ionicons name="terminal" size={24} color={Theme.colors.primary} />
      </View>
      <View style={styles.activityMeta}>
        <Text
          style={[
            styles.activityClassName,
            Theme.typography.bodyMd,
            styles.semibold,
          ]}
        >
          {course ?? " CSC 421: OS Lab"}
        </Text>
        <Text style={[styles.activityDate, Theme.typography.caption]}>
          {date ?? " Oct 21 • 11:00 AM"}
        </Text>
      </View>
      <View style={styles.presentBadge}>
        <Text style={[styles.presentText, Theme.typography.labelMd]}>
          PRESENT
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surfaceContainerLow,
    borderRadius: Theme.rounded.md,
    borderWidth: 1,
    borderColor: "transparent",
  },
  activityIconBox: {
    width: 48,
    height: 48,
    backgroundColor: Theme.colors.surfaceContainerHigh,
    borderRadius: Theme.rounded.default,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  activityMeta: {
    flex: 1,
  },
  activityClassName: {
    color: Theme.colors.onSurface,
  },
  activityDate: {
    color: Theme.colors.outline,
    marginTop: 2,
  },
  presentBadge: {
    backgroundColor: Theme.colors.secondary + "15",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.rounded.full,
  },
  presentText: {
    color: Theme.colors.secondary,
    fontWeight: "700",
  },
  semibold: {
    fontWeight: "600",
  },
});
