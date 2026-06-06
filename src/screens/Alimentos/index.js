import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  const { familias, perdas, addFood, addLoss, startNewFoodEntry, foodWeeklyEntries } = useAppData();

  const [nome, setNome] = useState("");
  const [caixas, setCaixas] = useState("");
  const [itensPorCaixa, setItensPorCaixa] = useState("");

  const [selectedLossFoodId, setSelectedLossFoodId] = useState("");
  const [lossQtd, setLossQtd] = useState("");
  const [lossReason, setLossReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [overlayMessage, setOverlayMessage] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  // Get current week foods
  const activeFoodEntry = [...foodWeeklyEntries]
    .filter((entry) => !entry.archivedAt)
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))[0];
  const currentWeekKey = activeFoodEntry?.weekKey || foodWeeklyService.getCurrentWeekKey();
  const currentWeekFoods = activeFoodEntry?.foods || [];
  const familiasAtivas = familias.filter((f) => f.status === "ativo").length;
  const familiasCadastradas = familias.filter((f) => f.status !== "excluido").length;
  const currentWeekLosses = perdas.filter(
    (loss) => (activeFoodEntry?.id && loss.foodEntryId === activeFoodEntry.id) || (!activeFoodEntry?.id && loss.weekKey === currentWeekKey)
  );

  // Calculate items per family when inputs change
  const calculateItemsPerFamily = () => {
    const c = Number(caixas) || 0;
    const i = Number(itensPorCaixa) || 0;
    const totalItems = c * i;
    if (familiasAtivas === 0) return 0;
    return Math.floor(totalItems / familiasAtivas);
  };

  const itemsPerFamily = calculateItemsPerFamily();
  const selectedLossFood = currentWeekFoods.find((food) => food.id === selectedLossFoodId);
  const selectedFoodTotalItems =
    selectedLossFood ? Number(selectedLossFood.caixasRecebidas || 0) * Number(selectedLossFood.itensPorCaixa || 0) : 0;
  const selectedFoodLostItems = selectedLossFood
    ? currentWeekLosses
        .filter((loss) => loss.foodId === selectedLossFood.id)
        .reduce((sum, loss) => sum + Number(loss.quantidade || 0), 0)
    : 0;
  const selectedFoodAvailableItems = Math.max(0, selectedFoodTotalItems - selectedFoodLostItems);

  const foodStats = currentWeekFoods.map((food) => {
    const totalItems = Number(food.caixasRecebidas || 0) * Number(food.itensPorCaixa || 0);
    const lostItems = currentWeekLosses
      .filter((loss) => loss.foodId === food.id)
      .reduce((sum, loss) => sum + Number(loss.quantidade || 0), 0);
    return {
      ...food,
      totalItems,
      lostItems,
      availableItems: Math.max(0, totalItems - lostItems),
    };
  });

  const onAddFood = () => {
    if (!nome || !caixas || !itensPorCaixa) {
      setFeedback("Preencha todos os campos do alimento.");
      return;
    }

    const totalItems = Number(caixas || 0) * Number(itensPorCaixa || 0);
    const porFamiliaCadastrada =
      familiasCadastradas > 0 ? Math.floor(totalItems / familiasCadastradas) : 0;

    addFood({ nome, caixasRecebidas: caixas, itensPorCaixa });
    setNome("");
    setCaixas("");
    setItensPorCaixa("");
    setFeedback("Alimento cadastrado com sucesso.");
    setOverlayMessage(
      `Alimento adicionado! ${porFamiliaCadastrada} item(ns) por família cadastrada.`
    );
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 2200);
  };

  const onAddLoss = () => {
    if (!selectedLossFood) {
      setFeedback("Selecione um alimento da semana para registrar a perda.");
      return;
    }
    if (!lossQtd || !lossReason) {
      setFeedback("Informe quantidade e motivo da perda.");
      return;
    }

    const qtd = Number(lossQtd || 0);
    if (!qtd || qtd <= 0) {
      setFeedback("Informe uma quantidade válida para perda.");
      return;
    }
    if (qtd > selectedFoodAvailableItems) {
      setFeedback(`Quantidade maior que o saldo disponível (${selectedFoodAvailableItems}).`);
      return;
    }

    addLoss({
      foodId: selectedLossFood.id,
      nome: selectedLossFood.nome,
      quantidade: qtd,
      reason: lossReason,
      weekKey: currentWeekKey,
      foodEntryId: activeFoodEntry?.id,
    });
    setLossQtd("");
    setLossReason("");
    setFeedback(`Perda registrada em ${selectedLossFood.nome}.`);
  };

  const onStartNewEntry = () => {
    Alert.alert(
      "Iniciar nova entrada",
      "Tem certeza de que deseja iniciar uma nova entrada? Isso fechará a entrada semanal atual para relatórios e dashboards.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Iniciar nova entrada",
          style: "destructive",
          onPress: () => {
            startNewFoodEntry();
            setSelectedLossFoodId("");
            setLossQtd("");
            setLossReason("");
            setFeedback("Nova entrada de alimentos iniciada com sucesso.");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Controle de Alimentos" subtitle="Cadastro e perdas" />

        <Card>
          <Text style={styles.meta}>
            Entrada ativa: {currentWeekKey} {activeFoodEntry?.createdAt ? `• iniciada em ${new Date(activeFoodEntry.createdAt).toLocaleString("pt-BR")}` : ""}
          </Text>
          <ButtonCustom title="Iniciar nova entrada semanal" variant="danger" onPress={onStartNewEntry} />
        </Card>

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
          {currentWeekFoods.length === 0 ? (
            <Text style={styles.meta}>Cadastre alimentos da semana antes de registrar perdas.</Text>
          ) : (
            <>
              <Text style={styles.pickerLabel}>Selecione o alimento da semana</Text>
              <View style={styles.pickerRow}>
                {foodStats.map((food) => {
                  const selected = selectedLossFoodId === food.id;
                  return (
                    <TouchableOpacity
                      key={food.id}
                      style={[styles.pill, selected && styles.pillActive]}
                      onPress={() => setSelectedLossFoodId(food.id)}
                    >
                      <Text style={[styles.pillText, selected && styles.pillTextActive]}>
                        {food.nome}
                      </Text>
                      <Text style={[styles.pillSubText, selected && styles.pillTextActive]}>
                        Saldo: {food.availableItems}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {!!selectedLossFood && (
                <Text style={styles.meta}>
                  {selectedLossFood.nome}: {selectedFoodTotalItems} entrada(s), {selectedFoodLostItems} perda(s), saldo {selectedFoodAvailableItems}.
                </Text>
              )}
            </>
          )}
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
              {foodStats.map((alimento) => {
                const total = alimento.totalItems;
                const porFamilia = familiasAtivas > 0 ? Math.floor(total / familiasAtivas) : 0;
                return (
                  <View key={alimento.id} style={styles.foodRow}>
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{alimento.nome}</Text>
                      <Text style={styles.meta}>
                        {alimento.caixasRecebidas} caixas × {alimento.itensPorCaixa} itens = {total} total
                      </Text>
                      <Text style={styles.meta}>Perdas: {alimento.lostItems} | Saldo: {alimento.availableItems}</Text>
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
      {showOverlay && (
        <View style={styles.overlayWrap}>
          <View style={styles.overlayCard}>
            <Text style={styles.overlayTitle}>Alimento adicionado</Text>
            <Text style={styles.overlayText}>{overlayMessage}</Text>
          </View>
        </View>
      )}
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
  pickerLabel: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: 13,
    marginTop: theme.spacing.xs,
    marginBottom: 6,
  },
  pickerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  pillActive: {
    backgroundColor: theme.colors.primary,
  },
  pillText: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  pillSubText: {
    color: theme.colors.textSoft,
    fontSize: 11,
    marginTop: 2,
  },
  pillTextActive: {
    color: "#fff",
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
  overlayWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 28,
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
  },
  overlayCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: theme.colors.success,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  overlayTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  overlayText: {
    color: "#fff",
    marginTop: 4,
    fontSize: 13,
  },
});

export default AlimentosScreen;
