import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ListStudentItemProps {
  item: {
    id: string;
    name: string;
    matricNumber: string;
    status: string;
  };
  isActive: boolean;
  handleManualCheck: (studentId: string) => void;
}

export const ListStudentItem = ({
  item,
  isActive,
  handleManualCheck,
}: ListStudentItemProps) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
      case "present":
        return {
          bg: Theme.colors.secondary + "12",
          border: Theme.colors.secondary + "25",
          text: Theme.colors.secondary,
        };
      case "absent":
        return {
          bg: Theme.colors.error + "12",
          border: Theme.colors.error + "25",
          text: Theme.colors.error,
        };
      case "waiting":
      default:
        return {
          bg: "#fff3e0", // Amber fallback
          border: "#ffe0b2",
          text: "#ef6c00",
        };
    }
  };

  const themeStyle = getStatusStyle(item.status);

  return (
    <View style={styles.studentRow}>
      <View style={styles.studentInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name.substring(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={styles.metaInfo}>
          <Text style={[styles.studentName, Theme.typography.bodyLg]}>
            {item.name}
          </Text>
          <Text style={[styles.matricNumber, Theme.typography.caption]}>
            {item.matricNumber}
          </Text>
        </View>
      </View>

      <View style={styles.actionSection}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: themeStyle.bg,
              borderColor: themeStyle.border,
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              Theme.typography.labelMd,
              { color: themeStyle.text },
            ]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>

        {isActive && item.status === "waiting" && (
          <TouchableOpacity
            style={styles.checkBtn}
            onPress={() => handleManualCheck(item.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={14}
              color={Theme.colors.onPrimary}
            />
            <Text style={[styles.checkBtnText, Theme.typography.labelMd]}>
              CHECK IN
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
    ...Theme.shadows.soft,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primaryContainer + "20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.primaryContainer + "40",
  },
  avatarText: {
    color: Theme.colors.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  metaInfo: {
    flex: 1,
    paddingRight: Theme.spacing.xs,
  },
  studentName: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  matricNumber: {
    color: Theme.colors.outline,
    marginTop: 2,
  },
  actionSection: {
    alignItems: "flex-end",
    gap: 6,
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: Theme.rounded.full,
  },
  badgeText: {
    fontWeight: "700",
  },
  checkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.rounded.sm,
  },
  checkBtnText: {
    color: Theme.colors.onPrimary,
    fontWeight: "700",
  },
});
