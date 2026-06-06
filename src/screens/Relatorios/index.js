import * as Clipboard from "expo-clipboard";
import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import ButtonCustom from "../../components/ButtonCustom";
import Card from "../../components/Card";
import Header from "../../components/Header";
import { useAppData } from "../../hooks/useAppData";
import { foodWeeklyService } from "../../services/foodWeeklyService";
import { theme } from "../../theme";

const buildReportText = ({ reportDate, summary, weeklyFoodSummary, atendimentoPercent }) => {
  const date = reportDate ? new Date(`${reportDate}T12:00:00`) : new Date();
  const dataStr = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return [
    "🫶 *Monte Cristo Solidário*",
    `📅 Relatório da retirada — ${dataStr}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "*ATENDIMENTO DO DIA*",
    `✅ Famílias atendidas: ${summary.retiraram}`,
    `❌ Não retiraram: ${summary.naoRetiraram}`,
    `📊 Percentual atendido: ${atendimentoPercent.toFixed(1)}%`,
    "",
    "*ALIMENTOS DA SEMANA*",
    `📥 Entradas da semana: ${weeklyFoodSummary.entryItems}`,
    `🗑️ Perdas da semana: ${weeklyFoodSummary.lossItems}`,
    `📦 Saldo da semana: ${weeklyFoodSummary.availableItems}`,
    `📊 Perda da semana: ${weeklyFoodSummary.lossPercent.toFixed(1)}%`,
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "_Gerado pelo sistema Monte Cristo Solidário_",
  ].join("\n");
};

const toSummary = (tickets = []) => {
  const retiraram = tickets.filter((item) => item.retiradaRealizada).length;
  const total = tickets.length;
  return {
    retiraram,
    naoRetiraram: total - retiraram,
    total,
  };
};

const formatDate = (dateKey) => {
  if (!dateKey) return "-";
  const date = new Date(`${dateKey}T12:00:00`);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const RelatoriosScreen = () => {
  const { historicoListas, foodWeeklyEntries, perdas } = useAppData();
  const [copied, setCopied] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const sortedHistory = useMemo(
    () => [...historicoListas].sort((a, b) => String(b.dateKey).localeCompare(String(a.dateKey))),
    [historicoListas]
  );

  const currentEntry = useMemo(() => {
    if (!sortedHistory.length) return null;
    const target = selectedDate || sortedHistory[0].dateKey;
    return sortedHistory.find((item) => item.dateKey === target) || sortedHistory[0];
  }, [selectedDate, sortedHistory]);

  const summary = toSummary(currentEntry?.tickets || []);

  const safeAtendimentoPercent =
    summary.total > 0
      ? (summary.retiraram / summary.total) * 100
      : 0;

  const selectedDateLabel = currentEntry ? formatDate(currentEntry.dateKey) : "-";
  const selectedWeekKey = currentEntry?.weekKey || foodWeeklyService.getCurrentWeekKey();
  const selectedFoodEntryId = currentEntry?.foodEntryId || null;

  const weeklyFoodSummary = useMemo(() => {
    const weekEntry = selectedFoodEntryId
      ? foodWeeklyEntries.find((entry) => entry.id === selectedFoodEntryId)
      : [...foodWeeklyEntries]
          .filter((entry) => entry.weekKey === selectedWeekKey)
          .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))[0];
    const foods = weekEntry?.foods || [];
    const weekLosses = perdas.filter((loss) =>
      weekEntry?.id ? loss.foodEntryId === weekEntry.id : loss.weekKey === selectedWeekKey
    );
    const entryItems = foods.reduce(
      (sum, food) => sum + Number(food.caixasRecebidas || 0) * Number(food.itensPorCaixa || 0),
      0
    );
    const lossItems = weekLosses.reduce((sum, loss) => sum + Number(loss.quantidade || 0), 0);
    const availableItems = Math.max(0, entryItems - lossItems);
    const lossPercent = entryItems > 0 ? (lossItems / entryItems) * 100 : 0;

    return { entryItems, lossItems, availableItems, lossPercent };
  }, [foodWeeklyEntries, perdas, selectedWeekKey, selectedFoodEntryId]);

  const onCopyReport = async () => {
    if (!currentEntry) return;
    const text = buildReportText({
      reportDate: currentEntry.dateKey,
      summary,
      weeklyFoodSummary,
      atendimentoPercent: safeAtendimentoPercent,
    });
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Relatórios" subtitle="Histórico por data de retirada" />

        <Card>
          <Text style={styles.sectionTitle}>Relatório da data selecionada</Text>
          <Row label="Data da retirada" value={selectedDateLabel} />
          <Row label="Famílias atendidas" value={summary.retiraram} />
          <Row label="Famílias não atendidas" value={summary.naoRetiraram} />
          <Row label="Percentual atendido" value={`${safeAtendimentoPercent.toFixed(1)}%`} />
          <Row label="Entradas da semana" value={weeklyFoodSummary.entryItems} />
          <Row label="Perdas da semana" value={weeklyFoodSummary.lossItems} />
          <Row label="Saldo da semana" value={weeklyFoodSummary.availableItems} />
          <Row label="Perda da semana" value={`${weeklyFoodSummary.lossPercent.toFixed(1)}%`} />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Relatórios anteriores por data</Text>
          {!sortedHistory.length && (
            <Text style={styles.meta}>Nenhuma lista gerada ainda. Gere uma retirada primeiro.</Text>
          )}
          {sortedHistory.map((item) => {
            const itemSummary = toSummary(item.tickets || []);
            const selected = currentEntry?.dateKey === item.dateKey;
            return (
              <View key={item.dateKey} style={styles.historyItem}>
                <View>
                  <Text style={styles.historyDate}>{formatDate(item.dateKey)}</Text>
                  <Text style={styles.meta}>
                    Atendidas: {itemSummary.retiraram} | Não retiraram: {itemSummary.naoRetiraram}
                  </Text>
                </View>
                <ButtonCustom
                  title={selected ? "Selecionado" : "Ver relatório"}
                  variant="secondary"
                  onPress={() => setSelectedDate(item.dateKey)}
                />
              </View>
            );
          })}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Exportar relatório</Text>
          <Text style={styles.meta}>
            Copia o relatório formatado para colar no WhatsApp, e-mail ou PDF.
          </Text>
          <ButtonCustom
            title={copied ? "Relatório copiado" : "Copiar relatório para WhatsApp"}
            onPress={onCopyReport}
            variant={copied ? "secondary" : "primary"}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const Row = ({ label, value }) => (
  <View style={rowStyles.row}>
    <Text style={rowStyles.label}>{label}</Text>
    <Text style={rowStyles.value}>{value}</Text>
  </View>
);

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  label: {
    color: theme.colors.textSoft,
    fontSize: 14,
    flex: 1,
  },
  value: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 14,
  },
});

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
    marginBottom: theme.spacing.sm,
    fontSize: 16,
  },
  meta: {
    color: theme.colors.textSoft,
    marginBottom: theme.spacing.sm,
    fontSize: 13,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  historyDate: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
});

export default RelatoriosScreen;
