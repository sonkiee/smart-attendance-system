import { Theme } from "@/constants/theme";
import { useAuthStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FlowStep = "VERIFY_CURRENT" | "ENTER_NEW" | "CONFIRM_NEW";

export default function ChangePinScreen() {
  const router = useRouter();
  const { securityPin, setSecurityPin } = useAuthStore();

  // PIN Storage Key
  const SECURE_PIN_KEY = "user_security_pin";

  // Flow State
  const [step, setStep] = useState<FlowStep>("ENTER_NEW");
  const [inputVal, setInputVal] = useState<string>("");
  const [newPin, setNewPin] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Animations
  const [shakeAnim] = useState(() => new Animated.Value(0));
  const [fadeAnim] = useState(() => new Animated.Value(1));

  // Check if a PIN is already set
  useEffect(() => {
    if (securityPin) {
      setStep("VERIFY_CURRENT");
    } else {
      setStep("ENTER_NEW");
    }
  }, [securityPin]);

  // Shake animation helper
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Fade title text in/out helper
  const transitionStep = (nextStep: FlowStep) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setStep(nextStep);
      setInputVal("");
      setErrorMsg(null);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleKeyPress = (num: string) => {
    if (inputVal.length >= 4) return;
    setErrorMsg(null);
    const updated = inputVal + num;
    setInputVal(updated);

    if (updated.length === 4) {
      // Process full 4-digit code after a small delay for visual feedback
      setTimeout(() => {
        handlePinSubmission(updated);
      }, 250);
    }
  };

  const handleBackspace = () => {
    if (inputVal.length === 0) return;
    setErrorMsg(null);
    setInputVal(inputVal.slice(0, -1));
  };

  const handlePinSubmission = async (pinValue: string) => {
    // Inside handlePinSubmission:
    if (step === "VERIFY_CURRENT") {
      if (pinValue === securityPin) {
        // Use the store value
        transitionStep("ENTER_NEW");
      } else {
        setErrorMsg("Incorrect current PIN");
        setInputVal("");
        triggerShake();
      }
    } else if (step === "ENTER_NEW") {
      setNewPin(pinValue);
      transitionStep("CONFIRM_NEW");
    } else if (step === "CONFIRM_NEW") {
      if (pinValue === newPin) {
        try {
          // Save it using the store action (it persists automatically)
          setSecurityPin(pinValue);
          setErrorMsg(null);
          router.back();
        } catch (err) {
          console.error("Failed to save PIN:", err);
          setErrorMsg("Could not save PIN. Please try again.");
          triggerShake();
        }
      } else {
        setErrorMsg("PINs do not match. Try again.");
        setInputVal("");
        triggerShake();
      }
    }
  };

  // Step-specific text
  const getStepHeader = () => {
    switch (step) {
      case "VERIFY_CURRENT":
        return {
          title: "Enter Current PIN",
          subtitle: "Please verify your identity to proceed.",
        };
      case "ENTER_NEW":
        return {
          title: "Set Security PIN",
          subtitle: "Create a new 4-digit passcode.",
        };
      case "CONFIRM_NEW":
        return {
          title: "Confirm Security PIN",
          subtitle: "Re-enter your new 4-digit passcode.",
        };
    }
  };

  const headerText = getStepHeader();

  // Render 4-dot passcode display
  const renderDots = () => {
    const dots = [];
    for (let i = 1; i <= 4; i++) {
      const isFilled = inputVal.length >= i;
      dots.push(
        <View
          key={i}
          style={[
            styles.dot,
            isFilled && styles.dotFilled,
            errorMsg ? styles.dotError : null,
          ]}
        />,
      );
    }
    return dots;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Screen Content */}
      <View style={styles.content}>
        <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
          <Text style={[styles.title, Theme.typography.headlineMd]}>
            {headerText.title}
          </Text>
          <Text style={[styles.subtitle, Theme.typography.bodyLg]}>
            {headerText.subtitle}
          </Text>
        </Animated.View>

        {/* Display Dots */}
        <Animated.View
          style={[
            styles.dotsContainer,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          {renderDots()}
        </Animated.View>

        {/* Error message */}
        <View style={styles.errorContainer}>
          {errorMsg && (
            <Text style={[styles.errorText, Theme.typography.bodyMd]}>
              {errorMsg}
            </Text>
          )}
        </View>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        <View style={styles.keypadRow}>
          <NumberButton val="1" onPress={handleKeyPress} />
          <NumberButton val="2" onPress={handleKeyPress} />
          <NumberButton val="3" onPress={handleKeyPress} />
        </View>
        <View style={styles.keypadRow}>
          <NumberButton val="4" onPress={handleKeyPress} />
          <NumberButton val="5" onPress={handleKeyPress} />
          <NumberButton val="6" onPress={handleKeyPress} />
        </View>
        <View style={styles.keypadRow}>
          <NumberButton val="7" onPress={handleKeyPress} />
          <NumberButton val="8" onPress={handleKeyPress} />
          <NumberButton val="9" onPress={handleKeyPress} />
        </View>
        <View style={styles.keypadRow}>
          {/* Empty Space for alignment */}
          <View style={styles.keypadBtnPlaceholder} />

          <NumberButton val="0" onPress={handleKeyPress} />

          {/* Backspace Button */}
          <TouchableOpacity
            style={styles.keypadBtn}
            activeOpacity={0.6}
            onPress={handleBackspace}
          >
            <Ionicons
              name="backspace-outline"
              size={26}
              color={Theme.colors.onSurface}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

interface NumberButtonProps {
  val: string;
  onPress: (val: string) => void;
}

const NumberButton = ({ val, onPress }: NumberButtonProps) => (
  <TouchableOpacity
    style={styles.keypadBtn}
    activeOpacity={0.6}
    onPress={() => onPress(val)}
  >
    <Text style={[styles.keypadBtnText, Theme.typography.headlineLg]}>
      {val}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    color: Theme.colors.onBackground,
    marginBottom: 8,
    fontWeight: "700",
  },
  subtitle: {
    color: Theme.colors.outline,
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 24,
    marginVertical: 40,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Theme.colors.outlineVariant,
    backgroundColor: "transparent",
  },
  dotFilled: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  dotError: {
    borderColor: Theme.colors.error,
    backgroundColor: Theme.colors.error,
  },
  errorContainer: {
    height: 24,
    justifyContent: "center",
  },
  errorText: {
    color: Theme.colors.error,
    fontWeight: "600",
  },
  keypad: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  keypadBtn: {
    flex: 1,
    aspectRatio: 1.5,
    marginHorizontal: 8,
    borderRadius: Theme.rounded.md,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant + "40",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    ...Theme.shadows.soft,
  },
  keypadBtnPlaceholder: {
    flex: 1,
    marginHorizontal: 8,
  },
  keypadBtnText: {
    color: Theme.colors.onSurface,
    fontWeight: "600",
  },
});
