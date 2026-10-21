import { SessionCard } from "@/components/session-card";
import { Theme } from "@/constants/theme";
import { useProfile, useSessionById } from "@/hooks/queries/user";
import { getCurrentLocation } from "@/service/location";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AttendanceScreen() {
  const router = useRouter();
  const sessionId = useLocalSearchParams().id;
  console.log("sessionId", sessionId);

  const { data, isPending } = useSessionById(sessionId as string);
  const { data: userProfile } = useProfile();
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const mapPulseAnim = useMemo(() => new Animated.Value(0.95), []);

  const isRep =
    !!userProfile?.student?.id &&
    !!data?.courseRepStudentId &&
    userProfile.student.id === data.courseRepStudentId;

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const loc = await getCurrentLocation();
        setUserLocation({ latitude: loc.latitude, longitude: loc.longitude });
      } catch (err) {
        console.error("Error getting user location for static map:", err);
      }
    };
    fetchUserLocation();
  }, []);

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

  const GEOAPIFY_API_KEY = "526b4cda7ef34bcab3650b2bdd4136e2";

  const venueLon = data?.venue?.longitude ?? 7.4512039;
  const venueLat = data?.venue?.latitude ?? 10.4904007;
  const userLon = userLocation?.longitude ?? venueLon;
  const userLat = userLocation?.latitude ?? venueLat;

  const mapUri =
    `https://maps.geoapify.com/v1/staticmap` +
    `?style=osm-bright-smooth` +
    `&width=600` +
    `&height=400` +
    `&center=lonlat:${venueLon},${venueLat}` +
    `&zoom=17` +
    `&marker=lonlat:${venueLon},${venueLat};type:awesome;color:%23004ac6;size:large;icon:school` +
    `&marker=lonlat:${userLon},${userLat};type:awesome;color:%23006c4a;size:medium;icon:circle` +
    `&apiKey=${GEOAPIFY_API_KEY}`;

  const handleMarkAttendancePress = () => {
    router.push({
      pathname: "/to-submit",
      params: { id: sessionId },
    });
  };

  if (isPending) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </SafeAreaView>
    );
  }

  const formattedTime =
    data?.startTime && data?.endTime
      ? `${data.startTime.substring(0, 5)} - ${data.endTime.substring(0, 5)}`
      : data?.startTime
        ? data.startTime.substring(0, 5)
        : "--:--";

  const formattedDate = data?.sessionDate
    ? new Date(data.sessionDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Today";

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
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
              Today, {formattedDate}
            </Text>
            <Text
              style={[
                styles.timeText,
                Theme.typography.bodyMd,
                styles.semibold,
              ]}
            >
              {data?.startTime ? data.startTime.substring(0, 5) : formattedTime}
            </Text>
          </View>
        </View>

        {/* Active Class Card */}
        <SessionCard
          title={
            data?.courseCode && data?.courseTitle
              ? `${data.courseCode}: ${data.courseTitle}`
              : data?.courseCode || data?.courseTitle || "Class Session"
          }
          location={data?.venueName || "Classroom"}
          time={formattedTime}
          interactive={false}
          rightAction="ellipsis"
        />

        {/* Course Rep Delegation Action Card */}
        {data?.allowRepMarking && isRep && (
          <TouchableOpacity
            style={styles.repCard}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/(student)/rep-roll/[id]",
                params: { id: sessionId as string },
              })
            }
          >
            <View style={styles.repCardHeader}>
              <View style={styles.repBadge}>
                <Ionicons
                  name="shield-checkmark"
                  size={14}
                  color={Theme.colors.secondary}
                />
                <Text style={styles.repBadgeText}>COURSE REP DELEGATION</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Theme.colors.secondary}
              />
            </View>

            <Text style={[styles.repTitle, Theme.typography.headlineMd]}>
              Take Class Roll Call
            </Text>
            <Text style={[styles.repSubtitle, Theme.typography.caption]}>
              Lecturer has authorized you to mark attendance for your peers. Tap here to view the class roster and check students in.
            </Text>

            <View style={styles.repActionRow}>
              <Text style={styles.repActionText}>OPEN CLASS ROLL CALL</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={Theme.colors.secondary}
              />
            </View>
          </TouchableOpacity>
        )}

        {/* Informational note for peers when rep delegation is active */}
        {data?.allowRepMarking && !isRep && (
          <View style={styles.repInfoBadge}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={Theme.colors.secondary}
            />
            <Text style={styles.repInfoText}>
              Course Rep roll call is enabled by the lecturer for this session.
            </Text>
          </View>
        )}

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
        {/* Option A: Static Map Preview Card */}
        <View style={styles.mapCard}>
          <Image
            style={styles.mapBackground}
            source={{
              uri: mapUri,
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
              Live Location: {data?.venueName || "Classroom"} Area
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 10,
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
  repCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.secondary + "40",
    borderWidth: 1.5,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.md,
    marginVertical: Theme.spacing.sm,
    ...Theme.shadows.soft,
  },
  repCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.xs,
  },
  repBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Theme.colors.secondary + "15",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.rounded.full,
  },
  repBadgeText: {
    color: Theme.colors.secondary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  repTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
    marginTop: 6,
  },
  repSubtitle: {
    color: Theme.colors.outline,
    marginTop: 4,
    lineHeight: 18,
  },
  repActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: Theme.spacing.md,
    paddingTop: Theme.spacing.xs,
  },
  repActionText: {
    color: Theme.colors.secondary,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  repInfoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Theme.colors.secondary + "10",
    borderColor: Theme.colors.secondary + "30",
    borderWidth: 1,
    padding: Theme.spacing.sm,
    borderRadius: Theme.rounded.sm,
    marginVertical: Theme.spacing.xs,
  },
  repInfoText: {
    color: Theme.colors.secondary,
    fontSize: 12,
    flex: 1,
    fontWeight: "500",
  },
});
