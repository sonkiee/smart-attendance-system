import Header from "@/components/header";
import { AttendanceItem } from "@/components/attendance-item";
import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HistoryRecord {
  id: string;
  course: string;
  date: string;
  status: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

export default function StudentHistory() {
  const router = useRouter();

  const handleNav = (
    path: "/(student)/(tabs)/dashboard" | "/(student)/profile",
  ) => {
    router.replace(path);
  };

  const handleBackToSelect = () => {
    router.replace("/");
  };

  const octoberRecords: HistoryRecord[] = [
    {
      id: "oct-1",
      course: "CSC 423",
      date: "Oct 24 • 09:15 AM",
      status: "Present",
      iconName: "school-outline",
    },
    {
      id: "oct-2",
      course: "ARC 301",
      date: "Oct 23 • 11:30 AM",
      status: "Present",
      iconName: "construct-outline",
    },
    {
      id: "oct-3",
      course: "CSC 423",
      date: "Oct 21 • 09:12 AM",
      status: "Present",
      iconName: "terminal-outline",
    },
  ];

  const septemberRecords: HistoryRecord[] = [
    {
      id: "sep-1",
      course: "MTH 211",
      date: "Sep 28 • 08:00 AM",
      status: "Present",
      iconName: "calculator-outline",
    },
    {
      id: "sep-2",
      course: "PSY 102",
      date: "Sep 27 • 14:45 PM",
      status: "Present",
      iconName: "people-outline",
    },
  ];

  const sections = [
    {
      title: "October 2024",
      count: 12,
      data: octoberRecords,
    },
    {
      title: "September 2024",
      count: 24,
      data: septemberRecords,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />

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
                22
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
                98%
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.outlineVariant + "30",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Theme.colors.outlineVariant,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  title: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  notificationBtn: {
    padding: Theme.spacing.xs,
    borderRadius: 20,
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
  bold: {
    fontWeight: "700",
  },
});
