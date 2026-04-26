import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "../../theme";

const InputCustom = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.wrapper}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput style={[styles.input, style]} placeholderTextColor="#7a9096" {...props} />
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
  error: {
    color: theme.colors.danger,
    marginTop: 4,
    fontSize: 12,
  },
});

export default InputCustom;
