import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useLecturerSignin, useStudentSignin } from "@/hooks/mutation/use-auth";
import {
  lecturerSigninSchema,
  LecturerSigninSchema,
  studentSigninSchema,
  StudentSigninSchema,
} from "@/schemas";
import { MenuView } from "@expo/ui/community/menu";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../../constants/theme";

export default function SigninScreen({
  role: initialRole,
}: {
  role?: "admin" | "student";
}) {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<"admin" | "student">(
    initialRole || "student",
  );
  const isAdmin = currentRole === "admin";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />

      {/* Top-Right Native Context Menu Toggle */}
      <View style={styles.floatingHeaderButton}>
        <MenuView
          title="Sign In Options"
          onPressAction={({ nativeEvent }) => {
            if (nativeEvent.event === "toggle-role") {
              setCurrentRole(isAdmin ? "student" : "admin");
            }
          }}
          actions={[
            {
              id: "toggle-role",
              title: isAdmin ? "Student Login" : "Lecturer Login",
              // image: isAdmin ? "graduationcap" : "key",
            },
          ]}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color={Theme.colors.outline}
            style={{ padding: 8 }}
          />
        </MenuView>
      </View>

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
                {isAdmin ? "Lecturer Control Panel" : "Welcome Back"}
              </Text>
              <Text style={[styles.subtitle, Theme.typography.bodyMd]}>
                {isAdmin
                  ? "Configure attendance sessions, track real-time roll call, and verify student presence."
                  : "Secure biometric and geofence-verified attendance for modern campuses."}
              </Text>
            </View>

            {/* Login Card */}
            <View style={[styles.card, Theme.shadows.soft]}>
              {isAdmin ? <LecturerLoginForm /> : <StudentLoginForm />}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
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

              <TouchableOpacity
                onPress={() => router.push("/(auth)/admin")}
                style={styles.versionContainer}
              >
                <MaterialCommunityIcons
                  name="information-outline"
                  size={16}
                  color={Theme.colors.outline}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function StudentLoginForm() {
  const { mutate, isPending } = useStudentSignin();
  const { control, handleSubmit } = useForm<StudentSigninSchema>({
    resolver: zodResolver(studentSigninSchema),
    defaultValues: {
      matricNumber: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: StudentSigninSchema) => {
    mutate(data, {
      onSuccess: () => {},
      onError: (error) => {
        Alert.alert(
          "Login Failed",
          error.message || "An error occurred during login.",
        );
      },
    });
  };

  return (
    <>
      {/* ID Field */}
      <Input
        name="matricNumber"
        control={control}
        icon="school-outline"
        label="Matriculation ID"
        placeholder="Enter your Matriculation ID"
      />

      {/* Password Field */}
      <Input
        name="password"
        control={control}
        icon="lock-outline"
        label="Password"
        placeholder="••••••••"
        secureTextEntry
      />

      {/* Submit Button */}
      <Button
        label="Sign in"
        loading={isPending}
        onPress={handleSubmit(onSubmit)}
      />
    </>
  );
}

function LecturerLoginForm() {
  const { mutate, isPending } = useLecturerSignin();
  const { control, handleSubmit } = useForm<LecturerSigninSchema>({
    resolver: zodResolver(lecturerSigninSchema),
    defaultValues: {
      staffNumber: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data: LecturerSigninSchema) => {
    mutate(data as any, {
      onSuccess: () => {},
      onError: (error) => {
        Alert.alert(
          "Login Failed",
          error.message || "An error occurred during login.",
        );
      },
    });
  };

  return (
    <>
      {/* Staff Number Field */}
      <Input
        name="staffNumber"
        control={control}
        icon="account"
        label="Lecturer Staff Number"
        placeholder="Enter your staff number"
      />

      {/* Password Field */}
      <Input
        name="password"
        control={control}
        icon="lock-outline"
        label="Password"
        placeholder="••••••••"
        secureTextEntry
      />

      {/* Submit Button */}
      <Button
        label="Sign in"
        loading={isPending}
        onPress={handleSubmit(onSubmit)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  floatingHeaderButton: {
    position: "absolute",
    top: 16,
    right: 20,
    zIndex: 10,
    padding: 8,
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
