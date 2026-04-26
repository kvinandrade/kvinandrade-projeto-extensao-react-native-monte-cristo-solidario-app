import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { theme } from "../../theme";

const ButtonCustom = ({ title, onPress, variant = "primary", disabled, loading }) => {
  const styleByVariant =
    variant === "secondary"
      ? styles.secondary
      : variant === "danger"
        ? styles.danger
        : styles.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, styleByVariant, (disabled || loading) && styles.disabled]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, variant === "secondary" && styles.textSecondary]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: "#edf5f7",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  danger: {
    backgroundColor: theme.colors.danger,
  },
  text: {
    ...theme.typography.button,
    color: "#ffffff",
  },
  textSecondary: {
    color: theme.colors.text,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default ButtonCustom;
