import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ButtonCustom from "../../components/ButtonCustom";
import Card from "../../components/Card";
import InputCustom from "../../components/InputCustom";
import { useAppData } from "../../hooks/useAppData";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../theme";

const logoImg = require("../../../logo-app.png");

const LoginScreen = () => {
  const { config } = useAppData();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.brandHeader}>
            <View style={styles.logoFrame}>
              <Image source={logoImg} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.appName}>{config.nomeApp}</Text>
            <Text style={styles.appTagline}>Distribuição solidária de alimentos</Text>
          </View>

          <Card style={styles.loginCard}>
            <Text style={styles.loginTitle}>Acesso</Text>
            <InputCustom
              label="E-mail"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <InputCustom
              label="Senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              error={error}
            />

            <ButtonCustom title="Entrar" loading={loading} onPress={() => login(email, senha)} />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
  brandHeader: {
    alignItems: "center",
    paddingTop: 52,
    paddingBottom: 32,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  logoFrame: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    width: 140,
    height: 140,
  },
  appName: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },
  appTagline: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 6,
  },
  loginCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  loginTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: theme.spacing.md,
  },
});

export default LoginScreen;
