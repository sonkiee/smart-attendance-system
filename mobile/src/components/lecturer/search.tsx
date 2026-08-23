import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <View style={styles.searchBarContainer}>
      <Ionicons
        name="search"
        size={20}
        color={Theme.colors.outline}
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.searchInput, Theme.typography.bodyMd]}
        placeholder="Search name or matric number..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={Theme.colors.outline}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          onPress={() => setSearchQuery("")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="close-circle"
            size={18}
            color={Theme.colors.outline}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.outlineVariant + "30",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingTop: Theme.spacing.md,
    paddingBottom: 60,
  },
  headerContainer: {
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  summaryCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.lg,
    position: "relative",
    overflow: "hidden",
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
  courseTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
    flex: 1,
    paddingRight: Theme.spacing.sm,
  },
  badgesWrapper: {
    alignItems: "flex-end",
    gap: 6,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: Theme.rounded.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontWeight: "700",
  },
  repBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Theme.colors.primaryContainer + "10",
    borderColor: Theme.colors.primary + "20",
    borderWidth: 1,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: Theme.rounded.full,
  },
  repBadgeText: {
    color: Theme.colors.primary,
    fontWeight: "700",
    fontSize: 10,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceContainerLow,
    borderRadius: Theme.rounded.default,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    marginTop: Theme.spacing.md,
    borderColor: Theme.colors.outlineVariant + "20",
    borderWidth: 1,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    color: Theme.colors.outline,
    fontWeight: "700",
  },
  statValue: {
    color: Theme.colors.onSurface,
    fontWeight: "800",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Theme.colors.outlineVariant,
  },
  metaGrid: {
    marginTop: Theme.spacing.md,
    gap: Theme.spacing.xs,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
  },
  metaIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Theme.colors.primaryContainer + "10",
    justifyContent: "center",
    alignItems: "center",
  },
  metaText: {
    color: Theme.colors.onSurfaceVariant,
    fontWeight: "600",
  },
  searchHeader: {
    marginTop: Theme.spacing.md,
  },
  rollCallTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  searchBarContainer: {
    flexDirection: "row",
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    height: 48,
    alignItems: "center",
    paddingHorizontal: Theme.spacing.md,
  },
  searchIcon: {
    marginRight: Theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: Theme.colors.onSurface,
    fontWeight: "500",
  },
  filterPillsContainer: {
    flexDirection: "row",
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.xs,
  },
  filterPill: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.rounded.full,
    backgroundColor: Theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Theme.colors.outlineVariant + "30",
  },
  filterPillActive: {
    backgroundColor: Theme.colors.primaryContainer + "12",
    borderColor: Theme.colors.primary + "30",
  },
  filterPillText: {
    color: Theme.colors.onSurfaceVariant,
    fontWeight: "600",
    fontSize: 12,
  },
  filterPillTextActive: {
    color: Theme.colors.primary,
  },
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Theme.spacing.xl,
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Theme.spacing.md,
  },
  backBtnText: {
    padding: Theme.spacing.md,
  },
  emptyContainer: {
    padding: Theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyText: {
    color: Theme.colors.outline,
    fontWeight: "600",
    textAlign: "center",
  },
});
