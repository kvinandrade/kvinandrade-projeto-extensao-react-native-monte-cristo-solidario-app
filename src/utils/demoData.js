import { initialFamilies } from "../services/mockDatabase";

const DEMO_FAMILY_IDS = new Set(initialFamilies.map((family) => family.id));

export const isDemoFamily = (family) => DEMO_FAMILY_IDS.has(family?.id);

export const stripDemoOperationalData = (snapshot = {}) => {
  const families = Object.values(snapshot.familias || snapshot.families || {}).filter(
    (family) => !isDemoFamily(family)
  );
  const familyIds = new Set(families.map((family) => family.id));

  const tickets = Object.values(snapshot.ticketsSemana || snapshot.tickets || {}).filter(
    (ticket) => !DEMO_FAMILY_IDS.has(ticket.familyId)
  );

  const perdas = Object.values(snapshot.perdas || snapshot.losses || {}).filter(
    (loss) => loss.id !== "loss1"
  );

  const foodWeeklyEntries = Object.values(snapshot.foodWeeklyEntries || {}).filter(
    (entry) => entry.id !== "food-week-initial"
  );

  return {
    config: snapshot.config,
    familias: families,
    families,
    ticketsSemana: tickets,
    tickets,
    perdas,
    losses: perdas,
    foodWeeklyEntries,
  };
};
