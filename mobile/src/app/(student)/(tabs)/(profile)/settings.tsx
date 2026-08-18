import { MenuItem } from "@/components/menu-item";
import { Section } from "@/components/section";
import { Theme } from "@/constants/theme";
import { useBiometric } from "@/hooks/use-biometric";
import { useSettingsStore } from "@/store/settings-store";
import { router } from "expo-router";
import {
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

export default function AccountSettings() {
  // Settings State

  const {
    biometricsEnabled,
    pushNotifications,
    checkInReminders,
    emailReports,
    setSetting,
  } = useSettingsStore();

  const { setupBiometrics } = useBiometric();

  const handleBiometricToggle = async (newValue: boolean) => {
    if (newValue) {
      const success = await setupBiometrics();
      if (success) {
        setSetting("biometricsEnabled", true);
      }
    } else {
      setSetting("biometricsEnabled", false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Section title="SECURITY">
          <MenuItem
            label="Biometric Log In"
            description="Use Face ID or Fingerprint"
            icon="finger-print-outline"
            hasSwitch
            switchValue={biometricsEnabled}
            onValueChange={handleBiometricToggle}
          />

          <MenuItem
            label="Change Security PIN"
            description="Set a new 4-digit code"
            icon="lock-closed-outline"
            onPress={() => router.push("/change-pin")}
          />
        </Section>

        <Section title="LOCATION & PERMISSIONS">
          <MenuItem
            label="Permissions Status"
            description="Manage device settings"
            icon="map-outline"
            onPress={() => {
              if (Platform.OS === "ios") {
                Linking.openSettings();
              } else {
                Linking.sendIntent("android.settings.LOCATION_SOURCE_SETTINGS");
              }
            }}
          />
        </Section>

        <Section title="NOTIFICATIONS">
          <MenuItem
            label="Push Notifications"
            description="Class start & reminder alerts"
            icon="notifications-outline"
            hasSwitch
            switchValue={pushNotifications}
            onValueChange={(val) => setSetting("pushNotifications", val)}
          />
          {/* <MenuItem
            label="Check-in Reminders"
            description="Alert when inside class area"
            icon="alarm-outline"
            hasSwitch
            switchValue={checkInReminders}
            onValueChange={setCheckInReminders}
          />
          <MenuItem
            label="Weekly Reports"
            description="Weekly summary in email inbox"
            icon="mail-outline"
            hasSwitch
            switchValue={emailReports}
            onValueChange={setEmailReports}
          /> */}
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingTop: Theme.spacing.md,
    paddingBottom: 40,
  },
});
