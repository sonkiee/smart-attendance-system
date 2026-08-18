import * as LocalAuth from "expo-local-authentication";
import { Alert, Linking, Platform } from "react-native";

export const authenticateBiometric = async () => {
  const result = await LocalAuth.authenticateAsync({
    promptMessage: "Verify your identity",
    cancelLabel: "Cancel",
    disableDeviceFallback: false, // Allow fallback to device PIN/password
    fallbackLabel: "Use PIN/Password", // Label for the fallback option
  });

  return result.success;
};

export const verifyAndSetupBiometrics = async () => {
  const hasHardware = await LocalAuth.hasHardwareAsync();

  //   if (!hasHardware) {
  //     return {
  //       success: false,
  //       reason: "NO_HARDWARE" as const,
  //     };
  //   }

  if (!hasHardware) {
    Alert.alert(
      "Biometrics Not Supported",
      "This device does not support fingerprint or face authentication.",
    );
    return false;
  }

  const isEnrolled = await LocalAuth.isEnrolledAsync();
  if (!isEnrolled) {
    Alert.alert(
      "Biometrics Not Enrolled",
      "No biometrics are enrolled on this device. Please register them in your device settings.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Settings",
          onPress: () => {
            if (Platform.OS === "ios") {
              Linking.openSettings();
            } else {
              Linking.sendIntent("android.settings.SECURITY_SETTINGS");
            }
          },
        },
      ],
    );
    return false;
  }

  // 3. Confirm Identity with a test scan
  const isVerified = await authenticateBiometric();
  if (!isVerified) {
    Alert.alert(
      "Authentication Failed",
      "Could not verify your identity. Biometric Log In remains disabled.",
    );
    return false;
  }

  return true;
};
