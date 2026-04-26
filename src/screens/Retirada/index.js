import React, { useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import ButtonCustom from "../../components/ButtonCustom";
import Card from "../../components/Card";
import Header from "../../components/Header";
import InputCustom from "../../components/InputCustom";
import { useAppData } from "../../hooks/useAppData";
import { theme } from "../../theme";
import { retiradaService } from "../../services/retiradaService";
import { maskCpf, shortName } from "../../utils/formatters";

const todayBR = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};

const brToIso = (br) => {
  const digits = br.replace(/\D/g, "");
  if (digits.length !== 8) return null;
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return `${year}-${month}-${day}`;
};

const applyDateMask = (raw) => {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
};

const applyHourMask = (raw) => {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
};

const isValidHour = (time) => {
  const regex = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
  return regex.test(time);
};

const RetiradaScreen = () => {
  const {
    familias,
    ticketsSemana,
    generateWeeklyTickets,
    markWithdrawal,
    searchTickets,
    buildWhatsappMessage,
  } = useAppData();

  const [startHour, setStartHour] = useState("08:00");
  const [afternoonHour, setAfternoonHour] = useState("13:00");
  const [interval, setIntervalMin] = useState(5);
  const [period, setPeriod] = useState("manha");
  const [dateInput, setDateInput] = useState(todayBR());
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState("");

  const filteredTickets = useMemo(() => searchTickets(query), [query, searchTickets]);

  const onChangeDate = (raw) => setDateInput(applyDateMask(raw));

  const onChangeStartHour = (raw) => {
    const masked = applyHourMask(raw);
    if (masked.length <= 5) {
      setStartHour(masked);
    }
  };
if (!isValidHour(startHour)) {
      setFeedback(`Horário de início inválido: ${startHour}. Use HH:MM em formato 24h.`);
      return;
    }
    if (!isValidHour(afternoonHour)) {
      setFeedback(`Horário da tarde inválido: ${afternoonHour}. Use HH:MM em formato 24h.`);
      return;
    }
    
  const onChangeAfternoonHour = (raw) => {
    const masked = applyHourMask(raw);
    if (masked.length <= 5) {
      setAfternoonHour(masked);
    }
  };

  const onGenerateList = () => {
    const isoDate = brToIso(dateInput);
    if (!isoDate) {
      setFeedback("Data inválida. Use o formato DD-MM-AAAA.");
      return;
    }
    const result = generateWeeklyTickets({ startHour, targetDate: isoDate, interval, period, afternoonHour });
    if (!result.ok) {
      setFeedback(result.message);
      return;
    }
    setFeedback(`Lista de ${dateInput} gerada com ${result.list.length} senhas.`);
  };

  const onMark = (ticketId) => {
    const result = markWithdrawal(ticketId);
    setFeedback(result.message);
  };

  const copyList = async () => {
    if (!ticketsSemana.length) {
      setFeedback("Gere a lista semanal antes de copiar.");
      return;
    }
    const isoDate = brToIso(dateInput);
    const startLabel =
      period === "tarde" ? afternoonHour :
      period === "ambos" ? `${startHour} / ${afternoonHour}` :
      startHour;
    const text = retiradaService.buildListMessage(ticketsSemana, familias, {
      targetDate: isoDate,
      startHour: startLabel,
    });
    await Clipboard.setStringAsync(text);
    setFeedback("Lista copiada para a área de transferência.");
  };

  const copyWhatsappMessage = async (ticket) => {
    const family = familias.find((f) => f.id === ticket.familyId);
    if (!family) return;
    const message = buildWhatsappMessage(ticket, shortName(family.nome), maskCpf(family.cpf));
    await Clipboard.setStringAsync(message);
    Alert.alert("Mensagem copiada", "Mensagem pronta para WhatsApp copiada.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Retiradas" subtitle="Busca por CPF, nome ou senha" />

        <Card>
          {period !== "tarde" && (
            <InputCustom
              label={period === "ambos" ? "Horário manhã" : "Horário de início"}
              value={startHour}
              onChangeText={onChangeStartHour}
              placeholder="08:00"
              maxLength={5}
            />
          )}
          {period !== "manha" && (
            <InputCustom
              label={period === "ambos" ? "Horário tarde" : "Horário de início"}
              value={afternoonHour}
              onChangeText={onChangeAfternoonHour}
              placeholder="13:00"
              maxLength={5}
            />
          )}
          <InputCustom
            label="Data da lista"
            value={dateInput}
            onChangeText={onChangeDate}
            placeholder="DD-MM-AAAA"
            keyboardType="number-pad"
            maxLength={10}
          />

          <Text style={styles.pickerLabel}>Intervalo entre atendimentos</Text>
          <View style={styles.pickerRow}>
            {[2, 3, 5, 10, 15].map((min) => (
              <TouchableOpacity
                key={min}
                style={[styles.pill, interval === min && styles.pillActive]}
                onPress={() => setIntervalMin(min)}
              >
                <Text style={[styles.pillText, interval === min && styles.pillTextActive]}>
                  {min} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.pickerLabel}>Período de atendimento</Text>
          <View style={styles.pickerRow}>
            {[
              { value: "manha", label: "Só manhã" },
              { value: "tarde", label: "Só tarde" },
              { value: "ambos", label: "Manhã + tarde" },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.pill, period === opt.value && styles.pillActive]}
                onPress={() => setPeriod(opt.value)}
              >
                <Text style={[styles.pillText, period === opt.value && styles.pillTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ButtonCustom title="Gerar lista semanal" onPress={onGenerateList} />
          <ButtonCustom title="Copiar lista" variant="secondary" onPress={copyList} />
        </Card>

        <Card>
          <InputCustom
            label="Buscar atendimento"
            value={query}
            onChangeText={setQuery}
            placeholder="CPF, nome ou senha"
          />
        </Card>

        {filteredTickets.map((ticket) => {
          const family = familias.find((f) => f.id === ticket.familyId);
          if (!family) return null;

          return (
            <Card key={ticket.id}>
              <Text style={styles.name}>
                SENHA {String(ticket.senha).padStart(2, "0")}: {family.nome.toUpperCase()} CPF FINAL {String(family.cpf || "").replace(/\D/g, "").slice(-2)}
              </Text>
              <Text style={styles.meta}>Horário: {ticket.horario}</Text>
              <Text style={styles.meta}>
                Status: {ticket.retiradaRealizada ? "✓ Retirado" : "Aguardando"}
              </Text>
              <ButtonCustom
                title="Marcar retirada"
                onPress={() => onMark(ticket.id)}
                disabled={ticket.retiradaRealizada}
              />
              <ButtonCustom
                title="Copiar mensagem WhatsApp"
                variant="secondary"
                onPress={() => copyWhatsappMessage(ticket)}
              />
            </Card>
          );
        })}

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
  name: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
  meta: {
    color: theme.colors.textSoft,
    marginTop: 3,
  },
  feedback: {
    color: theme.colors.success,
    fontWeight: "700",
    marginTop: theme.spacing.sm,
  },
  pickerLabel: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: 13,
    marginTop: theme.spacing.sm,
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
    paddingVertical: 7,
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
  pillTextActive: {
    color: "#fff",
  },
});

export default RetiradaScreen;
