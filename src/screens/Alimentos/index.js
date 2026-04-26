import React, { useState } from "react";
import {
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
import { foodWeeklyService } from "../../services/foodWeeklyService";

const AlimentosScreen = () => {
  const { familias, alimentos, perdas, totals, addFood, removeFood, foodWeeklyEntries } = useAppData();

  const [nome, setNome] = useState("");
  const [caixas, setCaixas] = useState("");
  const [itensPorCaixa, setItensPorCaixa] = useState("");

  const [lossNome, setLossNome] = useState("");
  const [lossQtd, setLossQtd] = useState("");
  const [lossReason, setLossReason] = useState("");
  const [feedback, setFeedback] = useState("");

  // Get current week foods
  const currentWeekFoods = foodWeeklyService.getCurrentWeekFoods(foodWeeklyEntries);

  // Calculate items per family when inputs change
  const calculateItemsPerFamily = () => {
    const c = Number(caixas) || 0;
    const i = Number(itensPorCaixa) || 0;
    const totalItems = c * i;
    if (familiasAtivas === 0) return 0;
    return Math.floor(totalItems / familiasAtivas);
  };

  const itemsPerFamily = calculateItemsPerFamily();

  const onAddFood = () => {
    if (!nome || !caixas || !itensPorCaixa) {
      setFeedback("Preencha todos os campos do alimento.");
      return;
    }

    addFood({ nome, caixasRecebidas: caixas, itensPorCaixa });
    setNome("");
    setCaixas("");
    setItensPorCaixa("");
    setFeedback("Alimento cadastrado com sucesso.");
  };

  const onAddLoss = () => {
    if (!lossNome || !lossQtd || !lossReason) {
      setFeedback("Preencha todos os campos da perda.");
      return;
    }

    addLoss({ nome: lossNome, quantidade: lossQtd, reason: lossReason });
    setLossNome("");
    setLossQtd("");
    setLossReason("");
    setFeedback("Perda registrada com sucesso.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Controle de Alimentos" subtitle="Cadastro e perdas" />

        <Card>
          <Text style={styles.sectionTitle}>Cadastro de alimentos</Text>
          <InputCustom label="Nome do alimento" value={nome} onChangeText={setNome} />
          <InputCustom
            label="Quantidade de caixas"
            value={caixas}
            onChangeText={setCaixas}
            keyboardType="number-pad"
          />
          <InputCustom
            label="Quantidade estimada por caixa"
            value={itensPorCaixa}
            onChangeText={setItensPorCaixa}
            keyboardType="number-pad"
          />
          {itemsPerFamily > 0 && (
            <Text style={styles.calculatedInfo}>
              📦 Total: {(Number(caixas) * Number(itensPorCaixa)) || 0} itens → {itemsPerFamily} por família ativa ({familiasAtivas} famílias)
            </Text>
          )}
          <ButtonCustom title="Adicionar alimento" onPress={onAddFood} />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Controle de perdas</Text>
          <InputCustom label="Alimento descartado" value={lossNome} onChangeText={setLossNome} />
          <InputCustom
            label="Quantidade descartada"
            value={lossQtd}
            onChangeText={setLossQtd}
            keyboardType="number-pad"
          />
          <InputCustom label="Motivo" value={lossReason} onChangeText={setLossReason} />
          <ButtonCustom title="Registrar perda" onPress={onAddLoss} />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Resumo de distribuição</Text>
          {currentWeekFoods.length === 0 ? (
            <Text style={styles.meta}>Nenhum alimento cadastrado ainda.</Text>
          ) : (
            <>
              <Text style={styles.meta}>Famílias ativas: {familiasAtivas}</Text>
              <Text style={styles.divider}>━━━━━━━━━━━━━━━━━━━━</Text>
              {currentWeekFoods.map((alimento) => {
                const total = alimento.caixasRecebidas * alimento.itensPorCaixa;
                const porFamilia = familiasAtivas > 0 ? Math.floor(total / familiasAtivas) : 0;
                return (
                  <View key={alimento.id} style={styles.foodRow}>
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{alimento.nome}</Text>
                      <Text style={styles.meta}>
                        {alimento.caixasRecebidas} caixas × {alimento.itensPorCaixa} itens = {total} total
                      </Text>
                    </View>
                    <View style={styles.foodDistribution}>
                      <Text style={styles.perFamiliaText}>{porFamilia}</Text>
                      <Text style={styles.perFamiliaLabel}>por família</Text>
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </Card>

        {!!feedback && <Text style={styles.feedback}>{feedback}</Text>}
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
    marginBottom: theme.spacing.xs,
    fontSize: 16,
  },
  meta: {
    color: theme.colors.textSoft,
    marginTop: 2,
  },
  calculatedInfo: {
    color: theme.colors.primary,
    fontWeight: "600",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    fontSize: 14,
  },
  divider: {
    color: theme.colors.border,
    marginVertical: theme.spacing.sm,
    fontSize: 12,
  },
  foodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: 14,
  },
  foodDistribution: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
  },
  perFamiliaText: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 18,
  },
  perFamiliaLabel: {
    color: theme.colors.textSoft,
    fontSize: 11,
  },
  feedback: {
    color: theme.colors.success,
    fontWeight: "700",
    marginTop: theme.spacing.sm,
  },
});

export default AlimentosScreen;
