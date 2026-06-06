/**
 * Zera famílias, retiradas e alimentos de demonstração no Firebase.
 * Mantém apenas a configuração da Cozinha Mãe.
 *
 * Uso: node scripts/reset-firebase-producao.mjs
 */
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getWeekKey, getWeekStart } from "../src/utils/dateUtils.js";

const firebaseConfig = {
  apiKey: "AIzaSyAovI08YSOYPCtwBvrkEEUfW30KBj_gthc",
  authDomain: "monte-cristo-solidario.firebaseapp.com",
  databaseURL: "https://monte-cristo-solidario-default-rtdb.firebaseio.com",
  projectId: "monte-cristo-solidario",
  storageBucket: "monte-cristo-solidario.firebasestorage.app",
  messagingSenderId: "289679319167",
  appId: "1:289679319167:web:19efce68b4551545441f4a",
};

const initialConfig = {
  nomeApp: "Monte Cristo Solidário",
  logoUrl:
    "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&w=300&q=80",
  vagasTotais: 50,
  bairrosPermitidos: ["Monte Cristo"],
};

const monday = getWeekStart(new Date());
const y = monday.getFullYear();
const m = String(monday.getMonth() + 1).padStart(2, "0");
const d = String(monday.getDate()).padStart(2, "0");

const emptyWeekEntry = {
  id: "food-week-prod",
  weekKey: getWeekKey(new Date()),
  startDate: `${y}-${m}-${d}`,
  createdAt: new Date().toISOString(),
  foods: [],
  archivedAt: null,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const snapshot = await get(ref(db));
const current = snapshot.val() || {};

await set(ref(db), {
  config: current.config || initialConfig,
  families: {},
  foods: {},
  losses: {},
  tickets: {},
  foodWeeklyEntries: { [emptyWeekEntry.id]: emptyWeekEntry },
});

console.log("Firebase zerado para produção.");
process.exit(0);
