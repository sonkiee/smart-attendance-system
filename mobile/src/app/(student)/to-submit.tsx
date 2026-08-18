import { PinVerify } from "@/components/pin-verify";
import { Theme } from "@/constants/theme";
import { useClockIn } from "@/hooks/mutation/use-auth";
import { useSessionById } from "@/hooks/queries/user";
import { useBiometric } from "@/hooks/use-biometric";
import { useGeofence } from "@/hooks/use-geofence";
import { useAuthStore } from "@/store/auth-store";
import { useSettingsStore } from "@/store/settings-store";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type VerificationState =
  | "locating"
  | "biometric"
  | "pin-fallback"
  | "submitting"
  | "error";

export default function ToSubmit() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Stores
  const { biometricsEnabled } = useSettingsStore();
  const { securityPin } = useAuthStore();

  // Queries & Mutations
  const { data: session, isPending: sessionLoading } = useSessionById(id);
  const { verifyLocation } = useGeofence();
  const { authenticate, isProcessing: isBioProcessing } = useBiometric();
  const { mutate: clockIn } = useClockIn();

  // Local state
  const [state, setState] = useState<VerificationState>("locating");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (session) {
      handleLocationCheck();
    }
  }, [session]);

  const handleLocationCheck = async () => {
    try {
      setState("locating");
      setErrorMsg(null);

      if (
        session?.venue?.latitude == null ||
        session?.venue?.longitude == null ||
        session?.venue?.radius == null
      ) {
        throw new Error("Venue location coordinates are not defined.");
      }

      const result = await verifyLocation({
        latitude: Number(session.venue.latitude),
        longitude: Number(session.venue.longitude),
        radius: Number(100), // 100 meters radius for geofence
      });

      if (!result.isWithinGeofence) {
        throw new Error("You are outside the classroom perimeter.");
      }

      setUserLocation({
        latitude: result.location.latitude,
        longitude: result.location.longitude,
      });

      // After location check succeeds:
      if (biometricsEnabled) {
        // Option 1: biometrics enabled -> go to biometric screen and automatically prompt
        setState("biometric");
        handleBiometric(result.location.latitude, result.location.longitude);
      } else {
        // Option 2: biometrics disabled -> go straight to PIN entry if a PIN is set
        if (securityPin) {
          setState("pin-fallback");
        } else {
          // If no biometrics and no PIN is set, throw error
          throw new Error(
            "Biometrics is disabled and no security PIN is set in settings.",
          );
        }
      }
    } catch (err: any) {
      console.error("Location verification failed:", err);
      setErrorMsg(err.message || "Could not verify your location.");
      setState("error");
    }
  };

  const handleBiometric = async (lat?: number, lng?: number) => {
    setState("biometric");
    setErrorMsg(null);

    const success = await authenticate();
    const latitude = lat ?? userLocation?.latitude ?? 0;
    const longitude = lng ?? userLocation?.longitude ?? 0;

    if (success) {
      handleSubmit(latitude, longitude);
    } else {
      // Biometrics failed/cancelled -> fallback to PIN if set
      if (securityPin) {
        setState("pin-fallback");
      } else {
        setErrorMsg(
          "Biometrics verification failed and no security PIN is set.",
        );
        setState("error");
      }
    }
  };

  const handleSubmit = (latitude: number, longitude: number) => {
    setState("submitting");
    setErrorMsg(null);

    clockIn(
      {
        sessionId: id,
        latitude,
        longitude,
        bleVerified: false,
        deviceId: "device-id-placeholder",
        attendanceCode: "123456", // dummy attendance code
      },
      {
        onSuccess: () => {
          router.replace({
            pathname: "/(student)/success",
            params: { id },
          });
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Failed to submit attendance to server.");
          setState("error");
        },
      },
    );
  };

  if (sessionLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          sheetAllowedDetents: state === "pin-fallback" ? [0.9] : [0.5],
        }}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, Theme.typography.headlineLg]}>
            Verification
          </Text>
        </View>

        <View style={styles.content}>
          {state === "locating" && (
            <View style={styles.stateWrapper}>
              <ActivityIndicator
                size="large"
                color={Theme.colors.primary}
                style={styles.spinner}
              />
              <Text style={[styles.title, Theme.typography.headlineMd]}>
                Verifying Location
              </Text>
              <Text style={[styles.subtitle, Theme.typography.bodyMd]}>
                Checking if you are inside the room perimeter...
              </Text>
            </View>
          )}

          {state === "biometric" && (
            <View style={styles.stateWrapper}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="finger-print"
                  size={48}
                  color={Theme.colors.primary}
                />
              </View>
              <Text style={[styles.title, Theme.typography.headlineMd]}>
                Ready to Submit
              </Text>
              <Text style={[styles.subtitle, Theme.typography.bodyMd]}>
                Tap the button below to verify your identity and submit.
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={() => handleBiometric()}
                disabled={isBioProcessing}
              >
                {isBioProcessing ? (
                  <ActivityIndicator
                    color={Theme.colors.onPrimary}
                    size="small"
                  />
                ) : (
                  <Text style={[styles.buttonText, Theme.typography.bodyLg]}>
                    Verify Biometrics
                  </Text>
                )}
              </TouchableOpacity>

              {securityPin && (
                <TouchableOpacity
                  style={styles.secondaryLink}
                  onPress={() => setState("pin-fallback")}
                >
                  <Text style={styles.secondaryLinkText}>
                    Use Security PIN instead
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {state === "pin-fallback" && (
            <PinVerify
              correctPin={securityPin || ""}
              onSuccess={() =>
                handleSubmit(
                  userLocation?.latitude ?? 0,
                  userLocation?.longitude ?? 0,
                )
              }
              onCancel={
                biometricsEnabled ? () => setState("biometric") : undefined
              }
            />
          )}

          {state === "submitting" && (
            <View style={styles.stateWrapper}>
              <ActivityIndicator
                size="large"
                color={Theme.colors.secondary}
                style={styles.spinner}
              />
              <Text style={[styles.title, Theme.typography.headlineMd]}>
                Submitting Attendance
              </Text>
              <Text style={[styles.subtitle, Theme.typography.bodyMd]}>
                Recording your clock-in record...
              </Text>
            </View>
          )}

          {state === "error" && (
            <View style={styles.stateWrapper}>
              <View style={[styles.iconBox, styles.errorIconBox]}>
                <Ionicons
                  name="alert-circle-outline"
                  size={48}
                  color={Theme.colors.error}
                />
              </View>
              <Text
                style={[
                  styles.title,
                  Theme.typography.headlineMd,
                  { color: Theme.colors.error },
                ]}
              >
                Verification Failed
              </Text>
              <Text style={[styles.errorText, Theme.typography.bodyMd]}>
                {errorMsg}
              </Text>

              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={handleLocationCheck}
              >
                <Text style={[styles.buttonText, Theme.typography.bodyLg]}>
                  Retry Verification
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.outlineVariant + "20",
  },
  headerTitle: {
    fontWeight: "700",
    color: Theme.colors.onBackground,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  stateWrapper: {
    alignItems: "center",
    width: "100%",
  },
  spinner: {
    marginBottom: 24,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.surfaceContainerLow,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  errorIconBox: {
    backgroundColor: Theme.colors.errorContainer + "20",
  },
  title: {
    fontWeight: "700",
    color: Theme.colors.onBackground,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: Theme.colors.outline,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  errorText: {
    color: Theme.colors.error,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: Theme.rounded.md,
    width: "100%",
    alignItems: "center",
    marginTop: 32,
    ...Theme.shadows.soft,
  },
  buttonText: {
    color: Theme.colors.onPrimary,
    fontWeight: "600",
  },
  secondaryLink: {
    marginTop: 16,
    paddingVertical: 8,
  },
  secondaryLinkText: {
    color: Theme.colors.primary,
    fontWeight: "600",
  },
});
