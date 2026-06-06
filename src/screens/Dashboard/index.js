import React from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import ButtonCustom from "../../components/ButtonCustom";
import Card from "../../components/Card";
import { useAppData } from "../../hooks/useAppData";
import { useAuth } from "../../hooks/useAuth";
import { theme } from "../../theme";

const logoImg = require("../../../logo-app.png");
const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundColor: theme.colors.surface,
  backgroundGradientFrom: theme.colors.surface,
  backgroundGradientTo: theme.colors.surface,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(26, 61, 110, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(50, 50, 60, ${opacity})`,
};

const Tile = ({ label, value, subtitle }) => (
  <View style={styles.tile}>
    <Text style={styles.tileLabel}>{label}</Text>
    <Text style={styles.tileValue}>{value}</Text>
    {!!subtitle && <Text style={styles.tileSubtitle}>{subtitle}</Text>}
  </View>
);

const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { config, totals, weeklySummary, distributedCount, ticketsSemana } = useAppData();

  const tiles = [
    { label: "Famílias", value: totals.ativas + totals.inativas + (totals.emEspera || 0), subtitle: "Ativas, inativas e espera" },
    { label: "Ativas", value: totals.ativas, subtitle: "Em atendimento" },
    { label: "Inativas", value: totals.inativas, subtitle: "Sem retirada recente" },
    { label: "Lista de espera", value: totals.emEspera || 0, subtitle: "Aguardando vaga" },
    { label: "Retiradas semana", value: weeklySummary.retiraram, subtitle: "Confirmadas" },
    { label: "Não retiraram", value: weeklySummary.naoRetiraram, subtitle: "Da lista semanal" },
    { label: "Retiradas confirmadas", value: distributedCount, subtitle: "Total de atendimentos" },
  ];

  const chartWidth = screenWidth - theme.spacing.md * 2 - 32;

  const barData = {
    labels: ["Retiraram", "Não retiraram", "Em fila"],
    datasets: [
      {
        data: [
          weeklySummary.retiraram || 0,
          weeklySummary.naoRetiraram || 0,
          weeklySummary.emFila || 0,
        ],
      },
    ],
  };

  const pieData = [
    {
      name: "Ativas",
      population: Math.max(totals.ativas || 0, 1),
      color: theme.colors.primary,
      legendFontColor: theme.colors.text,
      legendFontSize: 13,
    },
    {
      name: "Inativas",
      population: Math.max(totals.inativas || 0, 0),
      color: theme.colors.accent,
      legendFontColor: theme.colors.text,
      legendFontSize: 13,
    },
  ];

  const totalRecebido = totals.totalAlimentosRecebidos || 0;
  const totalPerdas = totals.totalPerdas || 0;
  const totalEntregues = Math.max(totalRecebido - totalPerdas, 0);
  const temDadosAlimentos = totalRecebido > 0 || totalPerdas > 0;

  const foodBarData = {
    labels: ["Entregues", "Desperdiçados"],
    datasets: [
      {
        data: [totalEntregues, totalPerdas],
      },
    ],
  };

  const foodChartConfig = {
    ...chartConfig,
    color: (opacity = 1, index) =>
      index === 1
        ? `rgba(220, 53, 69, ${opacity})`
        : `rgba(26, 61, 110, ${opacity})`,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Image source={logoImg} style={styles.logo} resizeMode="contain" />
            <View>
              <Text style={styles.topBarTitle}>{config.nomeApp}</Text>
              <Text style={styles.topBarSub}>Olá, {user?.nome}</Text>
            </View>
          </View>
          <ButtonCustom title="Sair" variant="danger" onPress={logout} />
        </View>

        <ButtonCustom title="RETIRADAS" onPress={() => navigation.navigate("Retirada")} />

        <View style={styles.grid}>
          {tiles.map((item) => (
            <Tile key={item.label} label={item.label} value={item.value} subtitle={item.subtitle} />
          ))}
        </View>

        <Card>
          <Text style={styles.sectionTitle}>Atendimento da semana</Text>
          <BarChart
            data={barData}
            width={chartWidth}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
            fromZero
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Famílias ativas vs inativas</Text>
          <PieChart
            data={pieData}
            width={chartWidth}
            height={160}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Alimentos: entregues vs desperdiçados</Text>
          {temDadosAlimentos ? (
            <>
              <BarChart
                data={foodBarData}
                width={chartWidth}
                height={200}
                chartConfig={foodChartConfig}
                style={styles.chart}
                showValuesOnTopOfBars
                fromZero
              />
              <View style={styles.foodLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
                  <Text style={styles.legendText}>Entregues: {totalEntregues}</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: theme.colors.danger }]} />
                  <Text style={styles.legendText}>Desperdiçados: {totalPerdas}</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: theme.colors.textSoft }]} />
                  <Text style={styles.legendText}>Total recebido: {totalRecebido}</Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.emptyNote}>
              Nenhum alimento registrado. Cadastre entradas em "Controle de Alimentos".
            </Text>
          )}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Operação</Text>
          <ButtonCustom
            title="Cadastro de Famílias"
            variant="secondary"
            onPress={() => navigation.navigate("CadastroFamilia")}
          />
          <ButtonCustom
            title="Controle de Alimentos e Perdas"
            variant="secondary"
            onPress={() => navigation.navigate("Alimentos")}
          />
          <ButtonCustom
            title="Relatórios"
            variant="secondary"
            onPress={() => navigation.navigate("Relatorios")}
          />
          <ButtonCustom
            title="Configurações"
            variant="secondary"
            onPress={() => navigation.navigate("Configuracoes")}
          />
          <Text style={styles.smallInfo}>Senhas semanais geradas: {ticketsSemana.length}</Text>
        </Card>
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
    paddingBottom: theme.spacing.xl,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  logo: {
    width: 52,
    height: 52,
    marginRight: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  topBarTitle: {
    color: theme.colors.primary,
    fontWeight: "800",
    fontSize: 16,
  },
  topBarSub: {
    color: theme.colors.textSoft,
    fontSize: 12,
    marginTop: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  tile: {
    width: "48.5%",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  tileLabel: {
    color: theme.colors.textSoft,
    fontSize: 12,
    fontWeight: "600",
  },
  tileValue: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },
  tileSubtitle: {
    color: theme.colors.textSoft,
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
    fontSize: 16,
  },
  chart: {
    borderRadius: theme.radius.md,
    marginLeft: -theme.spacing.sm,
  },
  smallInfo: {
    color: theme.colors.textSoft,
    marginTop: 4,
    marginBottom: 8,
  },
  foodLegend: {
    marginTop: theme.spacing.sm,
    gap: 6,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  emptyNote: {
    color: theme.colors.textSoft,
    fontStyle: "italic",
    fontSize: 13,
  },
});

export default DashboardScreen;
