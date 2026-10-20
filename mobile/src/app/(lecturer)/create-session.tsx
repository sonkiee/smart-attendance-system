import { Theme } from "@/constants/theme";
import { useStartSession } from "@/hooks/mutation/use-session";
import { useCourses, useVenues } from "@/hooks/queries/user";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateSession() {
  const router = useRouter();
  const { mutate: startSessionMutate, isPending } = useStartSession();
  const { data: courses = [], isLoading: isLoadingCourses } = useCourses();
  const { data: venues = [], isLoading: isLoadingVenues } = useVenues();

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedVenue, setSelectedVenue] = useState<any>(null);

  const [radius, setRadius] = useState<number>(20);
  const [duration, setDuration] = useState<number>(15);
  const [courseRepEnabled, setCourseRepEnabled] = useState(false);

  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [venueModalVisible, setVenueModalVisible] = useState(false);

  // Auto-select first available course when data loads
  useEffect(() => {
    if (!selectedCourse && courses && courses.length > 0) {
      setSelectedCourse(courses[0]);
    }
  }, [courses]);

  // Auto-select first available venue when data loads
  useEffect(() => {
    if (!selectedVenue && venues && venues.length > 0) {
      setSelectedVenue(venues[0]);
      if (venues[0].radiusMeters) {
        setRadius(venues[0].radiusMeters);
      }
    }
  }, [venues]);

  const isFormValid = !!selectedCourse?.id && duration > 0;

  const handleStartSession = () => {
    if (!selectedCourse?.id) {
      Alert.alert(
        "Selection Required",
        "Please select a valid course to start an attendance session.",
      );
      return;
    }

    startSessionMutate(
      {
        courseId: selectedCourse.id,
        venueId: selectedVenue?.id || null,
        durationMinutes: duration,
        lateThresholdMinutes: 15,
        allowRepMarking: courseRepEnabled,
      },
      {
        onSuccess: (sessionData: any) => {
          Alert.alert("Success", "Attendance session created successfully!");
          router.replace({
            pathname: "/(lecturer)/session/[id]",
            params: { id: sessionData.id },
          });
        },
        onError: (err: any) => {
          Alert.alert("Error", err.message || "Failed to start session.");
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

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

            {/* Course Selector */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, Theme.typography.labelMd]}>
                COURSE
              </Text>
              <TouchableOpacity
                style={[styles.inputWrapper, styles.selectorWrapper]}
                onPress={() => setCourseModalVisible(true)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="school-outline"
                  size={20}
                  color={Theme.colors.primary}
                  style={styles.inputIcon}
                />
                <View style={{ flex: 1, justifyContent: "center" }}>
                  {isLoadingCourses ? (
                    <Text
                      style={[
                        styles.selectorPlaceholder,
                        Theme.typography.bodyLg,
                      ]}
                    >
                      Loading courses...
                    </Text>
                  ) : selectedCourse ? (
                    <>
                      <Text
                        style={[
                          styles.selectorMainText,
                          Theme.typography.bodyLg,
                        ]}
                        numberOfLines={1}
                      >
                        {selectedCourse.courseCode} - {selectedCourse.courseTitle}
                      </Text>
                      {selectedCourse.department ? (
                        <Text
                          style={[
                            styles.selectorSubText,
                            Theme.typography.caption,
                          ]}
                          numberOfLines={1}
                        >
                          {selectedCourse.department} • Level{" "}
                          {selectedCourse.level}
                        </Text>
                      ) : null}
                    </>
                  ) : (
                    <Text
                      style={[
                        styles.selectorPlaceholder,
                        Theme.typography.bodyLg,
                      ]}
                    >
                      Select a Course
                    </Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={Theme.colors.outline}
                />
              </TouchableOpacity>
            </View>

            {/* Venue Selector */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, Theme.typography.labelMd]}>
                VENUE / ROOM
              </Text>
              <TouchableOpacity
                style={[styles.inputWrapper, styles.selectorWrapper]}
                onPress={() => setVenueModalVisible(true)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={Theme.colors.primary}
                  style={styles.inputIcon}
                />
                <View style={{ flex: 1, justifyContent: "center" }}>
                  {isLoadingVenues ? (
                    <Text
                      style={[
                        styles.selectorPlaceholder,
                        Theme.typography.bodyLg,
                      ]}
                    >
                      Loading venues...
                    </Text>
                  ) : selectedVenue ? (
                    <>
                      <Text
                        style={[
                          styles.selectorMainText,
                          Theme.typography.bodyLg,
                        ]}
                        numberOfLines={1}
                      >
                        {selectedVenue.name}
                      </Text>
                      <Text
                        style={[
                          styles.selectorSubText,
                          Theme.typography.caption,
                        ]}
                        numberOfLines={1}
                      >
                        Default radius: {selectedVenue.radiusMeters ?? radius}m
                      </Text>
                    </>
                  ) : (
                    <Text
                      style={[
                        styles.selectorPlaceholder,
                        Theme.typography.bodyLg,
                      ]}
                    >
                      Select a Venue (Optional)
                    </Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={Theme.colors.outline}
                />
              </TouchableOpacity>
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

          {/* Action Button with validation and loading state */}
          <TouchableOpacity
            style={[
              styles.startBtn,
              (!isFormValid || isPending) && styles.startBtnDisabled,
            ]}
            onPress={handleStartSession}
            disabled={!isFormValid || isPending}
            activeOpacity={0.8}
          >
            {isPending ? (
              <ActivityIndicator color={Theme.colors.onPrimary} />
            ) : (
              <>
                <Ionicons
                  name="wifi-outline"
                  size={24}
                  color={Theme.colors.onPrimary}
                />
                <Text style={styles.startBtnText}>Start Attendance Session</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Course Selection Modal */}
      <Modal
        visible={courseModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCourseModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, Theme.typography.headlineMd]}>
                Select Course
              </Text>
              <TouchableOpacity
                onPress={() => setCourseModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={Theme.colors.onSurface}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={courses}
              keyExtractor={(item: any) => item.id}
              contentContainerStyle={styles.modalListContent}
              renderItem={({ item }: { item: any }) => {
                const isSelected = selectedCourse?.id === item.id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      isSelected && styles.modalItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedCourse(item);
                      setCourseModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.modalItemCode,
                          isSelected && { color: Theme.colors.primary },
                        ]}
                      >
                        {item.courseCode}
                      </Text>
                      <Text style={styles.modalItemTitle}>
                        {item.courseTitle}
                      </Text>
                      {item.department ? (
                        <Text style={styles.modalItemSub}>
                          {item.department} • Level {item.level}
                        </Text>
                      ) : null}
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={Theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.modalEmpty}>
                  <Text style={styles.modalEmptyText}>
                    {isLoadingCourses
                      ? "Loading courses..."
                      : "No courses found."}
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Venue Selection Modal */}
      <Modal
        visible={venueModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVenueModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, Theme.typography.headlineMd]}>
                Select Venue
              </Text>
              <TouchableOpacity
                onPress={() => setVenueModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={Theme.colors.onSurface}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={venues}
              keyExtractor={(item: any) => item.id}
              contentContainerStyle={styles.modalListContent}
              renderItem={({ item }: { item: any }) => {
                const isSelected = selectedVenue?.id === item.id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      isSelected && styles.modalItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedVenue(item);
                      if (item.radiusMeters) {
                        setRadius(item.radiusMeters);
                      }
                      setVenueModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.modalItemCode,
                          isSelected && { color: Theme.colors.primary },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text style={styles.modalItemSub}>
                        Radius: {item.radiusMeters ?? 50}m
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={Theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.modalEmpty}>
                  <Text style={styles.modalEmptyText}>
                    {isLoadingVenues ? "Loading venues..." : "No venues found."}
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
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
  selectorWrapper: {
    height: "auto",
    minHeight: 56,
    paddingVertical: Theme.spacing.sm,
  },
  selectorMainText: {
    color: Theme.colors.onSurface,
    fontWeight: "600",
  },
  selectorSubText: {
    color: Theme.colors.outline,
    marginTop: 2,
  },
  selectorPlaceholder: {
    color: Theme.colors.outlineVariant,
  },
  inputIcon: {
    marginRight: Theme.spacing.sm,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Theme.colors.background,
    borderTopLeftRadius: Theme.rounded.lg,
    borderTopRightRadius: Theme.rounded.lg,
    maxHeight: "75%",
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.outlineVariant + "30",
  },
  modalTitle: {
    color: Theme.colors.onSurface,
    fontWeight: "700",
  },
  modalCloseBtn: {
    padding: Theme.spacing.xs,
  },
  modalListContent: {
    paddingHorizontal: Theme.spacing.marginMobile,
    paddingVertical: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant + "40",
    borderWidth: 1,
    borderRadius: Theme.rounded.md,
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  modalItemSelected: {
    borderColor: Theme.colors.primary,
    borderWidth: 1.5,
    backgroundColor: Theme.colors.primaryContainer + "10",
  },
  modalItemCode: {
    fontSize: 16,
    fontWeight: "700",
    color: Theme.colors.onSurface,
  },
  modalItemTitle: {
    fontSize: 14,
    color: Theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  modalItemSub: {
    fontSize: 12,
    color: Theme.colors.outline,
    marginTop: 2,
  },
  modalEmpty: {
    paddingVertical: Theme.spacing.xl,
    alignItems: "center",
  },
  modalEmptyText: {
    color: Theme.colors.outline,
    fontSize: 14,
  },
});
