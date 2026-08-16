import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AccountSettings() {
  const router = useRouter();

  // Settings State
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [geofenceVerification, setGeofenceVerification] = useState(true);
  const [highAccuracyGps, setHighAccuracyGps] = useState(true);

  const [pushNotifications, setPushNotifications] = useState(true);
  const [checkInReminders, setCheckInReminders] = useState(true);
  const [emailReports, setEmailReports] = useState(false);

  const [profileVisible, setProfileVisible] = useState(true);

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
        {/* Section 1: Security & Biometrics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, Theme.typography.labelMd]}>
            SECURITY & BIOMETRICS
          </Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="finger-print-outline"
                    size={20}
                    color={Theme.colors.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.rowTitle, Theme.typography.bodyLg]}>
                    Biometric Log In
                  </Text>
                  <Text style={[styles.rowSubtitle, Theme.typography.caption]}>
                    Use Face ID or Fingerprint
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricsEnabled}
                onValueChange={setBiometricsEnabled}
                trackColor={{
                  false: Theme.colors.surfaceVariant,
                  true: Theme.colors.primary,
                }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="key-outline"
                    size={20}
                    color={Theme.colors.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.rowTitle, Theme.typography.bodyLg]}>
                    Remember Me
                  </Text>
                  <Text style={[styles.rowSubtitle, Theme.typography.caption]}>
                    Keep session active
                  </Text>
                </View>
              </View>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{
                  false: Theme.colors.surfaceVariant,
                  true: Theme.colors.primary,
                }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={Theme.colors.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.rowTitle, Theme.typography.bodyLg]}>
                    Change Security PIN
                  </Text>
                  <Text style={[styles.rowSubtitle, Theme.typography.caption]}>
                    Set a new 4-digit code
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Theme.colors.outline}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 2: Location & Geofencing */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, Theme.typography.labelMd]}>
            LOCATION & GEOFENCING
          </Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="locate-outline"
                    size={20}
                    color={Theme.colors.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.rowTitle, Theme.typography.bodyLg]}>
                    Auto-Geofence Check
                  </Text>
                  <Text style={[styles.rowSubtitle, Theme.typography.caption]}>
                    Automate location validation
                  </Text>
                </View>
              </View>
              <Switch
                value={geofenceVerification}
                onValueChange={setGeofenceVerification}
                trackColor={{
                  false: Theme.colors.surfaceVariant,
                  true: Theme.colors.primary,
                }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="navigate-outline"
                    size={20}
                    color={Theme.colors.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.rowTitle, Theme.typography.bodyLg]}>
                    High Accuracy GPS
                  </Text>
                  <Text style={[styles.rowSubtitle, Theme.typography.caption]}>
                    Improves location accuracy
                  </Text>
                </View>
              </View>
              <Switch
                value={highAccuracyGps}
                onValueChange={setHighAccuracyGps}
                trackColor={{
                  false: Theme.colors.surfaceVariant,
                  true: Theme.colors.primary,
                }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="map-outline"
                    size={20}
                    color={Theme.colors.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.rowTitle, Theme.typography.bodyLg]}>
                    Permissions Status
                  </Text>
                  <Text style={[styles.rowSubtitle, Theme.typography.caption]}>
                    Always Allowed • Manage Settings
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Theme.colors.outline}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 3: Notification Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, Theme.typography.labelMd]}>
            NOTIFICATIONS
          </Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={Theme.colors.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.rowTitle, Theme.typography.bodyLg]}>
                    Push Notifications
                  </Text>
                  <Text style={[styles.rowSubtitle, Theme.typography.caption]}>
                    Class start & reminder alerts
                  </Text>
                </View>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{
                  false: Theme.colors.surfaceVariant,
                  true: Theme.colors.primary,
                }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="alarm-outline"
                    size={20}
                    color={Theme.colors.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.rowTitle, Theme.typography.bodyLg]}>
                    Check-in Reminders
                  </Text>
                  <Text style={[styles.rowSubtitle, Theme.typography.caption]}>
                    Alert when inside class area
                  </Text>
                </View>
              </View>
              <Switch
                value={checkInReminders}
                onValueChange={setCheckInReminders}
                trackColor={{
                  false: Theme.colors.surfaceVariant,
                  true: Theme.colors.primary,
                }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={Theme.colors.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.rowTitle, Theme.typography.bodyLg]}>
                    Weekly Reports
                  </Text>
                  <Text style={[styles.rowSubtitle, Theme.typography.caption]}>
                    Weekly summary in email inbox
                  </Text>
                </View>
              </View>
              <Switch
                value={emailReports}
                onValueChange={setEmailReports}
                trackColor={{
                  false: Theme.colors.surfaceVariant,
                  true: Theme.colors.primary,
                }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        {/* Section 4: Privacy Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, Theme.typography.labelMd]}>
            PRIVACY & DATA
          </Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="eye-outline"
                    size={20}
                    color={Theme.colors.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.rowTitle, Theme.typography.bodyLg]}>
                    Profile Visibility
                  </Text>
                  <Text style={[styles.rowSubtitle, Theme.typography.caption]}>
                    Visible to class list rosters
                  </Text>
                </View>
              </View>
              <Switch
                value={profileVisible}
                onValueChange={setProfileVisible}
                trackColor={{
                  false: Theme.colors.surfaceVariant,
                  true: Theme.colors.primary,
                }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Theme.spacing.md,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Theme.rounded.default,
    backgroundColor: Theme.colors.surfaceContainerLow,
    justifyContent: "center",
    alignItems: "center",
  },
  rowTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "600",
  },
  rowSubtitle: {
    color: Theme.colors.outline,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.outlineVariant + "30",
    marginHorizontal: Theme.spacing.md,
  },
});
