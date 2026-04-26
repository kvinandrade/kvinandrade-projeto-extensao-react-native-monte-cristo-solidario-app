import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import ButtonCustom from "../../components/ButtonCustom";
import Card from "../../components/Card";
import Header from "../../components/Header";
import InputCustom from "../../components/InputCustom";
import { useAppData } from "../../hooks/useAppData";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../theme";

const parseNeighborhoods = (value) => {
  const map = new Map();
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((item) => {
      const key = item.toLowerCase();
      if (!map.has(key)) {
        map.set(key, item);
      }
    });

  if (!map.has("monte cristo")) {
    map.set("monte cristo", "Monte Cristo");
  }

  return Array.from(map.values());
};

const ConfiguracoesScreen = ({ navigation }) => {
  const { config, saveConfig } = useAppData();
  const { isMaster } = useAuth();

  const [nomeApp, setNomeApp] = useState(config.nomeApp);
  const [logoUrl, setLogoUrl] = useState(config.logoUrl);
  const [vagasTotais, setVagasTotais] = useState(String(config.vagasTotais));
  const [bairrosPermitidos, setBairrosPermitidos] = useState(
    (config.bairrosPermitidos || ["Monte Cristo"]).join(", ")
  );
  const [feedback, setFeedback] = useState("");

  const onSave = () => {
    if (!nomeApp.trim()) {
      setFeedback("O nome do app não pode estar vazio.");
      return;
    }
    const vagas = Number(vagasTotais);
    if (!vagas || vagas < 1) {
      setFeedback("Informe um número válido de vagas.");
      return;
    }
    const bairrosNormalizados = parseNeighborhoods(bairrosPermitidos);
    saveConfig({
      nomeApp,
      logoUrl,
      vagasTotais,
      bairrosPermitidos: isMaster ? bairrosNormalizados : config.bairrosPermitidos,
    });
    setFeedback("Configurações salvas com sucesso.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Configurações" subtitle="Ajustes gerais da ONG" />

        <Card>
          <Text style={styles.sectionTitle}>Dados da ONG</Text>
          <InputCustom
            label="Nome do aplicativo"
            value={nomeApp}
            onChangeText={setNomeApp}
          />
          <InputCustom
            label="URL da logo"
            value={logoUrl}
            onChangeText={setLogoUrl}
            placeholder="https://..."
          />
          <InputCustom
            label="Vagas máximas de famílias"
            value={vagasTotais}
            onChangeText={setVagasTotais}
            keyboardType="number-pad"
          />
          {isMaster ? (
            <InputCustom
              label="Bairros permitidos (separados por vírgula)"
              value={bairrosPermitidos}
              onChangeText={setBairrosPermitidos}
              placeholder="Ex.: Monte Cristo, Centro"
            />
          ) : (
            <Text style={styles.meta}>
              Bairros permitidos: {(config.bairrosPermitidos || ["Monte Cristo"]).join(", ")}
            </Text>
          )}
          <ButtonCustom title="Salvar configurações" onPress={onSave} />
          {!!feedback && (
            <Text
              style={[
                styles.feedback,
                feedback.includes("sucesso") ? styles.success : styles.error,
              ]}
            >
              {feedback}
            </Text>
          )}
        </Card>

        {isMaster && (
          <Card>
            <Text style={styles.sectionTitle}>Administradores</Text>
            <Text style={styles.meta}>
              Gerencie os administradores do sistema, permissões e status de acesso.
            </Text>
            <ButtonCustom
              title="Gestão de Administradores"
              variant="secondary"
              onPress={() => navigation.navigate("GestaoAdmins")}
            />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 16,
    marginBottom: theme.spacing.sm,
  },
  meta: {
    color: theme.colors.textSoft,
    fontSize: 13,
    marginBottom: theme.spacing.sm,
  },
  feedback: {
    marginTop: theme.spacing.sm,
    fontWeight: "600",
    fontSize: 14,
  },
  success: {
    color: theme.colors.success,
  },
  error: {
    color: theme.colors.danger,
  },
});

export default ConfiguracoesScreen;
