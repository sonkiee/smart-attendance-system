import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, Switch, TouchableOpacity, View } from "react-native";

export interface MenuItemProps {
  label: string;
  description?: string;
  icon: keyof typeof Ionicons.glyphMap;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  isDestructive?: boolean;
}

export function MenuItem({
  label,
  description,
  icon,
  hasSwitch = false,
  switchValue = false,
  onValueChange,
  onPress,
  isDestructive = false,
}: MenuItemProps) {
  const handlePress = () => {
    if (hasSwitch && onValueChange) {
      onValueChange(!switchValue);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={!onPress && !onValueChange}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconBox, isDestructive && styles.destructiveIconBox]}>
          <Ionicons
            name={icon}
            size={20}
            color={isDestructive ? Theme.colors.error : Theme.colors.primary}
          />
        </View>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.rowTitle,
              Theme.typography.bodyLg,
              isDestructive && { color: Theme.colors.error },
            ]}
          >
            {label}
          </Text>
          {description && (
            <Text
              style={[
                styles.rowSubtitle,
                Theme.typography.caption,
                isDestructive && { color: Theme.colors.error + "90" },
              ]}
            >
              {description}
            </Text>
          )}
        </View>
      </View>

      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onValueChange}
          trackColor={{
            false: Theme.colors.surfaceVariant,
            true: Theme.colors.primary,
          }}
          thumbColor="#ffffff"
          pointerEvents="none"
        />
      ) : (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDestructive ? Theme.colors.error : Theme.colors.outline}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Theme.spacing.md,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Theme.rounded.default,
    backgroundColor: Theme.colors.surfaceContainerLow,
    justifyContent: "center",
    alignItems: "center",
  },
  destructiveIconBox: {
    backgroundColor: Theme.colors.errorContainer + "30",
  },
  textContainer: {
    flex: 1,
  },
  rowTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "600",
  },
  rowSubtitle: {
    color: Theme.colors.outline,
    marginTop: 2,
  },
});
