import { Theme } from "@/constants/theme";
import { useSessionStore } from "@/store/session-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateSession() {
  const router = useRouter();
  const createSession = useSessionStore((state) => state.createSession);

  const [courseCode, setCourseCode] = useState("CSC 401");
  const [courseTitle, setCourseTitle] = useState("Mobile App Development");
  const [venue, setVenue] = useState("Computer Science Lab");
  const [radius, setRadius] = useState<number>(20);
  const [duration, setDuration] = useState<number>(15);
  const [courseRepEnabled, setCourseRepEnabled] = useState(false);

  // Focus states to implement dynamic high-end borders
  const [focusedField, setFocusedField] = useState<
    "code" | "title" | "venue" | null
  >(null);

  // Form validation indicator
  const isFormValid =
    courseCode.trim() !== "" &&
    courseTitle.trim() !== "" &&
    venue.trim() !== "";

  const handleStartSession = () => {
    if (!isFormValid) return;

    const session = createSession({
      courseCode,
      courseTitle,
      venue,
      radius,
      duration,
      courseRepEnabled,
    });

    // Navigate to active session details page immediately
    router.replace({
      pathname: "/(lecturer)/session/[id]",
      params: { id: session.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
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
        <Text style={[styles.headerTitle, Theme.typography.headlineMd]}>
          New Session
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Form Card */}
          <View style={[styles.formCard, Theme.shadows.soft]}>
            <View style={styles.cardDecorativeCircle} />

            {/* Course Code Field */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, Theme.typography.labelMd]}>
                COURSE CODE
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === "code" && styles.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="school-outline"
                  size={20}
                  color={
                    focusedField === "code"
                      ? Theme.colors.primary
                      : Theme.colors.outline
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, Theme.typography.bodyLg]}
                  placeholder="e.g. CSC 401"
                  placeholderTextColor={Theme.colors.outlineVariant}
                  value={courseCode}
                  onChangeText={setCourseCode}
                  autoCapitalize="characters"
                  onFocus={() => setFocusedField("code")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Course Title Field */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, Theme.typography.labelMd]}>
                COURSE TITLE
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === "title" && styles.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={
                    focusedField === "title"
                      ? Theme.colors.primary
                      : Theme.colors.outline
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, Theme.typography.bodyLg]}
                  placeholder="e.g. Mobile App Development"
                  placeholderTextColor={Theme.colors.outlineVariant}
                  value={courseTitle}
                  onChangeText={setCourseTitle}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Venue Field */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, Theme.typography.labelMd]}>
                VENUE / ROOM
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === "venue" && styles.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={
                    focusedField === "venue"
                      ? Theme.colors.primary
                      : Theme.colors.outline
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, Theme.typography.bodyLg]}
                  placeholder="e.g. Computer Science Lab"
                  placeholderTextColor={Theme.colors.outlineVariant}
                  value={venue}
                  onChangeText={setVenue}
                  onFocus={() => setFocusedField("venue")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Geofence Radius Selector */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, Theme.typography.labelMd]}>
                GEOFENCE RADIUS
              </Text>
              <View style={styles.segmentedControl}>
                {([20, 50, 100] as const).map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.segmentBtn,
                      radius === r && styles.segmentBtnActive,
                    ]}
                    onPress={() => setRadius(r)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        radius === r && styles.segmentTextActive,
                      ]}
                    >
                      {r}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Session Duration Selector */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, Theme.typography.labelMd]}>
                SESSION DURATION
              </Text>
              <View style={styles.segmentedControl}>
                {([10, 15, 30, 45] as const).map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.segmentBtn,
                      duration === d && styles.segmentBtnActive,
                    ]}
                    onPress={() => setDuration(d)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        duration === d && styles.segmentTextActive,
                      ]}
                    >
                      {d}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Course Rep Permission Toggle Switch */}
            <View style={styles.repToggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.repToggleLabel, Theme.typography.labelMd]}>
                  DELEGATE TO COURSE REP
                </Text>
                <Text
                  style={[styles.repToggleSublabel, Theme.typography.caption]}
                >
                  Allow the designated course representative to manually check
                  in students.
                </Text>
              </View>
              <Switch
                value={courseRepEnabled}
                onValueChange={setCourseRepEnabled}
                trackColor={{
                  false: Theme.colors.outlineVariant,
                  true: Theme.colors.primary,
                }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          {/* Action Button with validation state */}
          <TouchableOpacity
            style={[styles.startBtn, !isFormValid && styles.startBtnDisabled]}
            onPress={handleStartSession}
            disabled={!isFormValid}
            activeOpacity={0.8}
          >
            <Ionicons
              name="wifi-outline"
              size={24}
              color={Theme.colors.onPrimary}
            />
            <Text style={styles.startBtnText}>Start Attendance Session</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.outlineVariant + "30",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingTop: Theme.spacing.lg,
    paddingBottom: 60,
    gap: Theme.spacing.lg,
  },
  formCard: {
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
    position: "relative",
    overflow: "hidden",
  },
  cardDecorativeCircle: {
    position: "absolute",
    top: -48,
    right: -48,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Theme.colors.primary + "05",
  },
  inputContainer: {
    gap: Theme.spacing.xs,
  },
  inputLabel: {
    color: Theme.colors.outline,
    fontWeight: "700",
    zIndex: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceContainerLow,
    borderColor: Theme.colors.outlineVariant,
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    paddingHorizontal: Theme.spacing.md,
    height: 56,
    zIndex: 2,
  },
  inputWrapperFocused: {
    borderColor: Theme.colors.primary,
    borderWidth: 1.5,
    backgroundColor: Theme.colors.surfaceContainerLowest,
  },
  inputIcon: {
    marginRight: Theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    height: "100%",
    color: Theme.colors.onSurface,
    fontWeight: "600",
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: Theme.colors.surfaceContainerLow,
    borderRadius: Theme.rounded.md,
    padding: 2,
    borderWidth: 1,
    borderColor: Theme.colors.outlineVariant,
    zIndex: 2,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: Theme.spacing.sm,
    alignItems: "center",
    borderRadius: Theme.rounded.sm,
  },
  segmentBtnActive: {
    backgroundColor: Theme.colors.secondaryContainer,
  },
  segmentText: {
    color: Theme.colors.onSurfaceVariant,
    fontWeight: "600",
  },
  segmentTextActive: {
    color: Theme.colors.onSecondaryContainer,
  },
  repToggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.outlineVariant + "30",
    marginTop: Theme.spacing.sm,
    zIndex: 2,
  },
  repToggleLabel: {
    color: Theme.colors.outline,
    fontWeight: "700",
  },
  repToggleSublabel: {
    color: Theme.colors.outline,
    marginTop: 2,
    paddingRight: Theme.spacing.md,
  },
  startBtn: {
    flexDirection: "row",
    height: 56,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.rounded.md,
    justifyContent: "center",
    alignItems: "center",
    gap: Theme.spacing.xs,
    ...Theme.shadows.soft,
  },
  startBtnDisabled: {
    backgroundColor: Theme.colors.outlineVariant,
    opacity: 0.5,
  },
  startBtnText: {
    color: Theme.colors.onPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
});
