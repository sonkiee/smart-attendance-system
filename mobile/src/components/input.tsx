import { Theme } from "@/constants/theme";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export type BaseInputProps = TextInputProps & {
  label?: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  containerStyle?: StyleProp<ViewStyle>;
  error?: string;
};

export type InputProps<TFieldValues extends FieldValues = FieldValues> =
  BaseInputProps & {
    control?: Control<TFieldValues>;
    name?: Path<TFieldValues>;
  };

export const BaseInput = (props: BaseInputProps) => {
  const {
    label,
    icon,
    containerStyle,
    error,
    secureTextEntry,
    placeholder,
    style,
    onFocus,
    onBlur,
    ...restProps
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPasswordField = secureTextEntry || false;

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label && (
        <Text style={[styles.inputLabel, Theme.typography.labelMd]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          error
            ? { borderColor: Theme.colors.error }
            : isFocused
              ? { borderColor: Theme.colors.primary }
              : {},
        ]}
      >
        {icon && (
          <View style={styles.inputIconContainer}>
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={
                error
                  ? Theme.colors.error
                  : isFocused
                    ? Theme.colors.primary
                    : Theme.colors.outline
              }
            />
          </View>
        )}

        <TextInput
          style={[styles.textInput, Theme.typography.bodyLg, style]}
          placeholder={placeholder}
          placeholderTextColor={Theme.colors.outlineVariant}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={isPasswordField && !showPassword}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...restProps}
        />
        {isPasswordField && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={showPassword ? "visibility-off" : "visibility"}
              size={20}
              color={Theme.colors.outline}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export const Input = <TFieldValues extends FieldValues = FieldValues>(
  props: InputProps<TFieldValues>,
) => {
  const { control, name, ...baseProps } = props;

  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error: fieldError },
        }) => (
          <BaseInput
            {...baseProps}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={fieldError?.message || props.error}
          />
        )}
      />
    );
  }
  return <BaseInput {...baseProps} />;
};

const styles = StyleSheet.create({
  inputContainer: {
    gap: Theme.spacing.base,
  },
  inputLabel: {
    color: Theme.colors.outline,
    fontWeight: "600",
    paddingHorizontal: 4,
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
  inputIconContainer: {
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
  errorText: {
    color: Theme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});
