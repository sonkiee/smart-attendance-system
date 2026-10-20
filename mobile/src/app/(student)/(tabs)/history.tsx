import { AttendanceItem } from "@/components/attendance-item";
import Header from "@/components/header";
import { Theme } from "@/constants/theme";
import { useFetchHistory } from "@/hooks/queries/user";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Helper arrays for custom date formatting
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const shortMonths = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Safely formats a date string to the style expected by AttendanceItem (e.g., "Oct 24 • 09:15 AM")
 * avoiding Hermes engine locale formatting bugs in React Native.
 */
const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;

  const month = shortMonths[d.getMonth()];
  const day = d.getDate();
  
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Format hour '0' to '12'
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

  return `${month} ${day} • ${hours}:${minutesStr} ${ampm}`;
};

/**
 * Dynamically assigns an icon based on course code prefix.
 */
const getIconForCourse = (courseCode: string): keyof typeof Ionicons.glyphMap => {
  const code = courseCode?.toUpperCase() || "";
  if (code.startsWith("CSC")) return "terminal-outline";
  if (code.startsWith("MTH")) return "calculator-outline";
  if (code.startsWith("ARC")) return "construct-outline";
  if (code.startsWith("PSY")) return "people-outline";
  return "school-outline"; // Fallback default
};

/**
 * Groups flat history list from API into sections categorized by "Month Year" for SectionList.
 */
const groupHistoryByMonth = (records: any[]) => {
  const groups: { [key: string]: any[] } = {};

  records.forEach((record) => {
    const dateObj = new Date(record.markedAt || record.sessionDate);
    if (isNaN(dateObj.getTime())) return;

    const monthName = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    const monthYear = `${monthName} ${year}`;

    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }

    groups[monthYear].push({
      id: record.sessionId || record.id || Math.random().toString(),
      course: record.courseCode || record.courseTitle || "CSC 401",
      date: formatDate(record.markedAt || `${record.sessionDate}T${record.startTime}`),
      status: record.status || "Present",
      iconName: getIconForCourse(record.courseCode),
    });
  });

  return Object.keys(groups).map((monthYear) => ({
    title: monthYear,
    count: groups[monthYear].length,
    data: groups[monthYear],
  }));
};

export default function StudentHistory() {
  const { data, isPending } = useFetchHistory();

  // Render a clean activity indicator while loading data
  if (isPending) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <Header title="History" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Calculate dynamic stats from fetched API records
  const totalDays = data ? data.length : 0;
  const attendanceRate = (() => {
    if (!data || data.length === 0) return "0%";
    const attended = data.filter(
      (item: any) =>
        item.status?.toLowerCase() === "present" ||
        item.status?.toLowerCase() === "late" ||
        item.status?.toLowerCase() === "unverified"
    ).length;
    return `${Math.round((attended / data.length) * 100)}%`;
  })();

  const sections = data ? groupHistoryByMonth(data) : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Header title="History" />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AttendanceItem
            course={item.course}
            date={item.date}
            status={item.status}
            iconName={item.iconName}
            variant="history"
          />
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.groupHeader}>
            <Text style={[styles.groupTitle, Theme.typography.headlineMd]}>
              {section.title}
            </Text>
            <Text style={[styles.groupSubtitle, Theme.typography.labelMd]}>
              {section.count} records
            </Text>
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={[styles.statLabel, Theme.typography.labelMd]}>
                TOTAL DAYS
              </Text>
              <Text style={[styles.statValue, Theme.typography.headlineLg]}>
                {totalDays}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statLabel, Theme.typography.labelMd]}>
                ATTENDANCE
              </Text>
              <Text
                style={[
                  styles.statValue,
                  Theme.typography.headlineLg,
                  { color: Theme.colors.secondary },
                ]}
              >
                {attendanceRate}
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.loadOlderBtn} activeOpacity={0.7}>
            <Ionicons
              name="filter"
              size={20}
              color={Theme.colors.onSurfaceVariant}
            />
            <Text style={[styles.loadOlderText, Theme.typography.labelMd]}>
              LOAD OLDER RECORDS
            </Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, Theme.typography.bodyMd]}>
              No attendance records found
            </Text>
          </View>
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingTop: Theme.spacing.md,
    paddingBottom: 100,
  },
  statsRow: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  statLabel: {
    color: Theme.colors.onSurfaceVariant,
    fontWeight: "600",
  },
  statValue: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
    marginTop: Theme.spacing.base,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  groupTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "600",
  },
  groupSubtitle: {
    color: Theme.colors.outline,
  },
  loadOlderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.xs,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.full,
    marginVertical: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  loadOlderText: {
    color: Theme.colors.onSurfaceVariant,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.background,
  },
  emptyContainer: {
    padding: Theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: Theme.colors.outline,
    fontWeight: "600",
  },
});
