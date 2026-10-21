import { ActiveSessionCard } from "@/components/lecturer/active-session-card";
import { NoSession } from "@/components/lecturer/no-session";
import { Theme } from "@/constants/theme";
import { useFetchSessionsLecturer, useLecturerProfile } from "@/hooks/queries/user";
import { useAuthStore } from "@/store/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LecturerHome() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { data, isPending, refetch, isRefetching } = useFetchSessionsLecturer();
  const { data: lecturerProfile } = useLecturerProfile();

  const activeSession = data?.[0];

  const initials = lecturerProfile
    ? `${lecturerProfile.firstName?.[0] || ""}${lecturerProfile.lastName?.[0] || ""}`
    : "LC";
  const lecturerName = lecturerProfile
    ? `Dr. ${lecturerProfile.firstName} ${lecturerProfile.lastName}`
    : "Lecturer Portal";
  const department = lecturerProfile?.department || "Computer Science";

  const handleLogout = () => {
    logout();
    router.replace("/(auth)");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header with Logout */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={[styles.greeting, Theme.typography.headlineMd]}>
              {lecturerName}
            </Text>
            <Text style={[styles.role, Theme.typography.caption]}>
              Staff #{lecturerProfile?.staffNumber || ""} • {department}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color={Theme.colors.error || "#ba1a1a"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetch();
            }}
            tintColor={Theme.colors.primary}
            colors={[Theme.colors.primary]}
          />
        }
      >
        {activeSession ? (
          <ActiveSessionCard
            isPending={isPending}
            activeSession={activeSession}
          />
        ) : (
          <NoSession />
        )}
      </ScrollView>
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
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.primaryContainer + "20",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.primaryContainer + "40",
  },
  avatarText: {
    color: Theme.colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
  greeting: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  role: {
    color: Theme.colors.outline,
    marginTop: 2,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.surfaceContainerLow,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.outlineVariant + "30",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingTop: Theme.spacing.lg,
    paddingBottom: 100,
  },
  section: {
    gap: Theme.spacing.md,
  },
  sectionTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  sessionCard: {
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
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
    zIndex: 2,
  },
  badgesWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.secondaryContainer + "15",
    borderColor: Theme.colors.secondary + "20",
    borderWidth: 1,
    borderRadius: Theme.rounded.full,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    gap: 6,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.secondary,
  },
  badgeText: {
    color: Theme.colors.secondary,
    fontWeight: "700",
  },
  repBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: Theme.colors.primaryContainer + "10",
    borderColor: Theme.colors.primary + "20",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Theme.rounded.full,
  },
  repBadgeText: {
    color: Theme.colors.primary,
    fontWeight: "700",
    fontSize: 9,
  },
  venueText: {
    color: Theme.colors.outline,
    fontWeight: "600",
  },
  courseCode: {
    color: Theme.colors.onSurface,
    fontWeight: "800",
    zIndex: 2,
  },
  courseTitle: {
    color: Theme.colors.onSurfaceVariant,
    marginTop: Theme.spacing.xs,
    zIndex: 2,
  },
  cardDetails: {
    flexDirection: "row",
    gap: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.outlineVariant + "30",
    zIndex: 2,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.primaryContainer + "10",
    justifyContent: "center",
    alignItems: "center",
  },
  detailText: {
    color: Theme.colors.onSurfaceVariant,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Theme.spacing.lg,
    paddingTop: Theme.spacing.sm,
    zIndex: 2,
  },
  tapPrompt: {
    color: Theme.colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  endBtn: {
    height: 56,
    borderColor: "#ba1a1a",
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffdad6",
    marginTop: Theme.spacing.md,
  },
  endBtnText: {
    color: "#ba1a1a",
    fontWeight: "700",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Theme.spacing.lg,
    marginTop: 20,
    width: "100%",
  },
  emptyCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.xl,
    alignItems: "center",
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  illustrationBox: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Theme.colors.primaryContainer + "12",
    borderColor: Theme.colors.primaryContainer + "25",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
    position: "relative",
    zIndex: 2,
  },
  innerPulseCircle: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    borderColor: Theme.colors.primaryContainer + "08",
    borderWidth: 2,
  },
  emptyHeadline: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
    zIndex: 2,
  },
  emptySubheadline: {
    color: Theme.colors.outline,
    textAlign: "center",
    marginTop: Theme.spacing.sm,
    lineHeight: 22,
    zIndex: 2,
  },
  createBtn: {
    flexDirection: "row",
    height: 56,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.rounded.md,
    paddingHorizontal: Theme.spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    gap: Theme.spacing.xs,
    width: "100%",
    ...Theme.shadows.soft,
  },
  createBtnText: {
    color: Theme.colors.onPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
});
