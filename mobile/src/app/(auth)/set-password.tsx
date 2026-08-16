import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Validation checks
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password && password === confirmPassword;

  const isFormValid =
    hasMinLength && hasNumber && hasSpecialChar && passwordsMatch;

  const handleSubmit = () => {
    if (!isFormValid) return;

    setLoading(true);
    setErrorMsg("");

    // Simulate API call to set new password
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // Redirect to login after showing success badge
      setTimeout(() => {
        router.replace("/");
      }, 1500);
    }, 1500);
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
        {/* Custom Header Back Button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={Theme.colors.onSurface}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustContentInsets={true}
        >
          <View style={styles.container}>
            {/* Header section */}
            <View style={styles.header}>
              <View style={[styles.logoIconBox, Theme.shadows.soft]}>
                <Ionicons
                  name="lock-open-outline"
                  size={36}
                  color={Theme.colors.onPrimary}
                />
              </View>
              <Text style={[styles.title, Theme.typography.headlineLg]}>
                Set Password
              </Text>
              <Text style={[styles.subtitle, Theme.typography.bodyMd]}>
                Choose a strong password to secure your verification and
                check-in credentials.
              </Text>
            </View>

            {/* Form Card */}
            <View style={[styles.card, Theme.shadows.soft]}>
              {/* Password Field */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, Theme.typography.labelMd]}>
                  New Password
                </Text>
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
                    onChangeText={(val) => {
                      setPassword(val);
                      setErrorMsg("");
                    }}
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

              {/* Confirm Password Field */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, Theme.typography.labelMd]}>
                  Confirm Password
                </Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={Theme.colors.outline}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, Theme.typography.bodyLg]}
                    placeholder="••••••••"
                    placeholderTextColor={Theme.colors.outlineVariant}
                    value={confirmPassword}
                    onChangeText={(val) => {
                      setConfirmPassword(val);
                      setErrorMsg("");
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color={Theme.colors.outline}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Dynamic Error Message */}
              {errorMsg !== "" && (
                <Text style={styles.errorText}>{errorMsg}</Text>
              )}

              {/* Validation Requirements Checklist */}
              <View style={styles.requirementsContainer}>
                <Text
                  style={[styles.requirementsHeader, Theme.typography.labelMd]}
                >
                  Password must contain:
                </Text>

                <View style={styles.reqRow}>
                  <Ionicons
                    name={hasMinLength ? "checkmark-circle" : "ellipse-outline"}
                    size={18}
                    color={
                      hasMinLength
                        ? Theme.colors.secondary
                        : Theme.colors.outlineVariant
                    }
                  />
                  <Text
                    style={[
                      styles.reqText,
                      Theme.typography.caption,
                      hasMinLength && styles.reqChecked,
                    ]}
                  >
                    At least 8 characters
                  </Text>
                </View>

                <View style={styles.reqRow}>
                  <Ionicons
                    name={hasNumber ? "checkmark-circle" : "ellipse-outline"}
                    size={18}
                    color={
                      hasNumber
                        ? Theme.colors.secondary
                        : Theme.colors.outlineVariant
                    }
                  />
                  <Text
                    style={[
                      styles.reqText,
                      Theme.typography.caption,
                      hasNumber && styles.reqChecked,
                    ]}
                  >
                    At least 1 number
                  </Text>
                </View>

                <View style={styles.reqRow}>
                  <Ionicons
                    name={
                      hasSpecialChar ? "checkmark-circle" : "ellipse-outline"
                    }
                    size={18}
                    color={
                      hasSpecialChar
                        ? Theme.colors.secondary
                        : Theme.colors.outlineVariant
                    }
                  />
                  <Text
                    style={[
                      styles.reqText,
                      Theme.typography.caption,
                      hasSpecialChar && styles.reqChecked,
                    ]}
                  >
                    At least 1 special character (!@#$%^&*)
                  </Text>
                </View>

                <View style={styles.reqRow}>
                  <Ionicons
                    name={
                      passwordsMatch ? "checkmark-circle" : "ellipse-outline"
                    }
                    size={18}
                    color={
                      passwordsMatch
                        ? Theme.colors.secondary
                        : Theme.colors.outlineVariant
                    }
                  />
                  <Text
                    style={[
                      styles.reqText,
                      Theme.typography.caption,
                      passwordsMatch && styles.reqChecked,
                    ]}
                  >
                    Passwords must match
                  </Text>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !isFormValid && styles.submitButtonDisabled,
                  success && styles.submitButtonSuccess,
                ]}
                activeOpacity={0.8}
                disabled={loading || success || !isFormValid}
                onPress={handleSubmit}
              >
                {loading ? (
                  <View style={styles.btnRow}>
                    <ActivityIndicator
                      size="small"
                      color={Theme.colors.onPrimary}
                      style={styles.spinner}
                    />
                    <Text
                      style={[styles.submitText, Theme.typography.headlineMd]}
                    >
                      SAVING...
                    </Text>
                  </View>
                ) : success ? (
                  <View style={styles.btnRow}>
                    <Ionicons
                      name="checkmark"
                      size={24}
                      color={Theme.colors.onPrimary}
                    />
                    <Text
                      style={[styles.submitText, Theme.typography.headlineMd]}
                    >
                      SUCCESS!
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={[styles.submitText, Theme.typography.headlineMd]}
                  >
                    SAVE PASSWORD
                  </Text>
                )}
              </TouchableOpacity>
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
    zIndex: 0,
    overflow: "hidden",
  },
  decorCircleLeft: {
    position: "absolute",
    top: -128,
    left: -128,
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: Theme.colors.primaryContainer + "10",
  },
  decorCircleRight: {
    position: "absolute",
    bottom: -128,
    right: -128,
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: Theme.colors.secondaryContainer + "10",
  },
  keyboardView: {
    flex: 1,
    zIndex: 1,
  },
  topBar: {
    flexDirection: "row",
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    alignItems: "center",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.surfaceContainerLow,
    justifyContent: "center",
    alignItems: "center",
    ...Theme.shadows.soft,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
  },
  logoIconBox: {
    width: 72,
    height: 72,
    borderRadius: Theme.rounded.md,
    backgroundColor: Theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  title: {
    color: Theme.colors.onSurface,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    color: Theme.colors.onSurfaceVariant,
    textAlign: "center",
    paddingHorizontal: Theme.spacing.base,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: Theme.spacing.md,
  },
  inputLabel: {
    color: Theme.colors.onSurfaceVariant,
    fontWeight: "700",
    marginBottom: Theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceContainerLow,
    borderColor: Theme.colors.outlineVariant + "50",
    borderWidth: 1,
    borderRadius: Theme.rounded.default,
    height: 56,
    paddingHorizontal: Theme.spacing.md,
    position: "relative",
  },
  inputIcon: {
    marginRight: Theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    color: Theme.colors.onSurface,
    height: "100%",
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: Theme.spacing.xs,
  },
  requirementsContainer: {
    marginBottom: Theme.spacing.lg,
    backgroundColor: Theme.colors.surfaceContainerLow + "50",
    padding: Theme.spacing.md,
    borderRadius: Theme.rounded.default,
  },
  requirementsHeader: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
    marginBottom: Theme.spacing.sm,
  },
  reqRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    marginBottom: 6,
  },
  reqText: {
    color: Theme.colors.outline,
  },
  reqChecked: {
    color: Theme.colors.secondary,
    fontWeight: "600",
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: Theme.spacing.md,
    textAlign: "center",
  },
  submitButton: {
    height: 56,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.rounded.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Theme.spacing.sm,
  },
  submitButtonDisabled: {
    backgroundColor: Theme.colors.outlineVariant,
    opacity: 0.5,
  },
  submitButtonSuccess: {
    backgroundColor: Theme.colors.secondary,
  },
  submitText: {
    color: Theme.colors.onPrimary,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.xs,
  },
  spinner: {
    marginRight: Theme.spacing.xs,
  },
});
