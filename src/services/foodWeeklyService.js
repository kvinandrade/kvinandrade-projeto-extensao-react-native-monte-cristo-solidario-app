// Calculate the start date of current week (Monday)
const weekMonday = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(now.setDate(diff));
};

const dateToKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export const foodWeeklyService = {
  getCurrentWeekKey: () => {
    const monday = weekMonday();
    return dateToKey(monday);
  },

  isNewWeek: (lastWeekKey) => {
    const currentWeekKey = foodWeeklyService.getCurrentWeekKey();
    return lastWeekKey !== currentWeekKey;
  },

  createFoodEntryWeek: (foods, weekKey) => {
    return {
      weekKey,
      startDate: weekKey,
      createdAt: new Date().toISOString(),
      foods: foods || [],
    };
  },

  archiveCurrentWeek: (currentWeekEntry) => {
    return {
      ...currentWeekEntry,
      archivedAt: new Date().toISOString(),
    };
  },

  getCurrentWeekFood: (foodEntries = []) => {
    const currentKey = foodWeeklyService.getCurrentWeekKey();
    const current = foodEntries.find((entry) => entry.weekKey === currentKey && !entry.archivedAt);
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
