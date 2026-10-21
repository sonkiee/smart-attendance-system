import { ListStudentItem } from "@/components/lecturer/list-student-item";
import { SummaryCard } from "@/components/lecturer/summary-card";
import { Theme } from "@/constants/theme";
import {
  useCloseSession,
  useManualMarkAttendance,
  useToggleRepMarking,
} from "@/hooks/mutation/use-session";
import { useSessionByIdStudent } from "@/hooks/queries/user";
import { fetchCourseExportCsv } from "@/service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "all" | "checked" | "pending";

export default function SessionDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: session,
    isLoading,
    isError,
    error,
  } = useSessionByIdStudent(id);

  const closeSessionMutation = useCloseSession();
  const manualMarkMutation = useManualMarkAttendance();
  const toggleRepMutation = useToggleRepMarking();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const isActive = session?.status === "active";
  const courseRepEnabled = !!session?.allowRepMarking;

  // Map student list data to match the standard component fields
  const rawStudents = session?.students || [];
  const students = rawStudents.map((s: any) => {
    const firstName = s.firstName || "";
    const lastName = s.lastName || "";
    const name = `${firstName} ${lastName}`.trim() || "Unknown Student";

    // Map attendanceStatus to match present/waiting statuses expected by display logic
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

  // 1. Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={[styles.loadingText, Theme.typography.bodyMd]}>
            Loading session details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // 2. Error state or not found
  if (isError || !session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error?.message || "Session not found"}
          </Text>
          <TouchableOpacity
            style={styles.backBtnText}
            onPress={() => router.back()}
          >
            <Text style={{ color: Theme.colors.primary, fontWeight: "700" }}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Count items for filter sub-labels
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

  // Filter and search logic combined (safely handling undefined strings)
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

  const handleCloseSession = () => {
    if (id) {
      closeSessionMutation.mutate(id, {
        onSuccess: () => {
          Alert.alert("Success", "Attendance session successfully ended.", [
            {
              text: "OK",
              onPress: () => router.replace("/(lecturer)/(tabs)/home"),
            },
          ]);
        },
        onError: (err: any) => {
          Alert.alert("Error", err.message || "Failed to end session.");
        },
      });
    }
  };

  const handleManualCheck = (studentId: string) => {
    if (isActive && id) {
      manualMarkMutation.mutate(
        { sessionId: id, studentId, status: "present" },
        {
          onSuccess: () => {
            Alert.alert("Success", "Student manually verified and marked as Present.");
          },
          onError: (err: any) => {
            Alert.alert(
              "Error",
              err.response?.data?.message || err.message || "Failed to mark attendance."
            );
          },
        }
      );
    }
  };

  const handleExportCsv = async () => {
    const courseId = session?.courseId || session?.course?.id;
    if (!courseId) {
      Alert.alert("Export Error", "Course identifier not found for this session.");
      return;
    }
    try {
      const csvContent = await fetchCourseExportCsv(courseId);
      await Share.share({
        title: `${session.courseCode || "Course"}_Attendance.csv`,
        message: csvContent,
      });
    } catch (err: any) {
      Alert.alert("Export Failed", err.message || "Could not generate or share CSV file.");
    }
  };

  const handleMenuPress = () => {
    const isRepActive = courseRepEnabled;
    Alert.alert(
      "Session Actions",
      `Manage attendance sessions for ${session.courseCode}:`,
      [
        {
          text: isRepActive
            ? "Revoke Course Rep Delegation"
            : "Allow Course Rep to Take Attendance",
          onPress: () => {
            if (id) {
              toggleRepMutation.mutate(
                { sessionId: id, allowRepMarking: !isRepActive },
                {
                  onSuccess: () => {
                    Alert.alert(
                      "Delegation Updated",
                      !isRepActive
                        ? "Course representative successfully authorized to mark attendance on your behalf."
                        : "Course representative permissions successfully revoked."
                    );
                  },
                  onError: (err: any) => {
                    Alert.alert(
                      "Delegation Error",
                      err.response?.data?.message || err.message || "Failed to update delegation."
                    );
                  },
                }
              );
            }
          },
        },
        {
          text: "Export as CSV File",
          onPress: handleExportCsv,
        },
        {
          text: "Export as Excel Compatible (CSV)",
          onPress: handleExportCsv,
        },
        ...(isActive
          ? [
              {
                text: "End Attendance Session",
                style: "destructive" as const,
                onPress: () => {
                  Alert.alert(
                    "End Session",
                    "Are you sure you want to end this attendance session?",
                    [
                      { text: "Cancel", style: "cancel" as const },
                      {
                        text: "End Session",
                        style: "destructive" as const,
                        onPress: handleCloseSession,
                      },
                    ],
                  );
                },
              },
            ]
          : []),
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={Theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, Theme.typography.headlineMd]}>
          {session?.courseCode || "Session"}
        </Text>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={handleMenuPress}
          activeOpacity={0.7}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={Theme.colors.onSurface} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredStudents}
        keyExtractor={(item, index) => item.id || `student-${index}`}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <SummaryCard
            session={session}
            joinedCount={joinedCount}
            totalCount={totalCount}
            attendanceRate={attendanceRate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
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
              No student records match the active filter criteria.
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Theme.spacing.xl,
  },
  loadingText: {
    marginTop: Theme.spacing.md,
    color: Theme.colors.outline,
    fontWeight: "600",
  },
});
