import { getWeekKey, getWeekStart } from "../utils/dateUtils";

// Calculate the start date of current week (Monday)
const weekMonday = () => {
  return getWeekStart(new Date());
};

const dateToKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const foodWeeklyService = {
  getCurrentWeekKey: () => {
    return getWeekKey(new Date());
  },

  isNewWeek: (lastWeekKey) => {
    const currentWeekKey = foodWeeklyService.getCurrentWeekKey();
    return lastWeekKey !== currentWeekKey;
  },

  createFoodEntryWeek: (foods, weekKey, id) => {
    const monday = weekMonday();
    return {
      id: id || `food-week-${Date.now()}`,
      weekKey: weekKey || foodWeeklyService.getCurrentWeekKey(),
      startDate: dateToKey(monday),
      createdAt: new Date().toISOString(),
      foods: foods || [],
      archivedAt: null,
    };
  },

  archiveCurrentWeek: (currentWeekEntry) => {
    return {
      ...currentWeekEntry,
      archivedAt: new Date().toISOString(),
    };
  },

  getCurrentWeekFood: (foodEntries = []) => {
    const current = [...foodEntries]
      .filter((entry) => !entry.archivedAt)
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))[0];
    return current ? current.foods : [];
  },

  getArchivedWeeks: (foodEntries = []) => {
    return foodEntries
      .filter((entry) => entry.archivedAt)
      .map((entry) => ({
        weekKey: entry.weekKey,
        startDate: entry.startDate,
        archivedAt: entry.archivedAt,
        foodCount: (entry.foods || []).length,
        totalItems: (entry.foods || []).reduce((sum, f) => sum + (f.caixasRecebidas * f.itensPorCaixa || 0), 0),
      }))
      .sort((a, b) => String(b.weekKey).localeCompare(String(a.weekKey)));
  },
};
