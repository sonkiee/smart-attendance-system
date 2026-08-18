import { SessionCard } from "@/components/session-card";
import { Theme } from "@/constants/theme";
import { useSessionById } from "@/hooks/queries/user";
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
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const mapPulseAnim = useMemo(() => new Animated.Value(0.95), []);

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

  const GEOAPIFY_API_KEY = "526b4cda7ef34bcab3650b2bdd4136e2"; // Replace with your actual API key

  const venueLonLat = "7.4512039,10.4904007";
  const userLonLat = "7.450611777383408,10.489893913819477";

  const mapUri =
    `https://maps.geoapify.com/v1/staticmap` +
    `?style=osm-bright` +
    `&width=600` +
    `&height=400` +
    `&center=lonlat:${venueLonLat}` +
    `&zoom=18` +
    `&marker=lonlat:${venueLonLat};type:circle;color:%23ff0000;size:large` +
    `&marker=lonlat:${userLonLat};type:circle;color:%230000ff;size:large` +
    `&geometry=LINESTRING(${userLonLat},${venueLonLat});stroke:%230000ff;stroke-width:4` +
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
      : "17:38 - 20:38";

  const formattedDate = data?.sessionDate
    ? new Date(data.sessionDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Aug 16";

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
              09:42 AM
            </Text>
          </View>
        </View>

        {/* Active Class Card */}
        <SessionCard
          title={`${data?.courseCode || "CSC 401"}: ${data?.courseTitle || "Mobile App Development"}`}
          location={data?.venueName || "Computer Science Lab"}
          time={formattedTime}
          interactive={false}
          rightAction="ellipsis"
        />
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
              uri: "https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat%3A-122.29009844646316%2C47.54607447032754&zoom=14.3497&marker=lonlat%3A-122.29188334609739%2C47.54403990655936%3Btype%3Aawesome%3Bcolor%3A%23bb3f73%3Bsize%3Ax-large%3Bicon%3Apaw%7Clonlat%3A-122.29282631194182%2C47.549609195001494%3Btype%3Amaterial%3Bcolor%3A%234c905a%3Bicon%3Atree%3Bicontype%3Aawesome%7Clonlat%3A-122.28726954893025%2C47.541766557545884%3Btype%3Amaterial%3Bcolor%3A%234c905a%3Bicon%3Atree%3Bicontype%3Aawesome&apiKey=526b4cda7ef34bcab3650b2bdd4136e2",
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
              Live Location: {data?.venueName || "Computer Science Lab"} Area
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
});
