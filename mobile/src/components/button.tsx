import { Theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const Button = ({
  loading,
  onPress,
  label,
}: {
  loading?: boolean;
  onPress: () => void;
  label: string;
}) => {
  return (
    <TouchableOpacity
      style={[styles.submitButton]}
      activeOpacity={0.8}
      disabled={loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={Theme.colors.onPrimary} size="small" />
      ) : (
        <View style={styles.submitBtnContent}>
          <Text style={[styles.submitText, Theme.typography.headlineMd]}>
            {label}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={Theme.colors.onPrimary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

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
    flex: 1,
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
