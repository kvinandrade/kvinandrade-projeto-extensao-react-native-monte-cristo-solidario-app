import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { alimentoService } from "../services/alimentoService";
import { familiaService } from "../services/familiaService";
import { initialConfig, initialFamilies, initialFoods, initialLosses, initialFoodWeeklyEntries } from "../services/mockDatabase";
import { retiradaService } from "../services/retiradaService";
import { firebaseAdapter } from "../services/firebaseAdapter";
import { foodWeeklyService } from "../services/foodWeeklyService";

const objectValues = (entity) => (Array.isArray(entity) ? entity : Object.values(entity || {}));

const buildHistoricoListas = (tickets) => {
  const grouped = Object.values(tickets || {}).reduce((acc, ticket) => {
    const key = ticket.dateKey || "unknown";
    if (!acc[key]) {
      acc[key] = {
        dateKey: ticket.dateKey,
        weekKey: ticket.weekKey,
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
  const [familias, setFamilias] = useState(familiaService.applyAutoInactive(initialFamilies));
  const [alimentos, setAlimentos] = useState(initialFoods);
  const [foodWeeklyEntries, setFoodWeeklyEntries] = useState(initialFoodWeeklyEntries);
  const [perdas, setPerdas] = useState(initialLosses);
  const [ticketsSemana, setTicketsSemana] = useState([]);
  const [historicoListas, setHistoricoListas] = useState([]);
  const [distributedCount, setDistributedCount] = useState(0);
  const [currentWeekNotified, setCurrentWeekNotified] = useState(false);

  // Get current week foods and archived weeks
  const currentWeekFoods = useMemo(
    () => foodWeeklyService.getCurrentWeekFood(foodWeeklyEntries),
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

  // Check if it's a new week and create new entry if needed
  useEffect(() => {
    const currentWeekKey = foodWeeklyService.getCurrentWeekKey();
    const hasCurrentWeek = foodWeeklyEntries.some(
      (entry) => entry.weekKey === currentWeekKey && !entry.archivedAt
    );

    if (!hasCurrentWeek && !currentWeekNotified) {
      // Archive previous week if exists
      const previousEntry = foodWeeklyEntries.find((e) => !e.archivedAt);
      if (previousEntry) {
        setFoodWeeklyEntries((prev) =>
          prev.map((entry) =>
            entry.weekKey === previousEntry.weekKey
              ? { ...entry, archivedAt: new Date().toISOString() }
              : entry
          )
        );
      }

      // Create new week entry
      const newEntry = foodWeeklyService.createFoodEntryWeek([], currentWeekKey);
      setFoodWeeklyEntries((prev) => [...prev, newEntry]);
      setCurrentWeekNotified(true);
    }
  }, [foodWeeklyEntries, currentWeekNotified]);

  useEffect(() => {
    let unsubscribe = null;

    const initializeFirebase = async () => {
      const ok = firebaseAdapter.init();
      if (!ok) {
        console.warn('Falha ao inicializar Firebase. Usando base local.');
        return;
      }

      // Clear old families and seed with initial data
      try {
        await firebaseAdapter.deleteAllFamilies();
      } catch (e) {
        console.warn('Erro ao limpar famílias antigas:', e);
      }

      const initialDataForSeeding = {
        config: initialConfig,
        families: initialFamilies.reduce((acc, f) => {
          acc[f.id] = f;
          return acc;
        }, {}),
        foods: initialFoods.reduce((acc, f) => {
          acc[f.id] = f;
          return acc;
        }, {}),
        losses: initialLosses.reduce((acc, f) => {
          acc[f.id] = f;
          return acc;
        }, {}),
        tickets: {},
      };
      
      await firebaseAdapter.seedInitialData(initialDataForSeeding);

      unsubscribe = firebaseAdapter.subscribeToRoot((data) => {
        const loadedConfig = data.config || initialConfig;
        const loadedFamilies = objectValues(data.families).map((family) => ({ ...family }));
        const loadedFoods = objectValues(data.foods || data.alimentos).map((food) => ({ ...food }));
        const loadedLosses = objectValues(data.losses || data.perdas).map((loss) => ({ ...loss }));
        const loadedTickets = objectValues(data.tickets).map((ticket) => ({ ...ticket }));

        setConfig(loadedConfig);
        setFamilias(
          loadedFamilies.length > 0
            ? familiaService.applyAutoInactive(loadedFamilies)
            : familiaService.applyAutoInactive(initialFamilies)
        );
        setAlimentos(loadedFoods.length > 0 ? loadedFoods : initialFoods);
        setPerdas(loadedLosses.length > 0 ? loadedLosses : initialLosses);
        setTicketsSemana(loadedTickets);
        setHistoricoListas(buildHistoricoListas(loadedTickets));
      });
    };

    initializeFirebase();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

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

    try {
      if (familyWithId.id && familias.some((family) => family.id === familyWithId.id)) {
        await firebaseAdapter.updateFamily(familyWithId.id, familyWithId);
      } else {
        await firebaseAdapter.addFamily(familyWithId);
      }

      setFamilias((prev) =>
        familiaService.upsert(prev, familyWithId, config.vagasTotais)
      );

      return { ok: true };
    } catch (error) {
      console.error('Erro ao salvar família no Firebase:', error);
      return { ok: false, message: 'Erro ao salvar família no Firebase. Tente novamente.' };
    }
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
    setFamilias((prev) => familiaService.inactivate(prev, familyId));
  };

  const deleteFamily = (familyId) => {
    firebaseAdapter.updateFamily(familyId, {
      status: "excluido",
      excludedAt: new Date().toISOString(),
    }).catch((error) => {
      console.error('Erro ao excluir família no Firebase:', error);
    });
    setFamilias((prev) => familiaService.softDelete(prev, familyId));
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

  const removeFood = (foodId) => {
    const currentWeekKey = foodWeeklyService.getCurrentWeekKey();
    
    setFoodWeeklyEntries((prev) =>
      prev.map((entry) =>
        entry.weekKey === currentWeekKey && !entry.archivedAt
          ? { ...entry, foods: entry.foods.filter((food) => food.id !== foodId) }
          : entry
      )
    );
    
    firebaseAdapter.deleteFood(foodId).catch((error) => {
      console.error('Erro ao remover alimento do Firebase:', error);
    });
  };

  const addLoss = (payload) => {
    const loss = {
      ...payload,
      id: `loss-${Date.now()}`,
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

    firebaseAdapter.deleteTickets(result.dateKey).then(() => {
      return Promise.all(result.tickets.map((ticket) => firebaseAdapter.addTicket(ticket)));
    }).catch((error) => {
      console.error('Erro ao salvar lista no Firebase:', error);
    });

    setTicketsSemana(result.tickets);
    setHistoricoListas((prev) => {
      const nextEntry = {
        dateKey: result.dateKey,
        weekKey: result.weekKey,
        referenceDate: result.referenceDate,
        startHour: options.startHour,
        generatedAt: new Date().toISOString(),
        tickets: result.tickets,
      };
      return [nextEntry, ...prev.filter((item) => item.dateKey !== result.dateKey)];
    });

    return {
      ok: true,
      list: result.tickets,
      dateKey: result.dateKey,
    };
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
              tickets: result.tickets,
            }
          : item
      )
    );
    setDistributedCount((prev) => prev + 1);
    setFamilias((prev) =>
      prev.map((f) =>
        f.id === ticket.familyId
          ? { ...f, lastWithdrawalAt: new Date().toISOString(), status: "ativo" }
          : f
      )
    );

    return { ok: true, message: "Retirada marcada com sucesso." };
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
    const totalAlimentosRecebidos = alimentoService.getTotalRecebido(alimentos);
    const totalPerdas = alimentoService.getTotalPerdido(perdas);
    const perdaSemanalPercent = alimentoService.getWeeklyLossPercent(alimentos, perdas);
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
  }, [alimentos, perdas, familias, config.vagasTotais]);

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
      generateWeeklyTickets,
      markWithdrawal,
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
