import { Theme } from "@/constants/theme";
import { useProfile } from "@/hooks/queries/user";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function PersonalDetailsScreen() {
  const { data: profile, isPending } = useProfile();

  if (isPending) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </SafeAreaView>
    );
  }

  const student = profile?.student;
  const fullName = student
    ? `${student.firstName} ${student.lastName}`
    : "Jane Smith";
  const matricNumber = student?.matricNumber || "CSC/2020/001";
  const level = student?.level ? `${student.level}L` : "400L";
  const department = student?.department || "Computer Science";
  const faculty = student?.faculty || "Science";
  const programme = student?.programme || "B.Sc. Computer Science";
  const email = student?.email || profile?.email || "jane.smith@university.edu";
  const phoneNumber = student?.phoneNumber || "+234 812 345 6789";
  const gender = student?.gender || "Female";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Identity Card */}
        <View style={styles.profileHero}>
          <View style={styles.avatarPlaceholder}>
            <Text style={[styles.avatarInitial, Theme.typography.headlineLg]}>
              {fullName.charAt(0)}
            </Text>
          </View>
          <Text style={[styles.heroName, Theme.typography.headlineMd]}>
            {fullName}
          </Text>
          <Text style={[styles.heroSub, Theme.typography.bodyMd]}>
            {matricNumber.toUpperCase()}
          </Text>
        </View>

        {/* Section 1: Academic Profile */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, Theme.typography.labelMd]}>
            ACADEMIC PROFILE
          </Text>
          <View style={styles.card}>
            <DetailRow
              icon="school-outline"
              label="Programme"
              value={programme}
            />
            <View style={styles.divider} />
            <DetailRow
              icon="business-outline"
              label="Department"
              value={department}
            />
            <View style={styles.divider} />
            <DetailRow
              icon="git-branch-outline"
              label="Faculty"
              value={faculty}
            />
            <View style={styles.divider} />
            <DetailRow
              icon="speedometer-outline"
              label="Current Level"
              value={level}
            />
          </View>
        </View>

        {/* Section 2: Personal Contact */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, Theme.typography.labelMd]}>
            PERSONAL CONTACT
          </Text>
          <View style={styles.card}>
            <DetailRow
              icon="mail-outline"
              label="University Email"
              value={email}
            />
            <View style={styles.divider} />
            <DetailRow
              icon="call-outline"
              label="Phone Number"
              value={phoneNumber}
            />
            <View style={styles.divider} />
            <DetailRow
              icon="male-female-outline"
              label="Gender"
              value={gender}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface DetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

const DetailRow = ({ icon, label, value }: DetailRowProps) => (
  <View style={styles.detailRow}>
    <View style={styles.detailRowLeft}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={18} color={Theme.colors.primary} />
      </View>
      <Text style={[styles.label, Theme.typography.bodyLg]}>{label}</Text>
    </View>
    <Text style={[styles.value, Theme.typography.bodyLg]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingTop: Theme.spacing.md,
    paddingBottom: 40,
  },
  profileHero: {
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary + "30",
  },
  avatarInitial: {
    color: Theme.colors.primary,
    fontWeight: "700",
  },
  heroName: {
    color: Theme.colors.onBackground,
    fontWeight: "700",
    marginBottom: 4,
  },
  heroSub: {
    color: Theme.colors.outline,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    color: Theme.colors.outline,
    fontWeight: "600",
    letterSpacing: 1,
    paddingHorizontal: Theme.spacing.base,
    marginBottom: Theme.spacing.sm,
  },
  card: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    overflow: "hidden",
    ...Theme.shadows.soft,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Theme.spacing.md,
  },
  detailRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: Theme.rounded.default,
    backgroundColor: Theme.colors.surfaceContainerLow,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: Theme.colors.outline,
    fontWeight: "500",
  },
  value: {
    color: Theme.colors.onSurface,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.outlineVariant + "30",
    marginHorizontal: Theme.spacing.md,
  },
});
