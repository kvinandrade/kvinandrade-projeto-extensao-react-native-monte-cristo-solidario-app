import { addMinutes, formatHourMinute, getPreviousWeekRange, getWeekKey, getWeekStart } from "../utils/dateUtils";
import { normalizeText } from "../utils/formatters";

const toDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateInput = (value) => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const shuffle = (list) => {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Counter para garantir IDs únicos sem colisões
let ticketIdCounter = 0;
const resetTicketIdCounter = () => { ticketIdCounter = 0; };
const generateUniqueTicketId = (dateKey) => {
  ticketIdCounter += 1;
  return `ticket-${dateKey}-${ticketIdCounter}`;
};

export const retiradaService = {
  toDateKey,

  generateWeeklyList(familias, { startHour = "08:00", targetDate, interval = 5, period = "manha", afternoonHour = "13:00" } = {}) {
    const referenceDate = parseDateInput(targetDate);
    if (!referenceDate) {
      return { ok: false, message: "Data inválida. Use o formato AAAA-MM-DD." };
    }

    const makeStart = (hhmm) => {
      const [h, m] = String(hhmm).split(":").map((v) => Number(v || 0));
      const d = new Date(referenceDate);
      d.setHours(h, m, 0, 0);
      return d;
    };

    const morningStart = makeStart(startHour);
    const afternoonStart = makeStart(afternoonHour);

    const activeFamilies = familias.filter((f) => f.status === "ativo");
    if (!activeFamilies || activeFamilies.length === 0) {
      return { ok: false, message: "Nenhuma família ativa para gerar lista." };
    }
    const randomFamilies = shuffle(activeFamilies);

    const dateKey = toDateKey(referenceDate);
    const weekKey = getWeekKey(referenceDate);
    resetTicketIdCounter();

    const makeTicket = (family, index, baseStart, periodo, senhaOffset = 0) => {
      const scheduleDate = addMinutes(baseStart, index * interval);
      return {
        id: generateUniqueTicketId(dateKey),
        familyId: family.id,
        ordem: senhaOffset + index + 1,
        senha: senhaOffset + index + 1,
        horario: formatHourMinute(scheduleDate),
        weekKey,
        dateKey,
        periodo,
        retiradaRealizada: false,
        retiradaAt: null,
      };
    };

    let tickets;
    if (period === "ambos") {
      const half = Math.ceil(randomFamilies.length / 2);
      const morningFamilies = randomFamilies.slice(0, half);
      const afternoonFamilies = randomFamilies.slice(half);
      const morningTickets = morningFamilies.map((f, i) => makeTicket(f, i, morningStart, "manha", 0));
      const afternoonTickets = afternoonFamilies.map((f, i) => makeTicket(f, i, afternoonStart, "tarde", morningTickets.length));
      tickets = [...morningTickets, ...afternoonTickets];
    } else {
      const baseStart = period === "tarde" ? afternoonStart : morningStart;
      tickets = randomFamilies.map((f, i) => makeTicket(f, i, baseStart, period, 0));
    }

    return {
      ok: true,
      tickets,
      dateKey,
      weekKey,
      referenceDate: referenceDate.toISOString(),
    };
  },

  searchTickets(tickets, familias, query) {
    const term = normalizeText(query);
    if (!term) return tickets;

    return tickets.filter((ticket) => {
      const family = familias.find((f) => f.id === ticket.familyId);
      if (!family) return false;
      const byName = normalizeText(family.nome).includes(term);
      const byCpf = String(family.cpf).replace(/\D/g, "").includes(term.replace(/\D/g, ""));
      const bySenha = String(ticket.senha) === term;
      return byName || byCpf || bySenha;
    });
  },

  markWithdrawal(tickets, familyId, ticketId) {
    const targetTicket = tickets.find((item) => item.id === ticketId);
    if (!targetTicket) {
      return { ok: false, message: "Senha não encontrada." };
    }

    const weekKey = targetTicket.weekKey;
    const already = tickets.some(
      (ticket) =>
        ticket.id !== ticketId &&
        ticket.familyId === familyId &&
        ticket.weekKey === weekKey &&
        ticket.retiradaRealizada
    );

    if (already) {
      return { ok: false, message: "Família já realizou retirada nesta semana." };
    }

    const nextTickets = tickets.map((ticket) =>
      ticket.id === ticketId
        ? {
            ...ticket,
            retiradaRealizada: true,
            retiradaAt: new Date().toISOString(),
          }
        : ticket
    );

    return { ok: true, tickets: nextTickets };
  },

  getWeeklySummary(tickets, familias) {
    const currentWeekKey = getWeekKey(new Date());
    const weekTickets = tickets.filter((ticket) => ticket.weekKey === currentWeekKey);

    const retiraram = weekTickets.filter((ticket) => ticket.retiradaRealizada).length;
    const naoRetiraram = weekTickets.length - retiraram;

    return {
      retiraram,
      naoRetiraram,
      emFila: weekTickets.filter((ticket) => !ticket.retiradaRealizada).length,
      totalSemana: weekTickets.length,
      familiasAtivas: familias.filter((f) => f.status === "ativo").length,
      familiasInativas: familias.filter((f) => f.status === "inativo").length,
    };
  },

  compareWithPreviousWeek(tickets) {
    const currentWeek = getWeekKey(new Date());
    const current = tickets.filter((t) => t.weekKey === currentWeek);

    const range = getPreviousWeekRange();
    const previous = tickets.filter((ticket) => {
      const date = new Date(ticket.retiradaAt || Date.now());
      return date >= range.start && date <= range.end;
    });

    const currentServed = current.filter((t) => t.retiradaRealizada).length;
    const previousServed = previous.filter((t) => t.retiradaRealizada).length;

    if (!previousServed) {
      return {
        currentServed,
        previousServed,
        variationPercent: currentServed > 0 ? 100 : 0,
      };
    }

    const variationPercent = ((currentServed - previousServed) / previousServed) * 100;
    return { currentServed, previousServed, variationPercent };
  },

  buildWhatsappMessage(item, familyName, maskedCpf) {
    return (
      `Segue sua senha para retirada de alimentos.\n` +
      `Senha: ${item.senha} | Horário: ${item.horario}\n` +
      `Família: ${familyName} (${maskedCpf})\n` +
      `Respeite o horário.\n` +
      `Caso outra pessoa retire por você, não será possível retirar novamente.`
    );
  },

  buildListMessage(tickets, familias, { targetDate, startHour, nomeApp = "Monte Cristo Solidário" } = {}) {
    const dateLabel = (() => {
      if (!targetDate) return "—";
      const [year, month, day] = String(targetDate).split("-");
      return `${day}/${month}`;
    })();

    const header = [
      `📋 *Lista de Retirada - ${nomeApp}*`,
      ``,
      `📅 Data: ${dateLabel}`,
      `📍 Local: Monte Cristo`,
      `⏰ Início: ${startHour || "08:00"}`,
      ``,
      `━━━━━━━━━━━━━━━`,
    ].join("\n");

    const body = tickets
      .map((ticket) => {
        const family = familias.find((f) => f.id === ticket.familyId);
        const nome = family ? family.nome : "Família";
        const cpfFinal = family ? String(family.cpf || "").replace(/\D/g, "").slice(-2) : "--";
        const senhaStr = String(ticket.senha).padStart(2, "0");
        return [
          `*Senha ${senhaStr} - ${ticket.horario}*`,
          nome,
          `CPF final: ${cpfFinal}`,
        ].join("\n");
      })
      .join("\n\n");

    const footer = [
      `━━━━━━━━━━━━━━━`,
      ``,
      `⚠️ *IMPORTANTE*`,
      `- Respeite seu horário`,
      `- Chegue com antecedência`,
      `- Caso outra pessoa retire por você, informe no momento`,
      `- Não será possível retirar duas vezes`,
      ``,
      `💚 Obrigado pela colaboração!`,
    ].join("\n");

    return [header, body, footer].filter(Boolean).join("\n\n");
  },
};
