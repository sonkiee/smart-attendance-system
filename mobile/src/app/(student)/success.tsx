import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Theme } from "../../constants/theme";

export default function AttendanceSuccess() {
  const router = useRouter();

  // Animations
  const scaleAnim = useMemo(() => new Animated.Value(0), []);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const translateAnim = useMemo(() => new Animated.Value(20), []);
  const ringScaleAnim1 = useMemo(() => new Animated.Value(1), []);
  const ringOpacityAnim1 = useMemo(() => new Animated.Value(0.4), []);

  useEffect(() => {
    // Spring scale-in for the main emerald checkmark
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 40,
      friction: 5,
      useNativeDriver: true,
    }).start();

    // Fade-up for content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the green checkmark halo
    Animated.loop(
      Animated.parallel([
        Animated.timing(ringScaleAnim1, {
          toValue: 1.4,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacityAnim1, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scaleAnim, fadeAnim, translateAnim, ringScaleAnim1, ringOpacityAnim1]);

  const handleDone = () => {
    // Navigate back to the student dashboard
    router.replace("/(student)/(tabs)/dashboard");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />

      {/* Background Subtle Pattern Overlay */}
      <View style={styles.patternOverlay} pointerEvents="none">
        <View style={styles.dotRow}>
          {Array.from({ length: 60 }).map((_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.content}>
          {/* Animated Emerald Checkmark Container */}
          <View style={styles.checkmarkWrapper}>
            <Animated.View
              style={[
                styles.checkmarkRing,
                {
                  transform: [{ scale: ringScaleAnim1 }],
                  opacity: ringOpacityAnim1,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.checkmarkCircle,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={80}
                color={Theme.colors.secondary}
              />
            </Animated.View>
          </View>

          {/* Header Section */}
          <Animated.View
            style={[
              styles.headerSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: translateAnim }],
              },
            ]}
          >
            <Text style={[styles.successTitle, Theme.typography.headlineLg]}>
              Attendance Marked!
            </Text>
            <Text style={[styles.classText, Theme.typography.headlineMd]}>
              CSC 423: Compiler Construction I
            </Text>
          </Animated.View>

          {/* Bento-style Detail Cards */}
          <Animated.View
            style={[
              styles.detailsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: translateAnim }],
              },
            ]}
          >
            {/* Timestamp Card */}
            <View style={styles.detailCard}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="time"
                  size={24}
                  color={Theme.colors.onSurfaceVariant}
                />
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardLabel, Theme.typography.labelMd]}>
                  TIMESTAMP
                </Text>
                <Text style={[styles.cardValue, Theme.typography.bodyLg]}>
                  Today, 10:04 AM
                </Text>
              </View>
            </View>

            {/* Venue Card */}
            <View style={styles.detailCard}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="location"
                  size={24}
                  color={Theme.colors.onSurfaceVariant}
                />
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardLabel, Theme.typography.labelMd]}>
                  VENUE
                </Text>
                <Text style={[styles.cardValue, Theme.typography.bodyLg]}>
                  Hall A2
                </Text>
              </View>
            </View>

            {/* Geofence Status Badge */}
            <View style={styles.badgeWrapper}>
              <View style={styles.verifiedBadge}>
                <View style={styles.badgeDot} />
                <Text style={[styles.badgeText, Theme.typography.labelMd]}>
                  Verified inside Geofence
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Done Sticky Button */}
        <Animated.View
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.doneButton}
            activeOpacity={0.8}
            onPress={handleDone}
          >
            <Text style={[styles.doneBtnText, Theme.typography.headlineMd]}>
              Done
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  dotRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    padding: 24,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: Theme.colors.secondary,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: Theme.spacing.marginMobile,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  checkmarkWrapper: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
    position: "relative",
  },
  checkmarkRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Theme.colors.secondary,
    zIndex: 1,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    ...Theme.shadows.soft,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: Theme.spacing.xl,
    gap: Theme.spacing.xs,
  },
  successTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  classText: {
    color: Theme.colors.primary,
    fontWeight: "700",
    textAlign: "center",
  },
  detailsContainer: {
    width: "100%",
    gap: Theme.spacing.sm,
  },
  detailCard: {
    flexDirection: "row",
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Theme.colors.outlineVariant,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.md,
    alignItems: "center",
    ...Theme.shadows.soft,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Theme.rounded.default,
    backgroundColor: Theme.colors.surfaceContainerLow,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    color: Theme.colors.outline,
    fontWeight: "600",
  },
  cardValue: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
    marginTop: 2,
  },
  badgeWrapper: {
    alignItems: "center",
    marginTop: Theme.spacing.xs,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.secondary + "10",
    borderColor: Theme.colors.secondary + "20",
    borderWidth: 1,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 6,
    borderRadius: Theme.rounded.full,
    gap: Theme.spacing.xs,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.secondary,
  },
  badgeText: {
    color: Theme.colors.secondary,
    fontWeight: "600",
  },
  footer: {
    paddingVertical: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
  },
  doneButton: {
    height: 56,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.rounded.md,
    justifyContent: "center",
    alignItems: "center",
    ...Theme.shadows.soft,
  },
  doneBtnText: {
    color: Theme.colors.onPrimary,
    fontWeight: "700",
  },
});
