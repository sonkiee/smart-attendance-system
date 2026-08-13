import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Theme } from "../../constants/theme";

export default function RoleSelector() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons
                name="location"
                size={32}
                color={Theme.colors.primary}
              />
            </View>
            <View style={styles.pulseRing} />
          </View>
          <Text style={[styles.title, Theme.typography.headlineLg]}>
            Precision Metric
          </Text>
          <Text style={[styles.subtitle, Theme.typography.bodyLg]}>
            Clinical Geofence Attendance Verification
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push("/(student)/(tabs)/dashboard")}
          >
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: Theme.colors.primary + "10" },
              ]}
            >
              <Ionicons
                name="finger-print"
                size={28}
                color={Theme.colors.primary}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, Theme.typography.headlineMd]}>
                Student Portal
              </Text>
              <Text style={[styles.cardDescription, Theme.typography.bodyMd]}>
                Verify inside class geofence, authenticate identity, and view
                recent attendance history.
              </Text>
            </View>
            <View style={styles.arrowIcon}>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Theme.colors.outline}
              />
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push("/(lecturer)/(tabs)")}
          >
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: Theme.colors.secondary + "10" },
              ]}
            >
              <Ionicons
                name="analytics"
                size={28}
                color={Theme.colors.secondary}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, Theme.typography.headlineMd]}>
                Lecturer Control Panel
              </Text>
              <Text style={[styles.cardDescription, Theme.typography.bodyMd]}>
                Configure attendance sessions, set geofence radius, track
                real-time roll call, and override status.
              </Text>
            </View>
            <View style={styles.arrowIcon}>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Theme.colors.outline}
              />
            </View>
          </TouchableOpacity> */}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, Theme.typography.caption]}>
            Precision Metric v1.0.0 • Secure & Reliable
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Theme.spacing.marginMobile,
    justifyContent: "space-between",
    paddingVertical: Theme.spacing.xl,
  },
  header: {
    alignItems: "center",
    marginTop: Theme.spacing.xl * 1.5,
  },
  logoContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
    position: "relative",
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    borderWidth: 1,
    borderColor: Theme.colors.outlineVariant,
    ...Theme.shadows.soft,
  },
  pulseRing: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    opacity: 0.15,
    zIndex: 1,
  },
  title: {
    color: Theme.colors.onSurface,
    textAlign: "center",
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    color: Theme.colors.onSurfaceVariant,
    textAlign: "center",
    paddingHorizontal: Theme.spacing.md,
  },
  cardsContainer: {
    gap: Theme.spacing.md,
    marginVertical: Theme.spacing.xl,
  },
  card: {
    flexDirection: "row",
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderRadius: Theme.rounded.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.outlineVariant,
    alignItems: "center",
    ...Theme.shadows.soft,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: Theme.rounded.default,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  cardContent: {
    flex: 1,
    paddingRight: Theme.spacing.xs,
  },
  cardTitle: {
    color: Theme.colors.onSurface,
    marginBottom: Theme.spacing.xs,
  },
  cardDescription: {
    color: Theme.colors.onSurfaceVariant,
  },
  arrowIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  footerText: {
    color: Theme.colors.outline,
  },
});
