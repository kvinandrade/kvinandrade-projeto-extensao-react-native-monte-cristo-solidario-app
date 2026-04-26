export const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

export const formatHourMinute = (date) =>
  date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

export const getWeekNumber = (date = new Date()) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

export const getWeekKey = (date = new Date()) => {
  return `${date.getFullYear()}-W${String(getWeekNumber(date)).padStart(2, "0")}`;
};

export const isOlderThanDays = (isoDate, days) => {
  if (!isoDate) return true;
  const limit = Date.now() - days * 24 * 60 * 60 * 1000;
  return new Date(isoDate).getTime() < limit;
};

export const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getPreviousWeekRange = () => {
  const thisWeekStart = getWeekStart(new Date());
  const prevStart = new Date(thisWeekStart);
  prevStart.setDate(prevStart.getDate() - 7);
  const prevEnd = new Date(thisWeekStart);
  prevEnd.setMilliseconds(-1);
  return { start: prevStart, end: prevEnd };
};
