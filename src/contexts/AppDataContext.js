import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { alimentoService } from "../services/alimentoService";
import { familiaService } from "../services/familiaService";
import { initialConfig } from "../services/mockDatabase";
import { retiradaService } from "../services/retiradaService";
import { firebaseAdapter } from "../services/firebaseAdapter";
import { foodWeeklyService } from "../services/foodWeeklyService";
import { localDataStore } from "../services/localDataStore";
import { stripDemoOperationalData } from "../utils/demoData";

const createEmptyFoodWeeklyEntries = () => [
  foodWeeklyService.createFoodEntryWeek([], foodWeeklyService.getCurrentWeekKey()),
];

const objectValues = (entity) => (Array.isArray(entity) ? entity : Object.values(entity || {}));
const getActiveFoodEntry = (entries = []) =>
  [...entries]
    .filter((entry) => !entry.archivedAt)
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))[0] || null;
const upsertTicketsByDate = (allTickets, dateKey, nextDateTickets) => {
  const withoutDate = allTickets.filter((ticket) => ticket.dateKey !== dateKey);
  return [...withoutDate, ...nextDateTickets];
};
const toEntityMap = (list = []) =>
  list.reduce((acc, item) => {
    if (item?.id) acc[item.id] = item;
    return acc;
  }, {});

const buildHistoricoListas = (tickets) => {
  const grouped = Object.values(tickets || {}).reduce((acc, ticket) => {
    const key = ticket.dateKey || "unknown";
    if (!acc[key]) {
      acc[key] = {
        dateKey: ticket.dateKey,
        weekKey: ticket.weekKey,
        foodEntryId: ticket.foodEntryId || null,
        referenceDate: ticket.referenceDate || ticket.dateKey,
        startHour: ticket.startHour || "08:00",
        generatedAt: ticket.generatedAt || ticket.createdAt || new Date().toISOString(),
        tickets: [],
      };
    }
    acc[key].tickets.push(ticket);
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => String(b.dateKey).localeCompare(String(a.dateKey)));
};

export const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [config, setConfig] = useState(initialConfig);
  const [familias, setFamilias] = useState([]);
  const [alimentos, setAlimentos] = useState([]);
  const [foodWeeklyEntries, setFoodWeeklyEntries] = useState(createEmptyFoodWeeklyEntries());
  const [perdas, setPerdas] = useState([]);
  const [ticketsSemana, setTicketsSemana] = useState([]);
  const [historicoListas, setHistoricoListas] = useState([]);
  const [distributedCount, setDistributedCount] = useState(0);
  const [dataReady, setDataReady] = useState(false);

  // Get current week foods and archived weeks
  const currentWeekFoods = useMemo(
    () => (getActiveFoodEntry(foodWeeklyEntries)?.foods || []),
    [foodWeeklyEntries]
  );
  
  const archivedWeeks = useMemo(
    () => foodWeeklyService.getArchivedWeeks(foodWeeklyEntries),
    [foodWeeklyEntries]
  );

  // Sync alimentos state with current week foods
  useEffect(() => {
    setAlimentos(currentWeekFoods);
  }, [currentWeekFoods]);

  useEffect(() => {
    setDistributedCount(ticketsSemana.filter((ticket) => ticket.retiradaRealizada).length);
  }, [ticketsSemana]);

  // Check if it's a new week and create new entry if needed
  useEffect(() => {
    const currentWeekKey = foodWeeklyService.getCurrentWeekKey();
    const activeEntry = getActiveFoodEntry(foodWeeklyEntries);

    if (!activeEntry) {
      const newEntry = foodWeeklyService.createFoodEntryWeek([], currentWeekKey);
      const nextEntries = [...foodWeeklyEntries, newEntry];
      setFoodWeeklyEntries(nextEntries);
      firebaseAdapter.setFoodWeeklyEntries(nextEntries).catch((error) => {
        console.error("Erro ao iniciar entrada semanal no Firebase:", error);
      });
      return;
    }

    if (activeEntry.weekKey !== currentWeekKey) {
      const nextEntries = foodWeeklyEntries.map((entry) =>
        entry.id === activeEntry.id
          ? { ...entry, archivedAt: new Date().toISOString() }
          : entry
      );
      const newEntry = foodWeeklyService.createFoodEntryWeek([], currentWeekKey);
      const merged = [...nextEntries, newEntry];
      setFoodWeeklyEntries(merged);
      firebaseAdapter.setFoodWeeklyEntries(merged).catch((error) => {
        console.error("Erro ao virar semana de alimentos no Firebase:", error);
      });
    }
  }, [foodWeeklyEntries]);

  const applyDataSnapshot = (snapshot = {}) => {
    const cleaned = stripDemoOperationalData(snapshot);
    const loadedConfig = cleaned.config || initialConfig;
    const loadedFamilies = objectValues(cleaned.familias || cleaned.families).map((family) => ({
      ...family,
    }));
    const loadedLosses = objectValues(cleaned.perdas || cleaned.losses).map((loss) => ({ ...loss }));
    const loadedTickets = objectValues(cleaned.ticketsSemana || cleaned.tickets).map((ticket) => ({
      ...ticket,
    }));
    const loadedFoodWeeklyEntries = objectValues(cleaned.foodWeeklyEntries || snapshot.foodWeeklyEntries).map(
      (entry) => ({ ...entry })
    );

    setConfig(loadedConfig);
    setFamilias(familiaService.applyAutoInactive(loadedFamilies));
    setFoodWeeklyEntries(
      loadedFoodWeeklyEntries.length > 0 ? loadedFoodWeeklyEntries : createEmptyFoodWeeklyEntries()
    );
    setPerdas(loadedLosses);
    setTicketsSemana(loadedTickets);
    setHistoricoListas(buildHistoricoListas(loadedTickets));
    setDistributedCount(loadedTickets.filter((ticket) => ticket.retiradaRealizada).length);
  };

  useEffect(() => {
    let unsubscribe = null;
    let active = true;

    const resetLocalData = () => {
      setConfig(initialConfig);
      setFamilias([]);
      setAlimentos([]);
      setFoodWeeklyEntries(createEmptyFoodWeeklyEntries());
      setPerdas([]);
      setTicketsSemana([]);
      setHistoricoListas([]);
      setDistributedCount(0);
      setDataReady(false);
    };

    const initializeData = async () => {
      if (!user?.email || !user?.senha) {
        resetLocalData();
        return;
      }

      const migrated = await localDataStore.migrateIfNeeded();
      const localSnapshot = migrated ? null : await localDataStore.load();
      if (localSnapshot && active) {
        applyDataSnapshot(localSnapshot);
      } else if (active) {
        applyDataSnapshot({});
      }

      const ok = firebaseAdapter.init();
      if (!ok) {
        console.warn("Falha ao inicializar Firebase. Usando dados locais.");
        if (active) setDataReady(true);
        return;
      }

      const authed = await firebaseAdapter.authenticate(user.email, user.senha);
      if (!authed || !active) {
        if (active) setDataReady(true);
        return;
      }

      await firebaseAdapter.ensureUserProfile(user);

      const connected = await firebaseAdapter.testConnection();
      if (!connected || !active) {
        console.warn("Firebase bloqueado. Dados ficam salvos neste celular.");
        if (active) setDataReady(true);
        return;
      }

      const emptyWeekEntry = createEmptyFoodWeeklyEntries()[0];
      const initialDataForSeeding = {
        config: initialConfig,
        families: {},
        foods: {},
        losses: {},
        tickets: {},
        foodWeeklyEntries: {
          [emptyWeekEntry.id]: emptyWeekEntry,
        },
      };

      if (user?.role === "MASTER") {
        try {
          await firebaseAdapter.wipeOperationalData(emptyWeekEntry);
        } catch (wipeError) {
          console.warn("Não foi possível zerar Firebase agora:", wipeError);
        }
      }

      await firebaseAdapter.seedInitialData(initialDataForSeeding);

      unsubscribe = firebaseAdapter.subscribeToRoot((data) => {
        if (!active) return;
        applyDataSnapshot({
          config: data.config,
          families: data.families,
          losses: data.losses,
          tickets: data.tickets,
          foodWeeklyEntries: data.foodWeeklyEntries,
        });
        setDataReady(true);
      });
    };

    initializeData();

    return () => {
      active = false;
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [user]);

  useEffect(() => {
    if (!user || !dataReady) return;

    localDataStore.save({
      config,
      familias,
      foodWeeklyEntries,
      perdas,
      ticketsSemana,
    });
  }, [user, dataReady, config, familias, foodWeeklyEntries, perdas, ticketsSemana]);

  const saveConfig = async ({ nomeApp, logoUrl, vagasTotais, bairrosPermitidos }) => {
    const allowedNeighborhoods = Array.isArray(bairrosPermitidos)
      ? bairrosPermitidos.map((item) => String(item || "").trim()).filter(Boolean)
      : null;

    const nextConfig = {
      ...config,
      nomeApp: nomeApp || config.nomeApp,
      logoUrl: logoUrl || config.logoUrl,
      vagasTotais: Number(vagasTotais || config.vagasTotais),
      bairrosPermitidos: allowedNeighborhoods || config.bairrosPermitidos,
    };

    setConfig(nextConfig);
    try {
      await firebaseAdapter.setConfig(nextConfig);
    } catch (error) {
      console.error('Erro ao salvar configuração no Firebase:', error);
    }
  };

  const saveFamily = async (familyPayload) => {
    const validation = familiaService.validateForSave(
      familias,
      familyPayload,
      config.bairrosPermitidos
    );

    if (!validation.ok) {
      return validation;
    }

    const payload = {
      ...validation.payload,
      createdById: familyPayload.id ? familyPayload.createdById : user?.id,
      createdByName: familyPayload.id
        ? familyPayload.createdByName
        : user?.nome || "Usuário não identificado",
    };

    const familyWithId = {
      ...payload,
      id: payload.id || `f-${Date.now()}`,
    };

    setFamilias((prev) => familiaService.upsert(prev, familyWithId, config.vagasTotais));

    const syncFamily = familyWithId.id && familias.some((family) => family.id === familyWithId.id)
      ? firebaseAdapter.updateFamily(familyWithId.id, familyWithId)
      : firebaseAdapter.addFamily(familyWithId);

    syncFamily.catch((error) => {
      console.error("Erro ao salvar família no Firebase:", error);
    });

    return { ok: true };
  };

  const reactivateFamily = (familyId) => {
    firebaseAdapter.updateFamily(familyId, { status: "ativo" }).catch((error) => {
      console.error('Erro ao reativar família no Firebase:', error);
    });
    setFamilias((prev) => familiaService.reactivate(prev, familyId));
  };

  const inactivateFamily = (familyId) => {
    firebaseAdapter.updateFamily(familyId, { status: "inativo" }).catch((error) => {
      console.error('Erro ao inativar família no Firebase:', error);
    });
    setFamilias((prev) => {
      const next = familiaService.inactivate(prev, familyId);
      const promoted = next.find(
        (family) =>
          family.status === "ativo" &&
          prev.some((oldFamily) => oldFamily.id === family.id && oldFamily.status === "espera")
      );
      if (promoted) {
        firebaseAdapter
          .updateFamily(promoted.id, { status: "ativo", promotedAt: promoted.promotedAt || new Date().toISOString() })
          .catch((error) => {
            console.error("Erro ao promover família da fila no Firebase:", error);
          });
      }
      return next;
    });
  };

  const deleteFamily = (familyId) => {
    firebaseAdapter.updateFamily(familyId, {
      status: "excluido",
      excludedAt: new Date().toISOString(),
    }).catch((error) => {
      console.error('Erro ao excluir família no Firebase:', error);
    });
    setFamilias((prev) => {
      const next = familiaService.softDelete(prev, familyId);
      const promoted = next.find(
        (family) =>
          family.status === "ativo" &&
          prev.some((oldFamily) => oldFamily.id === family.id && oldFamily.status === "espera")
      );
      if (promoted) {
        firebaseAdapter
          .updateFamily(promoted.id, { status: "ativo", promotedAt: promoted.promotedAt || new Date().toISOString() })
          .catch((error) => {
            console.error("Erro ao promover família da fila no Firebase:", error);
          });
      }
      return next;
    });
  };

  const restoreFamily = (familyId) => {
    firebaseAdapter.updateFamily(familyId, { status: "inativo", excludedAt: null }).catch((error) => {
      console.error('Erro ao restaurar família no Firebase:', error);
    });
    setFamilias((prev) => familiaService.restore(prev, familyId));
  };

  const promoteToActive = (familyId) => {
    const updateValues = {
      status: "ativo",
      promotedAt: new Date().toISOString(),
    };
    firebaseAdapter.updateFamily(familyId, updateValues).catch((error) => {
      console.error('Erro ao promover família no Firebase:', error);
    });
    setFamilias((prev) =>
      prev.map((f) =>
        f.id === familyId ? { ...f, ...updateValues } : f
      )
    );
  };

  const addFood = (payload) => {
    const currentWeekKey = foodWeeklyService.getCurrentWeekKey();
    const activeEntry = getActiveFoodEntry(foodWeeklyEntries);
    const foodEntryId = activeEntry?.id || `food-week-${Date.now()}`;
    const newFood = {
      ...alimentoService.addFood([], payload)[0],
      weekKey: currentWeekKey,
      foodEntryId,
    };

    setFoodWeeklyEntries((prev) => {
      const active = getActiveFoodEntry(prev);
      const hasCurrentWeek = Boolean(active);
      let nextEntries = prev;

      if (!hasCurrentWeek) {
        nextEntries = [...prev, foodWeeklyService.createFoodEntryWeek([newFood], currentWeekKey, foodEntryId)];
      } else {
        nextEntries = prev.map((entry) =>
          entry.id === active.id
            ? { ...entry, foods: [newFood, ...(entry.foods || [])] }
            : entry
        );
      }

      firebaseAdapter.setFoodWeeklyEntries(nextEntries).catch((error) => {
        console.error("Erro ao persistir entrada semanal no Firebase:", error);
      });
      return nextEntries;
    });

    firebaseAdapter.addFood(newFood).catch((error) => {
      console.error("Erro ao salvar alimento no Firebase:", error);
    });
  };

  const removeFood = (foodId) => {
    const activeEntry = getActiveFoodEntry(foodWeeklyEntries);
    if (!activeEntry) return;
    
    setFoodWeeklyEntries((prev) => {
      const nextEntries = prev.map((entry) =>
        entry.id === activeEntry.id
          ? { ...entry, foods: entry.foods.filter((food) => food.id !== foodId) }
          : entry
      );
      firebaseAdapter.setFoodWeeklyEntries(nextEntries).catch((error) => {
        console.error("Erro ao atualizar entrada semanal no Firebase:", error);
      });
      return nextEntries;
    });
    
    firebaseAdapter.deleteFood(foodId).catch((error) => {
      console.error('Erro ao remover alimento do Firebase:', error);
    });
  };

  const addLoss = (payload) => {
    const currentWeekKey = foodWeeklyService.getCurrentWeekKey();
    const activeEntry = getActiveFoodEntry(foodWeeklyEntries);
    const loss = {
      ...payload,
      id: `loss-${Date.now()}`,
      weekKey: payload.weekKey || currentWeekKey,
      foodEntryId: payload.foodEntryId || activeEntry?.id || null,
      createdAt: new Date().toISOString(),
    };
    setPerdas((prev) => [loss, ...prev]);
    firebaseAdapter.addLoss(loss).catch((error) => {
      console.error('Erro ao salvar perda no Firebase:', error);
    });
  };

  const generateWeeklyTickets = (options = {}) => {
    const result = retiradaService.generateWeeklyList(familias, options);
    if (!result.ok) return result;
    const activeFoodEntry = getActiveFoodEntry(foodWeeklyEntries);

    firebaseAdapter.deleteTickets(result.dateKey).then(() => {
      return Promise.all(
        result.tickets.map((ticket) =>
          firebaseAdapter.addTicket({
            ...ticket,
            foodEntryId: activeFoodEntry?.id || null,
          })
        )
      );
    }).catch((error) => {
      console.error('Erro ao salvar lista no Firebase:', error);
    });

    const ticketsWithFoodEntry = result.tickets.map((ticket) => ({
      ...ticket,
      foodEntryId: activeFoodEntry?.id || null,
    }));
    setTicketsSemana((prev) => upsertTicketsByDate(prev, result.dateKey, ticketsWithFoodEntry));
    setHistoricoListas((prev) => {
      const nextEntry = {
        dateKey: result.dateKey,
        weekKey: result.weekKey,
        foodEntryId: activeFoodEntry?.id || null,
        referenceDate: result.referenceDate,
        startHour: options.startHour,
        generatedAt: new Date().toISOString(),
        tickets: ticketsWithFoodEntry,
      };
      return [nextEntry, ...prev.filter((item) => item.dateKey !== result.dateKey)];
    });

    return {
      ok: true,
      list: ticketsWithFoodEntry,
      dateKey: result.dateKey,
    };
  };

  const startNewFoodEntry = () => {
    const currentWeekKey = foodWeeklyService.getCurrentWeekKey();
    const newEntryId = `food-week-${Date.now()}`;

    setFoodWeeklyEntries((prev) => {
      const archived = prev.map((entry) =>
        !entry.archivedAt ? { ...entry, archivedAt: new Date().toISOString() } : entry
      );
      const nextEntries = [...archived, foodWeeklyService.createFoodEntryWeek([], currentWeekKey, newEntryId)];
      firebaseAdapter.setFoodWeeklyEntries(nextEntries).catch((error) => {
        console.error("Erro ao iniciar nova entrada semanal no Firebase:", error);
      });
      return nextEntries;
    });
  };

  const markWithdrawal = (ticketId) => {
    const ticket = ticketsSemana.find((item) => item.id === ticketId);
    if (!ticket) return { ok: false, message: "Senha nao encontrada." };

    const result = retiradaService.markWithdrawal(ticketsSemana, ticket.familyId, ticket.id);
    if (!result.ok) return result;

    firebaseAdapter.updateTicket(ticket.id, {
      retiradaRealizada: true,
      retiradaAt: new Date().toISOString(),
    }).catch((error) => {
      console.error('Erro ao marcar retirada no Firebase:', error);
    });

    firebaseAdapter.updateFamily(ticket.familyId, {
      lastWithdrawalAt: new Date().toISOString(),
      status: "ativo",
    }).catch((error) => {
      console.error('Erro ao atualizar família no Firebase:', error);
    });

    setTicketsSemana(result.tickets);
    setHistoricoListas((prev) =>
      prev.map((item) =>
        item.dateKey === ticket.dateKey
          ? {
              ...item,
              tickets: result.tickets.filter((t) => t.dateKey === item.dateKey),
            }
          : item
      )
    );
    setFamilias((prev) =>
      prev.map((f) =>
        f.id === ticket.familyId
          ? { ...f, lastWithdrawalAt: new Date().toISOString(), status: "ativo" }
          : f
      )
    );

    return { ok: true, message: "Retirada marcada com sucesso." };
  };

  const updateTicketSchedule = (ticketId, nextHour) => {
    const ticket = ticketsSemana.find((item) => item.id === ticketId);
    if (!ticket) return { ok: false, message: "Agendamento não encontrado." };

    const nextTickets = ticketsSemana.map((item) =>
      item.id === ticketId ? { ...item, horario: nextHour } : item
    );
    setTicketsSemana(nextTickets);
    setHistoricoListas((prev) =>
      prev.map((entry) =>
        entry.dateKey === ticket.dateKey
          ? { ...entry, tickets: nextTickets.filter((t) => t.dateKey === entry.dateKey) }
          : entry
      )
    );
    firebaseAdapter.updateTicket(ticketId, { horario: nextHour }).catch((error) => {
      console.error("Erro ao atualizar agendamento no Firebase:", error);
    });

    return { ok: true, message: "Agendamento atualizado com sucesso." };
  };

  const deleteTicketSchedule = (ticketId) => {
    const ticket = ticketsSemana.find((item) => item.id === ticketId);
    if (!ticket) return { ok: false, message: "Agendamento não encontrado." };

    const nextTickets = ticketsSemana.filter((item) => item.id !== ticketId);
    setTicketsSemana(nextTickets);
    setHistoricoListas((prev) =>
      prev
        .map((entry) =>
          entry.dateKey === ticket.dateKey
            ? { ...entry, tickets: nextTickets.filter((t) => t.dateKey === entry.dateKey) }
            : entry
        )
        .filter((entry) => entry.tickets.length > 0)
    );
    firebaseAdapter.deleteTicket(ticketId).catch((error) => {
      console.error("Erro ao excluir agendamento no Firebase:", error);
    });

    return { ok: true, message: "Agendamento removido com sucesso." };
  };

  const weeklySummary = useMemo(
    () => retiradaService.getWeeklySummary(ticketsSemana, familias),
    [ticketsSemana, familias]
  );

  const reportComparison = useMemo(
    () => retiradaService.compareWithPreviousWeek(ticketsSemana),
    [ticketsSemana]
  );

  const totals = useMemo(() => {
    const activeEntry = getActiveFoodEntry(foodWeeklyEntries);
    const currentFoods = activeEntry?.foods || [];
    const currentLosses = perdas.filter(
      (loss) => (activeEntry?.id && loss.foodEntryId === activeEntry.id) || (!loss.foodEntryId && !activeEntry?.id)
    );
    const totalAlimentosRecebidos = alimentoService.getTotalRecebido(currentFoods);
    const totalPerdas = alimentoService.getTotalPerdido(currentLosses);
    const perdaSemanalPercent = alimentoService.getWeeklyLossPercent(currentFoods, currentLosses);
    const ativas = familias.filter((f) => f.status === "ativo").length;
    const inativas = familias.filter((f) => f.status === "inativo").length;
    const excluidas = familias.filter((f) => f.status === "excluido").length;
    const emEspera = familias.filter((f) => f.status === "espera").length;
    const vagasDisponiveis = Math.max(0, config.vagasTotais - ativas);

    return {
      totalAlimentosRecebidos,
      totalPerdas,
      perdaSemanalPercent,
      ativas,
      inativas,
      excluidas,
      emEspera,
      vagasDisponiveis,
    };
  }, [foodWeeklyEntries, perdas, familias, config.vagasTotais]);

  const value = useMemo(
    () => ({
      config,
      familias,
      alimentos,
      foodWeeklyEntries,
      perdas,
      ticketsSemana,
      historicoListas,
      distributedCount,
      weeklySummary,
      reportComparison,
      totals,
      saveConfig,
      saveFamily,
      reactivateFamily,
      inactivateFamily,
      deleteFamily,
      restoreFamily,
      promoteToActive,
      addFood,
      removeFood,
      addLoss,
      startNewFoodEntry,
      generateWeeklyTickets,
      markWithdrawal,
      updateTicketSchedule,
      deleteTicketSchedule,
      searchFamilies: (query) => familiaService.search(familias, query),
      searchTickets: (query) => retiradaService.searchTickets(ticketsSemana, familias, query),
      buildWhatsappMessage: retiradaService.buildWhatsappMessage,
    }),
    [
      config,
      familias,
      alimentos,
      foodWeeklyEntries,
      perdas,
      ticketsSemana,
      historicoListas,
      distributedCount,
      weeklySummary,
      reportComparison,
      totals,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};
