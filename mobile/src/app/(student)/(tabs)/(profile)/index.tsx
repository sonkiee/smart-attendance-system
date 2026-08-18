import Header from "@/components/header";
import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

import { MenuItem } from "@/components/menu-item";
import { Section } from "@/components/section";
import { useProfile } from "@/hooks/queries/user";

export default function StudentProfile() {
  const router = useRouter();
  const { data: profile } = useProfile();

  const handleLogout = () => {
    router.replace("/");
  };

  // Circular Stats Calculations
  const radius = 28;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  // 94.8% completion
  const percentage = 94.8;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />

      {/* Header */}
      <Header title="Profile" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Profile Card */}
        <View style={styles.heroCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.largeAvatarContainer}>
              <Image
                style={styles.avatar}
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_Zm0PocLuqsBQ0txERXF2PeOgCJipXt2_tUsr-PLrOB935Y898-MygB0PrS3ALgCEdx64UQwPuM3jDy13eYDCanD5Xjj6H-cjgigP8JVffcGCP_8LJiQwfppNUYCK5BCvRPeCzsToDl-xEM2WaIaj5sggcblaYfeOcD_REthh23V-xbFWY6szw72WMIwJoHap66UQHcqc4vYKMz_yDyfWy5Hb7p-BU1Qzlr8O5-lEnKsIfmXctfw",
                }}
                contentFit="cover"
              />
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Theme.colors.onSecondaryContainer}
              />
            </View>
          </View>

          <Text style={[styles.profileName, Theme.typography.headlineLg]}>
            {profile?.student
              ? `${profile.student.firstName} ${profile.student.lastName}`
              : "Jane Smith"}
          </Text>
          <Text style={[styles.profileId, Theme.typography.bodyMd]}>
            {(profile?.student?.matricNumber || "csc/2020/001").toUpperCase()}
          </Text>

          <View style={styles.heroGrid}>
            <View style={styles.gridCard}>
              <Text style={[styles.gridLabel, Theme.typography.labelMd]}>
                Level
              </Text>
              <Text
                style={[
                  styles.gridValue,
                  Theme.typography.headlineMd,
                  { color: Theme.colors.primary },
                ]}
              >
                {profile?.student?.level || 400}L
              </Text>
            </View>
            <View style={styles.gridCard}>
              <Text style={[styles.gridLabel, Theme.typography.labelMd]}>
                Status
              </Text>
              <View style={styles.statusBadgeRow}>
                <View style={styles.statusDot} />
                <Text
                  style={[
                    styles.gridValue,
                    Theme.typography.headlineMd,
                    { color: Theme.colors.secondary },
                  ]}
                >
                  Active
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Bento Card */}
        <View style={styles.statsBento}>
          <View style={styles.bentoLeft}>
            <Text style={[styles.bentoLabel, Theme.typography.labelMd]}>
              ATTENDANCE STATISTICS
            </Text>
            <Text style={[styles.bentoValue, Theme.typography.headlineLg]}>
              94.8%
            </Text>
          </View>

          <View style={styles.bentoCircleWrapper}>
            <Svg width="64" height="64" viewBox="0 0 64 64">
              <Circle
                cx="32"
                cy="32"
                r={radius}
                fill="transparent"
                stroke={Theme.colors.onPrimaryContainer}
                strokeWidth={strokeWidth}
                opacity={0.2}
              />
              <Circle
                cx="32"
                cy="32"
                r={radius}
                fill="transparent"
                stroke={Theme.colors.onPrimaryContainer}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 32 32)"
              />
            </Svg>
            <View style={styles.circleOverlay}>
              <Text style={styles.trendText}>↑4%</Text>
            </View>
          </View>
        </View>

        {/* Settings Group: Academic */}
        <Section title="ACADEMIC & PERSONAL">
          <MenuItem
            label="Personal Details"
            description="Name, Contact, Address"
            icon="card-outline"
            onPress={() => router.push("/(student)/personal-details")}
          />
        </Section>

        {/* Settings Group: Preferences */}
        <Section title="APP PREFERENCES">
          <MenuItem
            label="Account Settings"
            description="Privacy, Security, Geofence"
            icon="settings-outline"
            onPress={() => router.push("/(student)/settings")}
          />
          <MenuItem
            label="Log Out"
            description="Securely exit your session"
            icon="log-out-outline"
            isDestructive
            onPress={handleLogout}
          />
        </Section>
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
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.outlineVariant + "30",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
  },
  headerAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    paddingBottom: 120,
  },
  heroCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.lg,
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.soft,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: Theme.spacing.md,
  },
  largeAvatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: Theme.colors.primaryContainer + "30",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Theme.colors.secondaryContainer,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Theme.colors.surfaceContainerLowest,
  },
  profileName: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  profileId: {
    color: Theme.colors.outline,
    fontWeight: "600",
    letterSpacing: 0.8,
    marginTop: Theme.spacing.base,
  },
  heroGrid: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
    marginTop: Theme.spacing.lg,
    width: "100%",
  },
  gridCard: {
    flex: 1,
    backgroundColor: Theme.colors.surfaceContainerLow,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.default,
    paddingVertical: Theme.spacing.sm,
    alignItems: "center",
  },
  gridLabel: {
    color: Theme.colors.outline,
    fontWeight: "600",
    marginBottom: 4,
  },
  gridValue: {
    fontWeight: "700",
  },
  statusBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.secondary,
  },
  statsBento: {
    backgroundColor: Theme.colors.primaryContainer,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.soft,
  },
  bentoLeft: {
    flex: 1,
  },
  bentoLabel: {
    color: Theme.colors.onPrimaryContainer,
    opacity: 0.8,
    letterSpacing: 1.2,
  },
  bentoValue: {
    color: Theme.colors.onPrimaryContainer,
    fontWeight: "700",
    marginTop: Theme.spacing.base,
  },
  bentoCircleWrapper: {
    width: 64,
    height: 64,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  circleOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  trendText: {
    color: Theme.colors.onPrimaryContainer,
    fontWeight: "700",
    fontSize: 12,
  },
  semibold: {
    fontWeight: "600",
  },
});
