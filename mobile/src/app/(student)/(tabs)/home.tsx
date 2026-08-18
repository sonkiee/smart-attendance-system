import { AttendanceItem } from "@/components/attendance-item";
import Header from "@/components/header";
import { Sessions } from "@/components/sessions";
import { courses } from "@/constants";
import { Theme } from "@/constants/theme";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StudentDashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />

      {/* Header */}
      <Header title="Hello," />

      <FlatList
        data={courses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <AttendanceItem item={item} />}
        ListHeaderComponent={
          <>
            <Sessions />
            <View style={styles.recentActivityHeader}>
              <Text>Recent Activity</Text>
              <TouchableOpacity>
                <Text>View All</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        contentContainerStyle={styles.scrollContent}
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
    borderWidth: 2,
    borderColor: Theme.colors.primaryContainer + "30",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  greeting: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  degreeText: {
    color: Theme.colors.outline,
    marginTop: 2,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.surfaceContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingTop: Theme.spacing.md,
    paddingBottom: 100, // Account for bottom tab navigation
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  geofenceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.secondaryContainer + "15",
    borderColor: Theme.colors.secondary + "20",
    borderWidth: 1,
    borderRadius: Theme.rounded.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    gap: Theme.spacing.xs,
  },
  geofenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.secondary,
  },
  geofenceText: {
    color: Theme.colors.secondary,
    fontWeight: "600",
  },
  dateTimeContainer: {
    alignItems: "flex-end",
  },
  dateText: {
    color: Theme.colors.outline,
  },
  timeText: {
    color: Theme.colors.onBackground,
    marginTop: 2,
  },
  semibold: {
    fontWeight: "600",
  },
  activeClassCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    position: "relative",
    overflow: "hidden",
    ...Theme.shadows.soft,
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
  activeTagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  activePill: {
    backgroundColor: Theme.colors.primary + "15",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.rounded.full,
  },
  activePillText: {
    color: Theme.colors.primary,
    fontWeight: "600",
  },
  moreBtn: {
    padding: Theme.spacing.base,
  },
  classTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
    marginBottom: Theme.spacing.md,
  },
  classDetailsGrid: {
    flexDirection: "row",
    gap: Theme.spacing.lg,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  detailText: {
    color: Theme.colors.onSurfaceVariant,
  },
  ctaButton: {
    height: 56,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.rounded.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Theme.spacing.xs,
    marginVertical: Theme.spacing.sm,
  },
  ctaText: {
    color: Theme.colors.onPrimary,
    fontWeight: "700",
  },
  mapCard: {
    height: 128,
    borderRadius: Theme.rounded.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Theme.colors.outlineVariant,
    position: "relative",
    marginBottom: Theme.spacing.lg,
  },
  mapBackground: {
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
  mapPulseRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Theme.colors.secondary,
    backgroundColor: Theme.colors.secondary + "20",
  },
  mapDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.secondary,
    position: "absolute",
  },
  mapLabel: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.rounded.default,
    borderWidth: 1,
    borderColor: Theme.colors.outlineVariant,
  },
  mapLabelText: {
    color: Theme.colors.onSurface,
    fontWeight: "600",
  },
  recentActivityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  activityTitle: {
    fontWeight: "600",
    color: Theme.colors.onSurface,
  },
  viewAllBtn: {
    color: Theme.colors.primary,
  },
  activityList: {
    gap: Theme.spacing.xs,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surfaceContainerLow,
    borderRadius: Theme.rounded.md,
    borderWidth: 1,
    borderColor: "transparent",
  },
  activityIconBox: {
    width: 48,
    height: 48,
    backgroundColor: Theme.colors.surfaceContainerHigh,
    borderRadius: Theme.rounded.default,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  activityMeta: {
    flex: 1,
  },
  activityClassName: {
    color: Theme.colors.onSurface,
  },
  activityDate: {
    color: Theme.colors.outline,
    marginTop: 2,
  },
  presentBadge: {
    backgroundColor: Theme.colors.secondary + "15",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.rounded.full,
  },
  presentText: {
    color: Theme.colors.secondary,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalDismissTrigger: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: Theme.colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing.xl + 20,
    paddingTop: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  dragHandle: {
    width: 48,
    height: 6,
    backgroundColor: Theme.colors.outlineVariant,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: Theme.spacing.lg,
  },
  modalContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  stateContainer: {
    alignItems: "center",
    marginVertical: Theme.spacing.md,
  },
  radarWrapper: {
    width: 128,
    height: 128,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
    position: "relative",
  },
  radarPulse: {
    position: "absolute",
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: Theme.colors.primary,
  },
  radarCore: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  successIconBox: {
    width: 96,
    height: 96,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
  },
  modalHeadline: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
    textAlign: "center",
  },
  modalSubheadline: {
    color: Theme.colors.onSurfaceVariant,
    marginTop: Theme.spacing.xs,
    textAlign: "center",
  },
  biometricContainer: {
    width: "100%",
    marginTop: Theme.spacing.lg,
    alignItems: "center",
  },
  bioButton: {
    width: "100%",
    height: 56,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.rounded.md,
    justifyContent: "center",
    alignItems: "center",
  },
  bioButtonSuccess: {
    backgroundColor: Theme.colors.secondary,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.xs,
  },
  bioBtnText: {
    color: Theme.colors.onPrimary,
    fontWeight: "700",
  },
  spinner: {
    marginRight: Theme.spacing.xs,
  },
  bioCaption: {
    color: Theme.colors.onSurfaceVariant,
    marginTop: Theme.spacing.md,
    textAlign: "center",
  },
});
