import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ButtonCustom from "../../components/ButtonCustom";
import Card from "../../components/Card";
import Header from "../../components/Header";
import InputCustom from "../../components/InputCustom";
import { useAppData } from "../../hooks/useAppData";
import { theme } from "../../theme";
import { formatCpf, formatDateTime } from "../../utils/formatters";

const initialForm = {
  id: null,
  nome: "",
  cpf: "",
  telefone: "",
  logradouro: "",
  numero: "",
  bairro: "Monte Cristo",
  status: "ativo",
};

const tabs = [
  { key: "ativo", label: "Ativas" },
  { key: "inativo", label: "Inativadas" },
  { key: "excluido", label: "Excluídas" },
  { key: "espera", label: "Em espera" },
];

const splitEndereco = (endereco = "") => {
  const parts = endereco.split(",").map((s) => s.trim());
  if (parts.length >= 2) {
    const numero = parts[parts.length - 1];
    const logradouro = parts.slice(0, -1).join(", ");
    return { logradouro, numero };
  }
  return { logradouro: endereco, numero: "" };
};

const CadastroFamiliaScreen = () => {
  const {
    config,
    saveFamily,
    reactivateFamily,
    inactivateFamily,
    deleteFamily,
    restoreFamily,
    promoteToActive,
    searchFamilies,
  } = useAppData();

  const [query, setQuery] = useState("");
  const [form, setForm] = useState(initialForm);
  const [activeTab, setActiveTab] = useState("ativo");
  const [modalVisible, setModalVisible] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedback, setFeedback] = useState("");

  const found = useMemo(() => {
    const searched = searchFamilies(query);
    return searched.filter((family) => family.status === activeTab);
  }, [query, searchFamilies, activeTab]);

  const setField = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setForm(initialForm);
    setFieldErrors({});
    setFeedback("");
    setModalVisible(true);
  };

  const openEdit = (family) => {
    const logradouro = family.logradouro || splitEndereco(family.endereco).logradouro;
    const numero = family.numero || splitEndereco(family.endereco).numero;
    setForm({ ...initialForm, ...family, logradouro, numero });
    setFieldErrors({});
    setFeedback("");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setForm(initialForm);
    setFieldErrors({});
  };

  const onSave = async () => {
    setFieldErrors({});
    const result = await saveFamily(form);
    if (!result.ok) {
      if (result.field) {
        setFieldErrors({ [result.field]: result.message });
      } else {
        setFieldErrors({ _general: result.message });
      }
      return;
    }
    closeModal();
    setFeedback("Família salva com sucesso.");
  };

  const allowedNeighborhoods = (config.bairrosPermitidos || ["Monte Cristo"]).join(", ");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Cadastro de Famílias" subtitle="Busca por CPF ou nome" />

        <Card>
          <InputCustom
            label="Buscar família"
            value={query}
            onChangeText={setQuery}
            placeholder="CPF ou nome"
          />
          <Text style={styles.meta}>Bairros permitidos: {allowedNeighborhoods}</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Gerenciamento</Text>
          <ButtonCustom title="Nova família" onPress={openCreate} />

          <View style={styles.tabsRow}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                >
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {found.length === 0 && (
          <Card>
            <Text style={styles.meta}>Nenhuma família nesta categoria.</Text>
          </Card>
        )}

        {found.map((family) => (
          <Card key={family.id}>
            <Text style={styles.familyName}>{family.nome}</Text>
            <Text style={styles.primaryKey}>CPF: {formatCpf(family.cpf)}</Text>
            <Text style={styles.meta}>Tel: {family.telefone}</Text>
            <Text style={styles.meta}>
              Endereço: {family.logradouro || family.endereco}
              {family.numero ? `, ${family.numero}` : ""}
            </Text>
            <Text style={styles.meta}>Bairro: {family.bairro || "-"}</Text>
            <Text style={styles.meta}>
              Status:{" "}
              {family.status === "ativo" ? "Ativo" : family.status === "inativo" ? "Inativo" : "Excluído"}
            </Text>
            <Text style={styles.meta}>Última retirada: {formatDateTime(family.lastWithdrawalAt)}</Text>
            <Text style={styles.meta}>Cadastrado por: {family.createdByName || "-"}</Text>

            {family.status !== "excluido" && (
              <ButtonCustom title="Editar" variant="secondary" onPress={() => openEdit(family)} />
            )}
            {family.status === "ativo" && (
              <ButtonCustom
                title="Inativar família"
                variant="secondary"
                onPress={() => inactivateFamily(family.id)}
              />
            )}
            {family.status === "inativo" && (
              <ButtonCustom title="Reativar família" onPress={() => reactivateFamily(family.id)} />
            )}
            {family.status === "espera" && (
              <ButtonCustom
                title="Ativar agora"
                onPress={() => promoteToActive(family.id)}
              />
            )}
            {family.status !== "excluido" && (
              <ButtonCustom
                title="Excluir família"
                variant="danger"
                onPress={() => deleteFamily(family.id)}
              />
            )}
            {family.status === "excluido" && (
              <ButtonCustom
                title="Restaurar para inativadas"
                variant="secondary"
                onPress={() => restoreFamily(family.id)}
              />
            )}
          </Card>
        ))}

        {!!feedback && (
          <Text style={[styles.feedback, feedback.includes("sucesso") ? styles.ok : styles.error]}>
            {feedback}
          </Text>
        )}

        <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.modalTitle}>
                  {form.id ? "Editar família" : "Nova família"}
                </Text>

                {!!fieldErrors._general && (
                  <Text style={[styles.feedback, styles.error]}>{fieldErrors._general}</Text>
                )}

                <InputCustom
                  label="Nome completo"
                  value={form.nome}
                  onChangeText={setField("nome")}
                  error={fieldErrors.nome}
                />
                <InputCustom
                  label="CPF (somente números)"
                  value={form.cpf}
                  onChangeText={setField("cpf")}
                  keyboardType="number-pad"
                  maxLength={11}
                  error={fieldErrors.cpf}
                />
                <InputCustom
                  label="Telefone (DDD + número)"
                  value={form.telefone}
                  onChangeText={setField("telefone")}
                  keyboardType="phone-pad"
                  error={fieldErrors.telefone}
                />
                <InputCustom
                  label="Rua / Avenida"
                  value={form.logradouro}
                  onChangeText={setField("logradouro")}
                  placeholder="Ex.: Rua das Flores"
                  error={fieldErrors.logradouro}
                />
                <InputCustom
                  label="Número da residência"
                  value={form.numero}
                  onChangeText={setField("numero")}
                  placeholder="Ex.: 123"
                  keyboardType="default"
                  error={fieldErrors.numero}
                />
                <InputCustom
                  label="Bairro"
                  value={form.bairro}
                  onChangeText={setField("bairro")}
                  placeholder="Monte Cristo"
                  error={fieldErrors.bairro}
                />
                <Text style={styles.hint}>Bairros permitidos: {allowedNeighborhoods}</Text>

                <ButtonCustom title="Salvar família" onPress={onSave} />
                <ButtonCustom title="Fechar" variant="secondary" onPress={closeModal} />
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  familyName: { color: theme.colors.text, fontWeight: "700", fontSize: 16 },
  primaryKey: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 13,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  sectionTitle: { color: theme.colors.text, fontWeight: "700", marginBottom: theme.spacing.sm },
  tabsRow: { flexDirection: "row", gap: theme.spacing.xs, marginTop: theme.spacing.sm },
  tabBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabBtnActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  tabText: { color: theme.colors.text, fontWeight: "600", fontSize: 13 },
  tabTextActive: { color: theme.colors.surface },
  meta: { color: theme.colors.textSoft, marginTop: 2 },
  hint: { color: theme.colors.textSoft, fontSize: 12, marginBottom: theme.spacing.sm },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: theme.spacing.md,
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    maxHeight: "92%",
  },
  modalTitle: {
    color: theme.colors.text,
    fontWeight: "800",
    fontSize: 16,
    marginBottom: theme.spacing.sm,
  },
  feedback: { marginTop: theme.spacing.sm, fontWeight: "700" },
  ok: { color: theme.colors.success },
  error: { color: theme.colors.danger },
});

export default CadastroFamiliaScreen;
