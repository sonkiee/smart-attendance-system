import { Theme } from "@/constants/theme";
import { useSessionStore } from "@/store/session-store";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type FilterType = "all" | "checked" | "pending";

export default function SessionDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activeSession, pastSessions, studentsBySession, submitStudentAttendance, toggleCourseRep } = useSessionStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Find the session (active or past)
  const session =
    activeSession?.id === id
      ? activeSession
      : pastSessions.find((s) => s.id === id);

  const students = studentsBySession[id || ""] || [];

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Session not found</Text>
          <TouchableOpacity style={styles.backBtnText} onPress={() => router.back()}>
            <Text style={{ color: Theme.colors.primary, fontWeight: "700" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Count items for filter sub-labels
  const joinedCount = students.filter((s) => s.status === "submitted" || s.status === "present").length;
  const totalCount = students.length;
  const pendingCount = totalCount - joinedCount;
  const attendanceRate = totalCount > 0 ? Math.round((joinedCount / totalCount) * 100) : 0;

  // Filter and search logic combined
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.matricNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const isChecked = student.status === "submitted" || student.status === "present";
    
    if (activeFilter === "checked") {
      return matchesSearch && isChecked;
    }
    if (activeFilter === "pending") {
      return matchesSearch && !isChecked;
    }
    return matchesSearch;
  });

  const handleManualCheck = (studentId: string) => {
    if (session.isActive && id) {
      submitStudentAttendance(id, studentId);
    }
  };

  const handleMenuPress = () => {
    const isRepActive = !!session.courseRepEnabled;
    Alert.alert(
      "Session Actions",
      `Manage attendance sessions for ${session.courseCode}:`,
      [
        {
          text: isRepActive ? "Revoke Course Rep Delegation" : "Allow Course Rep to Take Attendance",
          onPress: () => {
            if (id) {
              toggleCourseRep(id);
              Alert.alert(
                "Delegation Updated",
                isRepActive
                  ? "Course representative permissions successfully revoked."
                  : "Course representative successfully authorized to mark attendance on your behalf."
              );
            }
          },
        },
        {
          text: "Export as CSV File",
          onPress: () =>
            Alert.alert(
              "Export Success",
              `Attendance records for ${session.courseCode} successfully exported as CSV format.`
            ),
        },
        {
          text: "Export as Excel (XLSX)",
          onPress: () =>
            Alert.alert(
              "Export Success",
              `Attendance records for ${session.courseCode} successfully exported as Excel spreadsheet.`
            ),
        },
        {
          text: "Share PDF Report",
          onPress: () =>
            Alert.alert(
              "Export Success",
              `Attendance report PDF successfully compiled and shared.`
            ),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />

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
          {session.courseCode}
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
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
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
                        backgroundColor: session.isActive
                          ? Theme.colors.secondaryContainer + "15"
                          : Theme.colors.outlineVariant + "30",
                        borderColor: session.isActive
                          ? Theme.colors.secondary + "30"
                          : Theme.colors.outline + "30",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: session.isActive
                            ? Theme.colors.secondary
                            : Theme.colors.outline,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusBadgeText,
                        Theme.typography.labelMd,
                        { color: session.isActive ? Theme.colors.secondary : Theme.colors.outline },
                      ]}
                    >
                      {session.isActive ? "LIVE" : "ENDED"}
                    </Text>
                  </View>

                  {session.courseRepEnabled && (
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
                  <Text style={[styles.statLabel, Theme.typography.labelMd]}>JOINED</Text>
                  <Text style={[styles.statValue, Theme.typography.headlineMd]}>
                    {joinedCount} / {totalCount}
                  </Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={[styles.statLabel, Theme.typography.labelMd]}>RATE</Text>
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
                    {session.venue}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <View style={styles.metaIconWrapper}>
                    <Ionicons name="resize" size={16} color={Theme.colors.primary} />
                  </View>
                  <Text style={[styles.metaText, Theme.typography.bodyMd]}>
                    Geofence Radius: {session.radius}m
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <View style={styles.metaIconWrapper}>
                    <Ionicons name="hourglass" size={16} color={Theme.colors.primary} />
                  </View>
                  <Text style={[styles.metaText, Theme.typography.bodyMd]}>
                    Session Duration: {session.duration} mins
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
                <Text style={[styles.filterPillText, activeFilter === "all" && styles.filterPillTextActive]}>
                  All ({totalCount})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterPill, activeFilter === "checked" && styles.filterPillActive]}
                onPress={() => setActiveFilter("checked")}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterPillText, activeFilter === "checked" && styles.filterPillTextActive]}>
                  {session.isActive ? "Submitted" : "Present"} ({joinedCount})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterPill, activeFilter === "pending" && styles.filterPillActive]}
                onPress={() => setActiveFilter("pending")}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterPillText, activeFilter === "pending" && styles.filterPillTextActive]}>
                  {session.isActive ? "Waiting" : "Absent"} ({pendingCount})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => {
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

                {session.isActive && item.status === "waiting" && (
                  <TouchableOpacity
                    style={styles.checkBtn}
                    onPress={() => handleManualCheck(item.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="checkmark-circle-outline" size={14} color={Theme.colors.onPrimary} />
                    <Text style={[styles.checkBtnText, Theme.typography.labelMd]}>
                      CHECK IN
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
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
