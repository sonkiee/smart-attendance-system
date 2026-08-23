import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface SummaryCardProps {
  session: any;
  joinedCount: number;
  totalCount: number;
  attendanceRate: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: any) => void;
}

export const SummaryCard = ({
  session,
  joinedCount,
  totalCount,
  attendanceRate,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}: SummaryCardProps) => {
  // Resolve properties based on the live API response structure
  const isActive = session.status === "active";
  const courseRepEnabled = session.allowRepMarking;
  const venueName =
    session.venueName ||
    (typeof session.venue === "object" ? session.venue?.name : session.venue) ||
    "Unknown Venue";
  const radius =
    (typeof session.venue === "object" ? session.venue?.radius : session.radius) || 50;

  const pendingCount = totalCount - joinedCount;

  // Calculate duration in minutes from startTime and endTime (e.g. "17:38:13" and "20:38:13")
  const getDurationInMinutes = (startStr?: string, endStr?: string) => {
    if (!startStr || !endStr) return 0;
    const [sh, sm] = startStr.split(":").map(Number);
    const [eh, em] = endStr.split(":").map(Number);
    if (isNaN(sh) || isNaN(eh)) return 0;
    const startMins = sh * 60 + (sm || 0);
    const endMins = eh * 60 + (em || 0);
    return endMins - startMins;
  };
  const duration =
    session.duration || getDurationInMinutes(session.startTime, session.endTime) || 180;

  return (
    <View style={styles.headerContainer}>
      {/* Session Detail Summary Card */}
      <View style={[styles.summaryCard, Theme.shadows.soft]}>
        <View style={styles.cardDecorativeCircle} />

        <View style={styles.rowBetween}>
          <Text style={[styles.courseTitle, Theme.typography.headlineMd]}>
            {session.courseTitle}
          </Text>

          <View style={styles.badgesWrapper}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isActive
                    ? Theme.colors.secondaryContainer + "15"
                    : Theme.colors.outlineVariant + "30",
                  borderColor: isActive
                    ? Theme.colors.secondary + "30"
                    : Theme.colors.outline + "30",
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isActive
                      ? Theme.colors.secondary
                      : Theme.colors.outline,
                  },
                ]}
              />
              <Text
                style={[
                  styles.statusBadgeText,
                  Theme.typography.labelMd,
                  {
                    color: isActive ? Theme.colors.secondary : Theme.colors.outline,
                  },
                ]}
              >
                {isActive ? "LIVE" : "ENDED"}
              </Text>
            </View>

            {courseRepEnabled && (
              <View style={styles.repBadge}>
                <Ionicons name="people" size={12} color={Theme.colors.primary} />
                <Text style={[styles.repBadgeText, Theme.typography.labelMd]}>
                  REP ACTIVE
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statLabel, Theme.typography.labelMd]}>
              JOINED
            </Text>
            <Text style={[styles.statValue, Theme.typography.headlineMd]}>
              {joinedCount} / {totalCount}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statLabel, Theme.typography.labelMd]}>
              RATE
            </Text>
            <Text
              style={[
                styles.statValue,
                Theme.typography.headlineMd,
                { color: Theme.colors.secondary },
              ]}
            >
              {attendanceRate}%
            </Text>
          </View>
        </View>

        {/* Metadata Details */}
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <View style={styles.metaIconWrapper}>
              <Ionicons name="location" size={16} color={Theme.colors.primary} />
            </View>
            <Text style={[styles.metaText, Theme.typography.bodyMd]}>
              {venueName}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <View style={styles.metaIconWrapper}>
              <Ionicons name="resize" size={16} color={Theme.colors.primary} />
            </View>
            <Text style={[styles.metaText, Theme.typography.bodyMd]}>
              Geofence Radius: {radius}m
            </Text>
          </View>
          <View style={styles.metaItem}>
            <View style={styles.metaIconWrapper}>
              <Ionicons name="hourglass" size={16} color={Theme.colors.primary} />
            </View>
            <Text style={[styles.metaText, Theme.typography.bodyMd]}>
              Session Duration: {duration} mins
            </Text>
          </View>
        </View>
      </View>

      {/* Roll Call Title Header */}
      <View style={styles.searchHeader}>
        <Text style={[styles.rollCallTitle, Theme.typography.headlineMd]}>
          Roll Call Sheet
        </Text>
      </View>

      {/* Premium Search Bar with Text Clear Action */}
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
          <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color={Theme.colors.outline} />
          </TouchableOpacity>
        )}
      </View>

      {/* UX Segment Filter Pills (All / Checked In / Waiting) */}
      <View style={styles.filterPillsContainer}>
        <TouchableOpacity
          style={[styles.filterPill, activeFilter === "all" && styles.filterPillActive]}
          onPress={() => setActiveFilter("all")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterPillText,
              activeFilter === "all" && styles.filterPillTextActive,
            ]}
          >
            All ({totalCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterPill,
            activeFilter === "checked" && styles.filterPillActive,
          ]}
          onPress={() => setActiveFilter("checked")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterPillText,
              activeFilter === "checked" && styles.filterPillTextActive,
            ]}
          >
            {isActive ? "Submitted" : "Present"} ({joinedCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterPill,
            activeFilter === "pending" && styles.filterPillActive,
          ]}
          onPress={() => setActiveFilter("pending")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterPillText,
              activeFilter === "pending" && styles.filterPillTextActive,
            ]}
          >
            {isActive ? "Waiting" : "Absent"} ({pendingCount})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
});
