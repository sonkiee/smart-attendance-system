import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export interface AttendanceItemProps {
  course?: string;
  date?: string;
  time?: string;
  status?: string; // e.g. "Present", "Absent", "Late"
  iconName?: keyof typeof Ionicons.glyphMap;
  variant?: "home" | "history"; // Defaults to "home"
  item?: {
    id?: string | number;
    name?: string;
    course?: string;
    code?: string;
    date?: string;
    time?: string;
    status?: string;
    iconName?: keyof typeof Ionicons.glyphMap;
  };
}

export function AttendanceItem({
  course,
  date,
  time,
  status = "Present",
  iconName = "terminal-outline",
  variant = "home",
  item,
}: AttendanceItemProps) {
  
  // Resolve values from direct props or nested item object
  const displayCourse = course || item?.course || item?.name || "CSC 421: OS Lab";
  const displayDate = date || item?.date || "Oct 21";
  const displayTime = time || item?.time || "11:00 AM";
  const displayStatus = item?.status || status;
  const displayIcon = item?.iconName || iconName;

  // Helper to color-code status badges dynamically
  const getStatusTheme = (statusText: string) => {
    const textLower = statusText.toLowerCase();
    if (textLower === "absent") {
      return {
        bg: "#ffebee", // Soft red
        text: "#d32f2f",
      };
    }
    if (textLower === "late") {
      return {
        bg: "#fff3e0", // Soft amber
        text: "#ef6c00",
      };
    }
    return {
      bg: Theme.colors.secondary + "10", // Soft secondary color
      text: Theme.colors.secondary,
    };
  };

  const statusTheme = getStatusTheme(displayStatus);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftSection}>
        <View style={styles.iconBox}>
          <Ionicons name={displayIcon} size={22} color={Theme.colors.primary} />
        </View>
        
        <View style={styles.metaContainer}>
          <Text
            style={[
              variant === "history" ? styles.courseBold : styles.courseRegular,
              Theme.typography.bodyLg,
            ]}
            numberOfLines={1}
          >
            {displayCourse}
          </Text>
          
          {/* Subtitle is only rendered in History tab */}
          {variant === "history" && (
            <Text style={[styles.subtitleText, Theme.typography.caption]}>
              {displayDate}
            </Text>
          )}
        </View>
      </View>

      {/* Right side adjusts depending on the variant */}
      {variant === "home" ? (
        <View style={styles.rightHomeSection}>
          <Text style={[styles.timeText, Theme.typography.bodyMd]}>
            {displayTime}
          </Text>
          <Text style={[styles.dateText, Theme.typography.caption]}>
            {displayDate}
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.presentBadge,
            {
              backgroundColor: statusTheme.bg,
              borderColor: statusTheme.text + "20",
            },
          ]}
        >
          <Text
            style={[
              styles.presentText,
              Theme.typography.labelMd,
              { color: statusTheme.text },
            ]}
          >
            {displayStatus.toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.md,
    alignItems: "center",
    justifyContent: "space-between",
    ...Theme.shadows.soft,
    marginBottom: Theme.spacing.xs,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Theme.rounded.default,
    backgroundColor: Theme.colors.primaryContainer + "10",
    justifyContent: "center",
    alignItems: "center",
  },
  metaContainer: {
    flex: 1,
  },
  courseBold: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  courseRegular: {
    color: Theme.colors.onSurface,
    fontWeight: "600",
  },
  subtitleText: {
    color: Theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  rightHomeSection: {
    alignItems: "flex-end",
  },
  timeText: {
    color: Theme.colors.onSurface,
    fontWeight: "600",
  },
  dateText: {
    color: Theme.colors.outline,
    marginTop: 2,
  },
  presentBadge: {
    borderWidth: 1,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.rounded.full,
  },
  presentText: {
    fontWeight: "600",
  },
});
