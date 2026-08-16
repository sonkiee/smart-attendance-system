import { useSignin } from "@/hooks/mutation/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../constants/theme";

export default function LoginScreen() {
  const { mutate, isPending } = useSignin();
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!id || !password) return;
    const data = { id, password };

    console.log(id);

    mutate(data, {
      onSuccess: () => {},
      onError: () => {},
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />

      {/* Decorative Atmospheric Background Circles */}
      <View style={styles.backgroundDecor} pointerEvents="none">
        <View style={styles.decorCircleLeft} />
        <View style={styles.decorCircleRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Brand Header */}
            <View style={styles.header}>
              <View style={[styles.logoIconBox, Theme.shadows.soft]}>
                <Ionicons
                  name="location"
                  size={36}
                  color={Theme.colors.onPrimary}
                  onPress={() => router.push("/(auth)/set-password")}
                />
              </View>
              <Text style={[styles.title, Theme.typography.headlineLg]}>
                Welcome Back
              </Text>
              <Text style={[styles.subtitle, Theme.typography.bodyMd]}>
                Secure biometric and geofence-verified attendance for modern
                campuses.
              </Text>
            </View>

            {/* Login Card */}
            <View style={[styles.card, Theme.shadows.soft]}>
              {/* ID Field */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, Theme.typography.labelMd]}>
                  Student or Staff ID
                </Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="card-outline"
                    size={20}
                    color={Theme.colors.outline}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, Theme.typography.bodyLg]}
                    placeholder="Enter your unique ID"
                    placeholderTextColor={Theme.colors.outlineVariant}
                    value={id}
                    onChangeText={setId}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <View style={styles.passwordLabelRow}>
                  <Text style={[styles.inputLabel, Theme.typography.labelMd]}>
                    Password
                  </Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={[styles.forgotText, Theme.typography.labelMd]}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={Theme.colors.outline}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, Theme.typography.bodyLg]}
                    placeholder="••••••••"
                    placeholderTextColor={Theme.colors.outlineVariant}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={Theme.colors.outline}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  success && styles.submitButtonSuccess,
                ]}
                activeOpacity={0.8}
                disabled={loading || success}
                onPress={handleSubmit}
              >
                {loading ? (
                  <ActivityIndicator
                    color={Theme.colors.onPrimary}
                    size="small"
                  />
                ) : success ? (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color={Theme.colors.onPrimary}
                  />
                ) : (
                  <View style={styles.submitBtnContent}>
                    <Text
                      style={[styles.submitText, Theme.typography.headlineMd]}
                    >
                      Sign In
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={Theme.colors.onPrimary}
                    />
                  </View>
                )}
              </TouchableOpacity>

              {/* Divider */}
              {/* <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={[styles.dividerText, Theme.typography.labelMd]}>
                  Quick Access
                </Text>
                <View style={styles.dividerLine} />
              </View> */}

              {/* Biometrics Options */}
              {/* <View style={styles.biometricsRow}>
                <TouchableOpacity
                  style={styles.bioButton}
                  activeOpacity={0.7}
                  onPress={handleBiometricLogin}
                >
                  <Ionicons name="finger-print-outline" size={28} color={Theme.colors.onSurfaceVariant} />
                  <Text style={[styles.bioText, Theme.typography.labelMd]}>Touch ID</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bioButton}
                  activeOpacity={0.7}
                  onPress={handleBiometricLogin}
                >
                  <Ionicons name="scan-outline" size={28} color={Theme.colors.onSurfaceVariant} />
                  <Text style={[styles.bioText, Theme.typography.labelMd]}>Face ID</Text>
                </TouchableOpacity>
              </View> */}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              {/* <Text style={[styles.registerPrompt, Theme.typography.bodyMd]}>
                Don{"'"}t have an account yet?{" "}
                <Text style={styles.registerLink}>Register Account</Text>
              </Text> */}

              <View style={styles.footerRow}>
                <View style={styles.statusContainer}>
                  <View style={styles.statusDot} />
                  <Text style={[styles.statusText, Theme.typography.labelMd]}>
                    System Online
                  </Text>
                </View>
                <View style={styles.versionContainer}>
                  <Ionicons
                    name="globe-outline"
                    size={14}
                    color={Theme.colors.outline}
                  />
                  <Text style={[styles.versionText, Theme.typography.labelMd]}>
                    v2.4.0-precision
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFill,
    zIndex: -1,
  },
  decorCircleLeft: {
    position: "absolute",
    top: "-10%",
    left: "-10%",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Theme.colors.secondaryContainer,
    opacity: 0.15,
  },
  decorCircleRight: {
    position: "absolute",
    bottom: "10%",
    right: "-10%",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Theme.colors.primaryContainer,
    opacity: 0.12,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingVertical: Theme.spacing.lg,
  },
  container: {
    width: "100%",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: Theme.spacing.xl,
  },
  logoIconBox: {
    width: 64,
    height: 64,
    borderRadius: Theme.rounded.md,
    backgroundColor: Theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  title: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    color: Theme.colors.onSurfaceVariant,
    textAlign: "center",
    paddingHorizontal: Theme.spacing.md,
  },
  card: {
    width: "100%",
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant + "40",
    borderWidth: 1,
    borderRadius: 24,
    padding: Theme.spacing.lg,
    gap: Theme.spacing.lg,
  },
  inputContainer: {
    gap: Theme.spacing.base,
  },
  inputLabel: {
    color: Theme.colors.outline,
    fontWeight: "600",
    paddingHorizontal: 4,
  },
  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotText: {
    color: Theme.colors.primary,
    fontWeight: "600",
  },
  inputWrapper: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Theme.colors.outlineVariant + "40",
    borderRadius: Theme.rounded.md,
    paddingHorizontal: Theme.spacing.md,
  },
  inputIcon: {
    marginRight: Theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    color: Theme.colors.onSurface,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: Theme.spacing.xs,
  },
  submitButton: {
    height: 56,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.rounded.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Theme.spacing.base,
  },
  submitButtonSuccess: {
    backgroundColor: Theme.colors.secondary,
  },
  submitBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.xs,
  },
  submitText: {
    color: Theme.colors.onPrimary,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Theme.spacing.base,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.outlineVariant + "30",
  },
  dividerText: {
    color: Theme.colors.outlineVariant,
    paddingHorizontal: Theme.spacing.md,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  biometricsRow: {
    flexDirection: "row",
    gap: Theme.spacing.md,
  },
  bioButton: {
    flex: 1,
    height: 80,
    borderRadius: Theme.rounded.md,
    borderWidth: 1,
    borderColor: Theme.colors.outlineVariant + "40",
    backgroundColor: Theme.colors.surfaceContainerLowest,
    justifyContent: "center",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  bioText: {
    color: Theme.colors.onSurfaceVariant,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: Theme.spacing.xl,
    width: "100%",
  },
  registerPrompt: {
    color: Theme.colors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: Theme.spacing.lg,
  },
  registerLink: {
    color: Theme.colors.primary,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Theme.spacing.lg,
    width: "100%",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.secondaryContainer + "15",
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 6,
    borderRadius: Theme.rounded.full,
    gap: Theme.spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.secondary,
  },
  statusText: {
    color: Theme.colors.secondary,
    fontWeight: "600",
  },
  versionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  versionText: {
    color: Theme.colors.outline,
  },
});
