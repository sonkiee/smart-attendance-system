import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/constants/theme";

interface PinVerifyProps {
  correctPin: string;
  onSuccess: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export function PinVerify({
  correctPin,
  onSuccess,
  onCancel,
  title = "Enter Security PIN",
  subtitle = "Please verify your identity to proceed.",
}: PinVerifyProps) {
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleKeyPress = (num: string) => {
    if (pin.length >= 4) return;
    setErrorMsg(null);
    const updated = pin + num;
    setPin(updated);

    if (updated.length === 4) {
      // Process full 4-digit code after a small delay for visual feedback
      setTimeout(() => {
        if (updated === correctPin) {
          setPin("");
          onSuccess();
        } else {
          setPin("");
          setErrorMsg("Incorrect PIN. Please try again.");
        }
      }, 200);
    }
  };

  const handleBackspace = () => {
    if (pin.length === 0) return;
    setErrorMsg(null);
    setPin(pin.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, Theme.typography.headlineMd]}>{title}</Text>
      <Text style={[styles.subtitle, Theme.typography.bodyMd]}>{subtitle}</Text>

      {/* 4-dot display */}
      <View style={styles.dotsRow}>
        {[1, 2, 3, 4].map((index) => (
          <View
            key={index}
            style={[
              styles.dot,
              pin.length >= index && styles.dotFilled,
              errorMsg ? styles.dotError : null,
            ]}
          />
        ))}
      </View>

      {/* Error message */}
      <View style={styles.errorContainer}>
        {errorMsg && (
          <Text style={[styles.errorText, Theme.typography.bodyMd]}>
            {errorMsg}
          </Text>
        )}
      </View>

      {/* Numeric Keypad */}
      <View style={styles.keypad}>
        {[
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.key}
                activeOpacity={0.6}
                onPress={() => handleKeyPress(num)}
              >
                <Text style={[styles.keyText, Theme.typography.headlineLg]}>
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={styles.keypadRow}>
          {onCancel ? (
            <TouchableOpacity
              style={styles.key}
              activeOpacity={0.6}
              onPress={onCancel}
            >
              <Ionicons
                name="finger-print-outline"
                size={26}
                color={Theme.colors.primary}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.keyPlaceholder} />
          )}

          <TouchableOpacity
            style={styles.key}
            activeOpacity={0.6}
            onPress={() => handleKeyPress("0")}
          >
            <Text style={[styles.keyText, Theme.typography.headlineLg]}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.key}
            activeOpacity={0.6}
            onPress={handleBackspace}
          >
            <Ionicons
              name="backspace-outline"
              size={26}
              color={Theme.colors.onBackground}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontWeight: "700",
    color: Theme.colors.onBackground,
    marginBottom: 8,
  },
  subtitle: {
    color: Theme.colors.outline,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 8,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Theme.colors.outlineVariant,
    backgroundColor: "transparent",
  },
  dotFilled: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  dotError: {
    backgroundColor: Theme.colors.error,
    borderColor: Theme.colors.error,
  },
  errorContainer: {
    height: 24,
    justifyContent: "center",
    marginBottom: 24,
  },
  errorText: {
    color: Theme.colors.error,
    fontWeight: "600",
  },
  keypad: {
    width: "100%",
    paddingHorizontal: 8,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  key: {
    flex: 1,
    aspectRatio: 1.5,
    marginHorizontal: 6,
    borderRadius: Theme.rounded.md,
    backgroundColor: Theme.colors.surfaceContainerLowest,
    borderColor: Theme.colors.outlineVariant + "30",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    ...Theme.shadows.soft,
  },
  keyPlaceholder: {
    flex: 1,
    marginHorizontal: 6,
  },
  keyText: {
    color: Theme.colors.onSurface,
    fontWeight: "600",
  },
});
