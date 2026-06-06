import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import { initialUsers } from "../src/services/mockDatabase.js";

const masterUser = initialUsers.find((user) => user.role === "MASTER");

const firebaseConfig = {
  apiKey: "AIzaSyAovI08YSOYPCtwBvrkEEUfW30KBj_gthc",
  authDomain: "monte-cristo-solidario.firebaseapp.com",
  databaseURL: "https://monte-cristo-solidario-default-rtdb.firebaseio.com",
  projectId: "monte-cristo-solidario",
  storageBucket: "monte-cristo-solidario.firebasestorage.app",
  messagingSenderId: "289679319167",
  appId: "1:289679319167:web:19efce68b4551545441f4a",
};

const EMAIL = masterUser?.email || "master@montecristo.org";
const PASSWORD = masterUser?.senha || "CozinhaMae2026!";

const initialConfig = {
  nomeApp: "Monte Cristo Solidário",
  logoUrl:
    "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&w=300&q=80",
  vagasTotais: 50,
  bairrosPermitidos: ["Monte Cristo"],
};

const now = new Date();
const monday = new Date(now);
const day = monday.getDay();
monday.setDate(monday.getDate() - day + (day === 0 ? -6 : 1));
const y = monday.getFullYear();
const m = String(monday.getMonth() + 1).padStart(2, "0");
const d = String(monday.getDate()).padStart(2, "0");
const weekNum = Math.ceil(
  ((monday - new Date(y, 0, 1)) / 86400000 + new Date(y, 0, 1).getDay() + 1) / 7
);

const emptyWeekEntry = {
  id: "food-week-prod",
  weekKey: `${y}-W${String(weekNum).padStart(2, "0")}`,
  startDate: `${y}-${m}-${d}`,
  createdAt: new Date().toISOString(),
  foods: [],
  archivedAt: null,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function ensureAuth() {
  try {
    await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
    console.log("Login Firebase OK");
  } catch (error) {
    if (
      error?.code === "auth/user-not-found" ||
      error?.code === "auth/invalid-credential" ||
      error?.code === "auth/wrong-password"
    ) {
      await createUserWithEmailAndPassword(auth, EMAIL, PASSWORD);
      console.log("Usuário Firebase criado");
      return;
    }
    throw error;
  }
}

await ensureAuth();

const db = getDatabase(app);
let current = {};
try {
  const snapshot = await get(ref(db, "config"));
  current.config = snapshot.val() || initialConfig;
} catch {
  current.config = initialConfig;
}

const pathsToClear = ["families", "tickets", "losses", "foods"];
for (const path of pathsToClear) {
  try {
    await set(ref(db, path), {});
    console.log(`Zerado: ${path}`);
  } catch (error) {
    console.warn(`Falha ao zerar ${path}:`, error?.message || error);
  }
}

try {
  await set(ref(db, "foodWeeklyEntries"), { [emptyWeekEntry.id]: emptyWeekEntry });
  console.log("Zerado: foodWeeklyEntries");
} catch (error) {
  console.warn("Falha ao zerar foodWeeklyEntries:", error?.message || error);
}

try {
  await set(ref(db, "config"), current.config || initialConfig);
  console.log("Config mantida");
} catch (error) {
  console.warn("Falha ao salvar config:", error?.message || error);
}

console.log("Concluído. Se algum nó falhou, publique as regras abertas no Firebase Console e rode de novo.");
process.exit(0);
