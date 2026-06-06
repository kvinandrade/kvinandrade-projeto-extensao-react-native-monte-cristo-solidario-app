import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme";

const InputCustom = ({
  label,
  error,
  style,
  secureTextEntry,
  showPasswordToggle,
  ...props
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPasswordField = secureTextEntry || showPasswordToggle;

  return (
    <View style={styles.wrapper}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, isPasswordField && styles.inputWithIcon, style]}
          placeholderTextColor="#7a9096"
          secureTextEntry={isPasswordField ? !passwordVisible : false}
          {...props}
        />
        {isPasswordField && (
          <Pressable
            style={styles.eyeButton}
            onPress={() => setPasswordVisible((visible) => !visible)}
            accessibilityLabel={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
            hitSlop={8}
          >
            <Ionicons
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={theme.colors.textSoft}
            />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: theme.spacing.sm,
  },
  label: {
    color: theme.colors.text,
    marginBottom: 5,
    fontWeight: "600",
  },
  inputRow: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    minHeight: 48,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 15,
  },
  inputWithIcon: {
    paddingRight: 48,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: theme.colors.danger,
    marginTop: 4,
    fontSize: 12,
  },
});

export default InputCustom;
