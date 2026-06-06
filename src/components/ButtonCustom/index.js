import React, { useRef } from "react";
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text } from "react-native";
import { theme } from "../../theme";

const ButtonCustom = ({ title, onPress, variant = "primary", disabled, loading }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const isDisabled = disabled || loading;

  const animateScale = (toValue) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  const styleByVariant =
    variant === "secondary"
      ? styles.secondary
      : variant === "danger"
        ? styles.danger
        : styles.primary;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={() => !isDisabled && animateScale(0.97)}
        onPressOut={() => !isDisabled && animateScale(1)}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.button,
          styleByVariant,
          pressed && !isDisabled && styles.pressed,
          isDisabled && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.text, variant === "secondary" && styles.textSecondary]}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
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
  pressed: {
    opacity: 0.9,
  },
});

export default ButtonCustom;
