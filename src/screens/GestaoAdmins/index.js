import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import ButtonCustom from "../../components/ButtonCustom";
import Card from "../../components/Card";
import Header from "../../components/Header";
import InputCustom from "../../components/InputCustom";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../theme";

const PERMISSION_LABELS = {
  cadastrar: "Cadastrar famílias",
  editar: "Editar famílias",
  visualizar: "Visualizar dados",
  gerarListas: "Gerar listas de retirada",
};

const GestaoAdminsScreen = () => {
  const { users, createAdmin, toggleUserStatus, updatePermissions } = useAuth();

  const [adminNome, setAdminNome] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminSenha, setAdminSenha] = useState("123456");
  const [feedback, setFeedback] = useState("");

  const admins = users.filter((u) => u.role === "ADMIN");

  const onCreateAdmin = () => {
    if (!adminNome.trim() || !adminEmail.trim()) {
      setFeedback("Preencha nome e e-mail.");
      return;
    }
    const result = createAdmin({
      nome: adminNome,
      email: adminEmail,
      senha: adminSenha,
      permissions: { cadastrar: true, editar: true, visualizar: true, gerarListas: true },
    });
    setFeedback(result.message || "Administrador criado com sucesso.");
    if (result.ok) {
      setAdminNome("");
      setAdminEmail("");
      setAdminSenha("123456");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header
          title="Gestão de Administradores"
          subtitle={`${admins.length}/5 cadastrados`}
        />

        {admins.length === 0 && (
          <Card>
            <Text style={styles.empty}>Nenhum administrador cadastrado ainda.</Text>  
          </Card>
        )}

        {admins.map((admin) => (
          <Card key={admin.id}>
            <View style={styles.adminHeader}>
              <View style={styles.adminInfo}>
                <Text style={styles.adminName}>{admin.nome}</Text>
                <Text style={styles.adminEmail}>{admin.email}</Text>
              </View>
              <View style={styles.statusBox}>
                <Text
                  style={[
                    styles.statusBadge,
                    admin.ativo ? styles.activeBadge : styles.inactiveBadge,
                  ]}
                >
                  {admin.ativo ? "Ativo" : "Inativo"}
                </Text>
                <Switch
                  value={admin.ativo}
                  onValueChange={() => toggleUserStatus(admin.id)}
                  trackColor={{ false: theme.colors.danger, true: theme.colors.primary }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            <Text style={styles.permTitle}>Permissões:</Text>
            {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
              <View key={key} style={styles.permRow}>
                <Text style={[styles.permText, !admin.ativo && styles.disabledText]}>
                  {label}
                </Text>
                <Switch
                  value={!!admin.permissions?.[key]}
                  onValueChange={() => updatePermissions(admin.id, key)}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#fff"
                  disabled={!admin.ativo}
                />
              </View>
            ))}
          </Card>
        ))}

        <Card>
          <Text style={styles.sectionTitle}>Criar novo administrador</Text>
          <Text style={styles.meta}>
            {admins.length >= 5
              ? "Limite de 5 administradores atingido."
              : `${5 - admins.length} vaga(s) disponível(is)`}
          </Text>
          <InputCustom
            label="Nome completo"
            value={adminNome}
            onChangeText={setAdminNome}
          />
          <InputCustom
            label="E-mail"
            value={adminEmail}
            onChangeText={setAdminEmail}
            keyboardType="email-address"
          />
          <InputCustom
            label="Senha inicial"
            value={adminSenha}
            onChangeText={setAdminSenha}
          />
          <ButtonCustom
            title="Criar administrador"
            onPress={onCreateAdmin}
            disabled={admins.length >= 5}
          />

        </Card>

        {!!feedback && (
          <Text
            style={[
              styles.feedback,
              feedback.includes("sucesso") ? styles.success : styles.warn,
            ]}
          >
            {feedback}
          </Text>
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
  adminHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  adminInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  adminName: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
  adminEmail: {
    color: theme.colors.textSoft,
    fontSize: 13,
    marginTop: 2,
  },
  statusBox: {
    alignItems: "center",
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 4,
  },
  activeBadge: {
    backgroundColor: "#2f7a4522",
    color: theme.colors.success,
  },
  inactiveBadge: {
    backgroundColor: "#b13e3e22",
    color: theme.colors.danger,
  },
  permTitle: {
    color: theme.colors.textSoft,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 4,
  },
  permRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  permText: {
    color: theme.colors.text,
    fontSize: 14,
    flex: 1,
  },
  disabledText: {
    color: theme.colors.textSoft,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontWeight: "700",
    marginBottom: theme.spacing.xs,
    fontSize: 16,
  },
  meta: {
    color: theme.colors.textSoft,
    marginBottom: theme.spacing.sm,
  },
  empty: {
    color: theme.colors.textSoft,
    textAlign: "center",
    padding: theme.spacing.sm,
  },
  feedback: {
    fontWeight: "700",
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  success: {
    color: theme.colors.success,
  },
  warn: {
    color: theme.colors.danger,
  },
});

export default GestaoAdminsScreen;
