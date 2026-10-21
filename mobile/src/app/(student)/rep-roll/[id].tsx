import { ListStudentItem } from "@/components/lecturer/list-student-item";
import { Theme } from "@/constants/theme";
import { useManualMarkAttendance } from "@/hooks/mutation/use-session";
import { useSessionByIdStudent } from "@/hooks/queries/user";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "all" | "checked" | "pending";

export default function CourseRepRollScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: session,
    isLoading,
    isError,
    error,
  } = useSessionByIdStudent(id);

  const manualMarkMutation = useManualMarkAttendance();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const isActive = session?.status === "active";

  const rawStudents = session?.students || [];
  const students = rawStudents.map((s: any) => {
    const firstName = s.firstName || "";
    const lastName = s.lastName || "";
    const name = `${firstName} ${lastName}`.trim() || "Unknown Student";

    let status = "waiting";
    if (
      s.attendanceStatus === "verified" ||
      s.attendanceStatus === "present" ||
      s.attendanceStatus === "submitted"
    ) {
      status = "present";
    } else if (s.attendanceStatus === "late") {
      status = "late";
    } else if (s.attendanceStatus === "absent" && !isActive) {
      status = "absent";
    } else {
      status = isActive ? "waiting" : (s.attendanceStatus || "absent");
    }

    return {
      ...s,
      name,
      status,
    };
  });

  const joinedCount = students.filter(
    (s: any) =>
      s.status === "present" ||
      s.status === "submitted" ||
      s.status === "late",
  ).length;
  const totalCount = students.length;
  const pendingCount = totalCount - joinedCount;
  const attendanceRate =
    totalCount > 0 ? Math.round((joinedCount / totalCount) * 100) : 0;

  const filteredStudents = students.filter((student: any) => {
    const studentName = (student.name || "").toLowerCase();
    const matricNum = (student.matricNumber || "").toLowerCase();
    const query = (searchQuery || "").toLowerCase();

    const matchesSearch =
      studentName.includes(query) || matricNum.includes(query);

    const isChecked =
      student.status === "submitted" ||
      student.status === "present" ||
      student.status === "late";

    if (activeFilter === "checked") {
      return matchesSearch && isChecked;
    }
    if (activeFilter === "pending") {
      return matchesSearch && !isChecked;
    }
    return matchesSearch;
  });

  const handleManualCheck = (studentId: string) => {
    if (!id) return;
    manualMarkMutation.mutate(
      { sessionId: id, studentId, status: "present" },
      {
        onSuccess: () => {
          Alert.alert(
            "Check-In Confirmed",
            "Student successfully checked in and marked as Present by Course Rep.",
          );
        },
        onError: (err: any) => {
          Alert.alert(
            "Authorization Error",
            err.response?.data?.message ||
              err.message ||
              "Failed to mark student attendance.",
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={[styles.loadingText, Theme.typography.bodyMd]}>
            Loading class roll...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={Theme.colors.error}
          />
          <Text style={[styles.errorTitle, Theme.typography.headlineMd]}>
            Session Unavailable
          </Text>
          <Text style={[styles.errorSubtitle, Theme.typography.bodyMd]}>
            {(error as any)?.message ||
              "Could not retrieve class attendance records."}
          </Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={[styles.backBtnText, Theme.typography.labelMd]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <FlatList
        data={filteredStudents}
        keyExtractor={(item, index) => item.id || `student-${index}`}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            {/* Delegation Badge */}
            <View style={styles.delegationBadge}>
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={Theme.colors.secondary}
              />
              <Text style={styles.delegationBadgeText}>
                OFFICIAL COURSE REP DELEGATION
              </Text>
            </View>

            {/* Course Title & Venue */}
            <Text style={[styles.courseCode, Theme.typography.labelMd]}>
              {session.courseCode}
            </Text>
            <Text style={[styles.courseTitle, Theme.typography.headlineMd]}>
              {session.courseTitle}
            </Text>
            <Text style={[styles.venueText, Theme.typography.caption]}>
              {session.venueName || "Lecture Hall"} &bull; Code:{" "}
              {session.attendanceCode}
            </Text>

            {/* Attendance Progress Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{joinedCount}</Text>
                <Text style={styles.statLabel}>Checked In</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNumber, { color: Theme.colors.outline }]}>
                  {pendingCount}
                </Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statBox}>
                <Text
                  style={[
                    styles.statNumber,
                    { color: Theme.colors.secondary },
                  ]}
                >
                  {attendanceRate}%
                </Text>
                <Text style={styles.statLabel}>Rate</Text>
              </View>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Ionicons
                name="search"
                size={18}
                color={Theme.colors.outline}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search classmate name or matric number..."
                placeholderTextColor={Theme.colors.outline}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={Theme.colors.outline}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterRow}>
              {(["all", "checked", "pending"] as FilterType[]).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.filterTab,
                    activeFilter === tab && styles.filterTabActive,
                  ]}
                  onPress={() => setActiveFilter(tab)}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      activeFilter === tab && styles.filterTabTextActive,
                    ]}
                  >
                    {tab.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ListStudentItem
            item={item}
            isActive={isActive}
            handleManualCheck={handleManualCheck}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, Theme.typography.bodyMd]}>
              No student records match the active search or filter.
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
  scrollContent: {
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingTop: Theme.spacing.sm,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Theme.spacing.md,
  },
  loadingText: {
    color: Theme.colors.outline,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  errorTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  errorSubtitle: {
    color: Theme.colors.outline,
    textAlign: "center",
  },
  backBtn: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.rounded.md,
    marginTop: Theme.spacing.md,
  },
  backBtnText: {
    color: Theme.colors.onPrimary,
    fontWeight: "700",
  },
  headerCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  delegationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Theme.colors.secondary + "15",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.rounded.full,
    alignSelf: "flex-start",
    marginBottom: Theme.spacing.sm,
  },
  delegationBadgeText: {
    color: Theme.colors.secondary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  courseCode: {
    color: Theme.colors.primary,
    fontWeight: "800",
  },
  courseTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
    marginTop: 2,
  },
  venueText: {
    color: Theme.colors.outline,
    marginTop: 4,
    marginBottom: Theme.spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Theme.colors.outlineVariant + "40",
    paddingVertical: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: Theme.colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Theme.colors.outline,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceContainerLow,
    borderRadius: Theme.rounded.sm,
    paddingHorizontal: Theme.spacing.sm,
    height: 42,
    marginBottom: Theme.spacing.sm,
  },
  searchIcon: {
    marginRight: Theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Theme.colors.onSurface,
  },
  filterRow: {
    flexDirection: "row",
    gap: Theme.spacing.xs,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    borderRadius: Theme.rounded.sm,
    backgroundColor: Theme.colors.surfaceContainerLow,
  },
  filterTabActive: {
    backgroundColor: Theme.colors.primary,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: "700",
    color: Theme.colors.outline,
  },
  filterTabTextActive: {
    color: Theme.colors.onPrimary,
  },
  emptyContainer: {
    paddingVertical: Theme.spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    color: Theme.colors.outline,
  },
});
