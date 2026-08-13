import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Theme } from "../../constants/theme";

interface HistoryRecord {
  id: string;
  course: string;
  date: string;
  status: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

export default function StudentHistory() {
  const router = useRouter();

  const handleNav = (path: "/(student)/(tabs)/dashboard" | "/(student)/profile") => {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <TouchableOpacity
            onPress={handleBackToSelect}
            style={styles.avatarContainer}
          >
            <Image
              style={styles.avatar}
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgc2g5rH3Wgo0FEkDdDNbfkpPMGqczIkHc83eTfe3CTknwUhqHhVijtQmS6_rcmWAWhYF_wkSlTohr-DUcCw1CiHx-OWnqpwuJpfFHRN4OBiPkJw0ZHufSDsGIt7VXn6uinFAt2Vv2QNGOVCPD0bImoV_cctexyAwICRSMHpn0C5NW7pwfEUclDKEIzGNiHWv18OReT0t_kkRrMjcpdwkdO4VF2pgLD1tkvkAKhbEmuUGEJxzQ_Y0",
              }}
              contentFit="cover"
            />
          </TouchableOpacity>
          <Text style={[styles.title, Theme.typography.headlineMd]}>
            History
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={Theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Stats Row */}
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

        {/* History Group: October 2024 */}
        <View style={styles.historyGroup}>
          <View style={styles.groupHeader}>
            <Text style={[styles.groupTitle, Theme.typography.headlineMd]}>
              October 2024
            </Text>
            <Text style={[styles.groupSubtitle, Theme.typography.labelMd]}>
              12 records
            </Text>
          </View>

          <View style={styles.recordsList}>
            {octoberRecords.map((item) => (
              <View key={item.id} style={styles.recordCard}>
                <View style={styles.recordLeft}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name={item.iconName}
                      size={24}
                      color={Theme.colors.primary}
                    />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.courseCode,
                        Theme.typography.bodyLg,
                        styles.bold,
                      ]}
                    >
                      {item.course}
                    </Text>
                    <Text style={[styles.recordDate, Theme.typography.caption]}>
                      {item.date}
                    </Text>
                  </View>
                </View>
                <View style={styles.presentBadge}>
                  <Text style={[styles.presentText, Theme.typography.labelMd]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* History Group: September 2024 */}
        <View style={styles.historyGroup}>
          <View style={styles.groupHeader}>
            <Text style={[styles.groupTitle, Theme.typography.headlineMd]}>
              September 2024
            </Text>
            <Text style={[styles.groupSubtitle, Theme.typography.labelMd]}>
              24 records
            </Text>
          </View>

          <View style={styles.recordsList}>
            {septemberRecords.map((item) => (
              <View key={item.id} style={styles.recordCard}>
                <View style={styles.recordLeft}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name={item.iconName}
                      size={24}
                      color={Theme.colors.primary}
                    />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.courseCode,
                        Theme.typography.bodyLg,
                        styles.bold,
                      ]}
                    >
                      {item.course}
                    </Text>
                    <Text style={[styles.recordDate, Theme.typography.caption]}>
                      {item.date}
                    </Text>
                  </View>
                </View>
                <View style={styles.presentBadge}>
                  <Text style={[styles.presentText, Theme.typography.labelMd]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Load Older Records Button */}
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
      </ScrollView>

      {/* Navigation Tab Bar Mock */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNav("/(student)/(tabs)/dashboard")}
        >
          <Ionicons
            name="home-outline"
            size={24}
            color={Theme.colors.onSurfaceVariant}
          />
          <Text style={[styles.navText, Theme.typography.labelMd]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive}>
          <Ionicons
            name="time"
            size={24}
            color={Theme.colors.onSecondaryContainer}
          />
          <Text style={[styles.navTextActive, Theme.typography.labelMd]}>
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNav("/(student)/profile")}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={Theme.colors.onSurfaceVariant}
          />
          <Text style={[styles.navText, Theme.typography.labelMd]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
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
  historyGroup: {
    marginBottom: Theme.spacing.lg,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  groupTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "600",
  },
  groupSubtitle: {
    color: Theme.colors.outline,
  },
  recordsList: {
    gap: Theme.spacing.xs,
  },
  recordCard: {
    flexDirection: "row",
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.md,
    alignItems: "center",
    justifyContent: "space-between",
    ...Theme.shadows.soft,
  },
  recordLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Theme.rounded.default,
    backgroundColor: Theme.colors.primaryContainer + "10",
    justifyContent: "center",
    alignItems: "center",
  },
  courseCode: {
    color: Theme.colors.onSurface,
  },
  recordDate: {
    color: Theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  presentBadge: {
    backgroundColor: Theme.colors.secondary + "10",
    borderColor: Theme.colors.secondary + "20",
    borderWidth: 1,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.rounded.full,
  },
  presentText: {
    color: Theme.colors.secondary,
    fontWeight: "600",
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
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.outlineVariant,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10,
    ...Theme.shadows.soft,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.lg,
  },
  navItemActive: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.secondaryContainer,
    borderRadius: Theme.rounded.md,
    paddingVertical: 6,
    paddingHorizontal: Theme.spacing.md,
  },
  navText: {
    color: Theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  navTextActive: {
    color: Theme.colors.onSecondaryContainer,
    fontWeight: "600",
    marginTop: 2,
  },
});
