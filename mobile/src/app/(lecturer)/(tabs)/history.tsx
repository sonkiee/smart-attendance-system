import { Theme } from "@/constants/theme";
import { useFetchHistory } from "@/hooks/queries/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LecturerHistory() {
  const router = useRouter();
  const { data: historySessions, isPending } = useFetchHistory();

  const getAttendanceSummary = (item: any) => {
    const present = (item.presentCount || 0) + (item.lateCount || 0);
    const total =
      present + (item.unverifiedCount || 0) + (item.absentCount || 0);
    return `${present}/${total} Present`;
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const monthsShort = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthsShort[d.getMonth()];
    const day = d.getDate();
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${month} ${day} • ${hours}:${minStr} ${ampm}`;
  };

  if (isPending) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={[styles.headerTitle, Theme.typography.headlineMd]}>
            Past Sessions
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, Theme.typography.headlineMd]}>
          Past Sessions
        </Text>
      </View>

      <FlatList
        data={historySessions}
        keyExtractor={(item) => item.sessionId || item.id}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.historyCard, Theme.shadows.soft]}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/(lecturer)/session/[id]",
                params: { id: item.sessionId || item.id },
              })
            }
          >
            {/* Decorative circle matching other cards */}
            <View style={styles.cardDecorativeCircle} />

            <View style={styles.cardHeader}>
              <View style={styles.courseWrapper}>
                <View style={styles.courseIconWrapper}>
                  <Ionicons
                    name="journal-outline"
                    size={16}
                    color={Theme.colors.primary}
                  />
                </View>
                <Text style={[styles.courseCode, Theme.typography.bodyLg]}>
                  {item.courseCode}
                </Text>
              </View>
              <View style={styles.badgesWrapper}>
                <Text style={[styles.summaryText, Theme.typography.labelMd]}>
                  {getAttendanceSummary(item)}
                </Text>
                {item.allowRepMarking && (
                  <View style={styles.repBadge}>
                    <Ionicons
                      name="people"
                      size={10}
                      color={Theme.colors.primary}
                    />
                    <Text style={styles.repBadgeText}>REP</Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={[styles.courseTitle, Theme.typography.bodyMd]}>
              {item.courseTitle}
            </Text>

            <View style={styles.cardFooter}>
              <View style={styles.metaRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={Theme.colors.outline}
                />
                <Text style={[styles.metaText, Theme.typography.caption]}>
                  {item.venueName || item.venue || "Unknown Venue"}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={Theme.colors.outline}
                />
                <Text style={[styles.metaText, Theme.typography.caption]}>
                  {formatDate(`${item.sessionDate}T${item.startTime}`)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="archive-outline"
              size={48}
              color={Theme.colors.outlineVariant}
            />
            <Text style={[styles.emptyText, Theme.typography.bodyMd]}>
              No past sessions found.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.outlineVariant + "30",
  },
  headerTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingTop: Theme.spacing.md,
    paddingBottom: 100,
  },
  historyCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
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
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  courseWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  courseIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.primaryContainer + "10",
    justifyContent: "center",
    alignItems: "center",
  },
  courseCode: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  badgesWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  summaryText: {
    color: Theme.colors.secondary,
    fontWeight: "700",
  },
  repBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: Theme.colors.primaryContainer + "10",
    borderColor: Theme.colors.primary + "20",
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Theme.rounded.full,
  },
  repBadgeText: {
    color: Theme.colors.primary,
    fontWeight: "700",
    fontSize: 9,
  },
  courseTitle: {
    color: Theme.colors.onSurfaceVariant,
    marginTop: Theme.spacing.xs,
    paddingLeft: 32,
    zIndex: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.outlineVariant + "30",
    paddingLeft: 32,
    zIndex: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: Theme.colors.outline,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: Theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    marginTop: 40,
  },
  emptyText: {
    color: Theme.colors.outline,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
