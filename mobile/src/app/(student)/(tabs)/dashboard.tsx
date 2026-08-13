import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function StudentDashboard() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationState, setVerificationState] = useState<
    "verifying" | "verified" | "success"
  >("verifying");
  const [showBiometric, setShowBiometric] = useState(false);
  const [bioProcessing, setBioProcessing] = useState(false);
  const [bioSuccess, setBioSuccess] = useState(false);

  // Animations
  const pulseAnim1 = useMemo(() => new Animated.Value(0.8), []);
  const pulseOpacity1 = useMemo(() => new Animated.Value(0.5), []);
  const pulseAnim2 = useMemo(() => new Animated.Value(0.8), []);
  const pulseOpacity2 = useMemo(() => new Animated.Value(0.5), []);

  const mapPulseAnim = useMemo(() => new Animated.Value(0.95), []);

  const checkmarkScale = useMemo(() => new Animated.Value(0), []);
  const bioFadeAnim = useMemo(() => new Animated.Value(0), []);
  const bioTranslateAnim = useMemo(() => new Animated.Value(16), []);

  // Map pulse animation (dashboard)
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(mapPulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(mapPulseAnim, {
          toValue: 0.95,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();
  }, [mapPulseAnim]);

  // Modal pulse animation
  const startModalPulses = () => {
    pulseAnim1.setValue(0.8);
    pulseOpacity1.setValue(0.5);
    pulseAnim2.setValue(0.8);
    pulseOpacity2.setValue(0.5);

    Animated.loop(
      Animated.parallel([
        Animated.timing(pulseAnim1, {
          toValue: 1.5,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(pulseOpacity1, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Stagger second pulse
    setTimeout(() => {
      Animated.loop(
        Animated.parallel([
          Animated.timing(pulseAnim2, {
            toValue: 1.5,
            duration: 2000,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(pulseOpacity2, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }, 500);
  };

  const handleMarkAttendancePress = () => {
    setModalVisible(true);
    setVerificationState("verifying");
    setShowBiometric(false);
    setBioProcessing(false);
    setBioSuccess(false);
    checkmarkScale.setValue(0);
    bioFadeAnim.setValue(0);
    bioTranslateAnim.setValue(16);

    // Start radar pulse animation
    startModalPulses();

    // State machine timeline simulation
    setTimeout(() => {
      setVerificationState("verified");

      // Animate checkmark scale-in
      Animated.spring(checkmarkScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }).start();

      // Show biometric prompt after a slight delay
      setTimeout(() => {
        setShowBiometric(true);
        Animated.parallel([
          Animated.timing(bioFadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(bioTranslateAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      }, 300);
    }, 2500);
  };

  const handleBiometricVerification = () => {
    setBioProcessing(true);

    setTimeout(() => {
      setBioProcessing(false);
      setBioSuccess(true);

      // Transition to success screen after showing check success badge
      setTimeout(() => {
        setModalVisible(false);
        router.push("/(student)/success");
      }, 1000);
    }, 1500);
  };

  const handleBackToSelect = () => {
    router.replace("/");
  };

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
          <View>
            <Text style={[styles.greeting, Theme.typography.headlineMd]}>
              Hello, Kennedy
            </Text>
            <Text style={[styles.degreeText, Theme.typography.labelMd]}>
              CSC 423 • Computer Science
            </Text>
          </View>
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
        {/* Proximity / Location Info */}
        <View style={styles.statusRow}>
          <View style={styles.geofenceBadge}>
            <Animated.View
              style={[
                styles.geofenceDot,
                { transform: [{ scale: mapPulseAnim }] },
              ]}
            />
            <Text style={[styles.geofenceText, Theme.typography.labelMd]}>
              Inside Geofence 🟢
            </Text>
          </View>
          <View style={styles.dateTimeContainer}>
            <Text style={[styles.dateText, Theme.typography.caption]}>
              Today, Oct 24
            </Text>
            <Text
              style={[
                styles.timeText,
                Theme.typography.bodyMd,
                styles.semibold,
              ]}
            >
              09:42 AM
            </Text>
          </View>
        </View>

        {/* Active Class Card */}
        <View style={styles.activeClassCard}>
          <View style={styles.cardDecorativeCircle} />
          <View style={styles.activeTagRow}>
            <View style={styles.activePill}>
              <Text style={[styles.activePillText, Theme.typography.labelMd]}>
                ACTIVE NOW
              </Text>
            </View>
            <TouchableOpacity style={styles.moreBtn}>
              <Ionicons
                name="ellipsis-vertical"
                size={20}
                color={Theme.colors.outline}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.classTitle, Theme.typography.headlineMd]}>
            CSC 423: Compiler Construction I
          </Text>

          <View style={styles.classDetailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons
                name="location"
                size={20}
                color={Theme.colors.primary}
              />
              <Text style={[styles.detailText, Theme.typography.bodyMd]}>
                Hall A2
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time" size={20} color={Theme.colors.primary} />
              <Text style={[styles.detailText, Theme.typography.bodyMd]}>
                10:00 - 12:00
              </Text>
            </View>
          </View>
        </View>

        {/* Large Mark Attendance Button */}
        <TouchableOpacity
          style={[styles.ctaButton, Theme.shadows.attendanceButton]}
          activeOpacity={0.8}
          onPress={handleMarkAttendancePress}
        >
          <Ionicons
            name="finger-print"
            size={24}
            color={Theme.colors.onPrimary}
          />
          <Text style={[styles.ctaText, Theme.typography.headlineMd]}>
            MARK ATTENDANCE
          </Text>
        </TouchableOpacity>

        {/* Map Preview Card */}
        <View style={styles.mapCard}>
          <Image
            style={styles.mapBackground}
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrD47C7tIHpYtvRiO6LWSBy0tdbDWIiyxIKa8InL7hkJDaIMwHx2KrQVZAMUBbWW-Ug0QTwoa8Uu0oKoxGivdBbPpKzSRrrQ0WQHDxFrJqPV2cFLZzNODb9u5H9B7AxvzG3Z72Xy8ZmtEikk84WTLi8IMhVRT150ioYlkh2xWJmr0pcw8LfBOwUIqzCDdh696Dhzpi7VEfhbSvWnCfQO7d04pDx9oKSdsuxZwC393_7OV88N4aZmA",
            }}
            contentFit="cover"
          />
          <View style={styles.mapOverlay}>
            <Animated.View
              style={[
                styles.mapPulseRing,
                {
                  transform: [{ scale: mapPulseAnim }],
                },
              ]}
            />
            <View style={styles.mapDot} />
          </View>
          <View style={styles.mapLabel}>
            <Text style={[styles.mapLabelText, Theme.typography.labelMd]}>
              Live Location: Hall A2 Area
            </Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityHeader}>
          <Text style={[styles.activityTitle, Theme.typography.headlineMd]}>
            Recent Activity
          </Text>
          <TouchableOpacity>
            <Text style={[styles.viewAllBtn, Theme.typography.labelMd]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityList}>
          {/* Item 1 */}
          <View style={styles.activityItem}>
            <View style={styles.activityIconBox}>
              <Ionicons
                name="code-working"
                size={24}
                color={Theme.colors.primary}
              />
            </View>
            <View style={styles.activityMeta}>
              <Text
                style={[
                  styles.activityClassName,
                  Theme.typography.bodyMd,
                  styles.semibold,
                ]}
              >
                CSC 401: Algorithms
              </Text>
              <Text style={[styles.activityDate, Theme.typography.caption]}>
                Yesterday • 08:30 AM
              </Text>
            </View>
            <View style={styles.presentBadge}>
              <Text style={[styles.presentText, Theme.typography.labelMd]}>
                PRESENT
              </Text>
            </View>
          </View>

          {/* Item 2 */}
          <View style={styles.activityItem}>
            <View style={styles.activityIconBox}>
              <Ionicons name="server" size={24} color={Theme.colors.primary} />
            </View>
            <View style={styles.activityMeta}>
              <Text
                style={[
                  styles.activityClassName,
                  Theme.typography.bodyMd,
                  styles.semibold,
                ]}
              >
                CSC 411: DB Management
              </Text>
              <Text style={[styles.activityDate, Theme.typography.caption]}>
                Oct 22 • 02:00 PM
              </Text>
            </View>
            <View style={styles.presentBadge}>
              <Text style={[styles.presentText, Theme.typography.labelMd]}>
                PRESENT
              </Text>
            </View>
          </View>

          {/* Item 3 */}
          <View style={styles.activityItem}>
            <View style={styles.activityIconBox}>
              <Ionicons
                name="terminal"
                size={24}
                color={Theme.colors.primary}
              />
            </View>
            <View style={styles.activityMeta}>
              <Text
                style={[
                  styles.activityClassName,
                  Theme.typography.bodyMd,
                  styles.semibold,
                ]}
              >
                CSC 421: OS Lab
              </Text>
              <Text style={[styles.activityDate, Theme.typography.caption]}>
                Oct 21 • 11:00 AM
              </Text>
            </View>
            <View style={styles.presentBadge}>
              <Text style={[styles.presentText, Theme.typography.labelMd]}>
                PRESENT
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Tab Bar Mock */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItemActive}>
          <Ionicons
            name="home"
            size={24}
            color={Theme.colors.onSecondaryContainer}
          />
          <Text style={[styles.navTextActive, Theme.typography.labelMd]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.replace("/(student)/history")}
        >
          <Ionicons
            name="time-outline"
            size={24}
            color={Theme.colors.onSurfaceVariant}
          />
          <Text style={[styles.navText, Theme.typography.labelMd]}>
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.replace("/(student)/profile")}
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

      {/* Verification Modal (Bottom Sheet Modal) */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalDismissTrigger}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.bottomSheet}>
            <View style={styles.dragHandle} />

            <View style={styles.modalContent}>
              {verificationState === "verifying" ? (
                // State 1: Verifying Location
                <View style={styles.stateContainer}>
                  <View style={styles.radarWrapper}>
                    <Animated.View
                      style={[
                        styles.radarPulse,
                        {
                          transform: [{ scale: pulseAnim1 }],
                          opacity: pulseOpacity1,
                        },
                      ]}
                    />
                    <Animated.View
                      style={[
                        styles.radarPulse,
                        {
                          transform: [{ scale: pulseAnim2 }],
                          opacity: pulseOpacity2,
                        },
                      ]}
                    />
                    <View style={styles.radarCore}>
                      <Ionicons
                        name="location"
                        size={32}
                        color={Theme.colors.onPrimary}
                      />
                    </View>
                  </View>
                  <Text
                    style={[styles.modalHeadline, Theme.typography.headlineLg]}
                  >
                    Verifying location...
                  </Text>
                  <Text
                    style={[styles.modalSubheadline, Theme.typography.bodyMd]}
                  >
                    Stay within the room perimeter
                  </Text>
                </View>
              ) : (
                // State 2: Verified Location
                <View style={styles.stateContainer}>
                  <Animated.View
                    style={[
                      styles.successIconBox,
                      { transform: [{ scale: checkmarkScale }] },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={80}
                      color={Theme.colors.secondary}
                    />
                  </Animated.View>
                  <Text
                    style={[
                      styles.modalHeadline,
                      Theme.typography.headlineLg,
                      { color: Theme.colors.secondary },
                    ]}
                  >
                    Geofence Verified
                  </Text>
                  <Text
                    style={[styles.modalSubheadline, Theme.typography.bodyMd]}
                  >
                    Location matched:{" "}
                    <Text style={styles.semibold}>Hall A2</Text>
                  </Text>
                </View>
              )}

              {/* Biometrics Verify Identity */}
              {showBiometric && (
                <Animated.View
                  style={[
                    styles.biometricContainer,
                    {
                      opacity: bioFadeAnim,
                      transform: [{ translateY: bioTranslateAnim }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.bioButton,
                      bioSuccess && styles.bioButtonSuccess,
                    ]}
                    activeOpacity={0.8}
                    disabled={bioProcessing || bioSuccess}
                    onPress={handleBiometricVerification}
                  >
                    {bioProcessing ? (
                      <View style={styles.btnRow}>
                        <ActivityIndicator
                          color={Theme.colors.onPrimary}
                          size="small"
                          style={styles.spinner}
                        />
                        <Text
                          style={[
                            styles.bioBtnText,
                            Theme.typography.headlineMd,
                          ]}
                        >
                          Processing...
                        </Text>
                      </View>
                    ) : bioSuccess ? (
                      <View style={styles.btnRow}>
                        <Ionicons
                          name="checkmark"
                          size={24}
                          color={Theme.colors.onPrimary}
                        />
                        <Text
                          style={[
                            styles.bioBtnText,
                            Theme.typography.headlineMd,
                          ]}
                        >
                          Success
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.btnRow}>
                        <Ionicons
                          name="finger-print"
                          size={24}
                          color={Theme.colors.onPrimary}
                        />
                        <Text
                          style={[
                            styles.bioBtnText,
                            Theme.typography.headlineMd,
                          ]}
                        >
                          Verify Identity
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <Text style={[styles.bioCaption, Theme.typography.labelMd]}>
                    Use PIN if Biometrics fail
                  </Text>
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </Modal>
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
