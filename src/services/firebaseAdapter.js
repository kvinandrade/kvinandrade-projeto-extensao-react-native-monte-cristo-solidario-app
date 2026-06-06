import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  push,
  remove,
  onValue,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAovI08YSOYPCtwBvrkEEUfW30KBj_gthc",
  authDomain: "monte-cristo-solidario.firebaseapp.com",
  databaseURL: "https://monte-cristo-solidario-default-rtdb.firebaseio.com",
  projectId: "monte-cristo-solidario",
  storageBucket: "monte-cristo-solidario.firebasestorage.app",
  messagingSenderId: "289679319167",
  appId: "1:289679319167:web:19efce68b4551545441f4a",
};

let firebaseApp = null;
let database = null;
let auth = null;
let isEnabled = false;

const initFirebase = () => {
  try {
    if (!firebaseApp) {
      firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    }
    auth = getAuth(firebaseApp);
    database = getDatabase(firebaseApp);
    isEnabled = true;
    return true;
  } catch (error) {
    console.error("Firebase initialization error:", error);
    isEnabled = false;
    return false;
  }
};

const authenticateFirebase = async (email, password) => {
  if (!isEnabled) initFirebase();
  if (!auth) return false;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    if (error?.code === "auth/user-not-found" || error?.code === "auth/invalid-credential") {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        return true;
      } catch (createError) {
        if (createError?.code === "auth/email-already-in-use") {
          await signInWithEmailAndPassword(auth, email, password);
          return true;
        }
        console.error("Firebase create user error:", createError);
        return false;
      }
    }
    console.error("Firebase auth error:", error);
    return false;
  }
};

const logoutFirebase = async () => {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.warn("Firebase logout error:", error);
  }
};

const ensureUserProfile = async (appUser) => {
  if (!isEnabled || !auth?.currentUser || !appUser) return false;
  try {
    const uid = auth.currentUser.uid;
    await set(ref(database, `users/${uid}`), {
      id: appUser.id,
      nome: appUser.nome,
      email: appUser.email,
      role: appUser.role,
      permissions: appUser.permissions || {},
      ativo: appUser.ativo !== false,
    });
    return true;
  } catch (error) {
    console.warn("Erro ao sincronizar perfil no Firebase:", error);
    return false;
  }
};

const testConnection = async () => {
  if (!isEnabled) initFirebase();
  if (!database) return false;
  try {
    await get(ref(database, "config"));
    return true;
  } catch (error) {
    console.warn("Firebase indisponível:", error?.message || error);
    return false;
  }
};

export const firebaseAdapter = {
  isEnabled: false,

  init: initFirebase,
  authenticate: authenticateFirebase,
  logout: logoutFirebase,
  ensureUserProfile,
  testConnection,

  // Users
  async setUser(userId, userData) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    await set(ref(database, `users/${userId}`), userData);
  },

  async getUser(userId) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    const snapshot = await get(ref(database, `users/${userId}`));
    return snapshot.val();
  },

  async getAllUsers() {
    if (!isEnabled) throw new Error("Firebase not initialized");
    const snapshot = await get(ref(database, "users"));
    return snapshot.val() || {};
  },

  async updateUser(userId, updates) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    await update(ref(database, `users/${userId}`), updates);
  },

  // Families
  async addFamily(familyData) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    if (familyData?.id) {
      await set(ref(database, `families/${familyData.id}`), familyData);
      return familyData.id;
    }
    const newFamilyRef = push(ref(database, "families"));
    await set(newFamilyRef, { ...familyData, id: newFamilyRef.key });
    return newFamilyRef.key;
  },

  async getFamily(familyId) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    const snapshot = await get(ref(database, `families/${familyId}`));
    return snapshot.val();
  },

  async getAllFamilies() {
    if (!isEnabled) throw new Error("Firebase not initialized");
    const snapshot = await get(ref(database, "families"));
    return snapshot.val() || {};
  },

  async deleteAllFamilies() {
    if (!isEnabled) throw new Error("Firebase not initialized");
    await remove(ref(database, "families"));
  },

  async wipeOperationalData(emptyWeekEntry) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    await Promise.all([
      remove(ref(database, "families")),
      remove(ref(database, "tickets")),
      remove(ref(database, "losses")),
      remove(ref(database, "foods")),
      emptyWeekEntry
        ? set(ref(database, "foodWeeklyEntries"), { [emptyWeekEntry.id]: emptyWeekEntry })
        : remove(ref(database, "foodWeeklyEntries")),
    ]);
  },

  async updateFamily(familyId, updates) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    await update(ref(database, `families/${familyId}`), updates);
  },

  async deleteFamily(familyId) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    await remove(ref(database, `families/${familyId}`));
  },

  // Tickets/Withdrawals
  async addTicket(ticketData) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    if (ticketData?.id) {
      await set(ref(database, `tickets/${ticketData.id}`), ticketData);
      return ticketData.id;
    }
    const newTicketRef = push(ref(database, "tickets"));
    await set(newTicketRef, { ...ticketData, id: newTicketRef.key });
    return newTicketRef.key;
  },

  async getTicketsByWeek(weekKey) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    const snapshot = await get(ref(database, "tickets"));
    const allTickets = snapshot.val() || {};
    return Object.values(allTickets).filter((t) => t.weekKey === weekKey);
  },

  async getAllTickets() {
    if (!isEnabled) throw new Error("Firebase not initialized");
    const snapshot = await get(ref(database, "tickets"));
    return snapshot.val() || {};
  },

  async updateTicket(ticketId, updates) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    await update(ref(database, `tickets/${ticketId}`), updates);
  },

  async deleteTicket(ticketId) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    await remove(ref(database, `tickets/${ticketId}`));
  },

  async deleteTickets(dateKey) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    const snapshot = await get(ref(database, "tickets"));
    const allTickets = snapshot.val() || {};
    for (const [key, ticket] of Object.entries(allTickets)) {
      if (ticket.dateKey === dateKey) {
        await remove(ref(database, `tickets/${key}`));
      }
    }
  },

  // Foods/Alimentos
  async addFood(foodData) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    if (foodData?.id) {
      await set(ref(database, `foods/${foodData.id}`), foodData);
      return foodData.id;
    }
    const newFoodRef = push(ref(database, "foods"));
    await set(newFoodRef, { ...foodData, id: newFoodRef.key });
    return newFoodRef.key;
  },

  async getAllFoods() {
    if (!isEnabled) throw new Error("Firebase not initialized");
    const snapshot = await get(ref(database, "foods"));
    return snapshot.val() || {};
  },

  async updateFood(foodId, updates) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    await update(ref(database, `foods/${foodId}`), updates);
  },

  async deleteFood(foodId) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    await remove(ref(database, `foods/${foodId}`));
  },

  async setFoodWeeklyEntries(entries) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    const normalized = Array.isArray(entries) ? entries : [];
    const asMap = normalized.reduce((acc, entry) => {
      if (!entry?.id) return acc;
      acc[entry.id] = entry;
      return acc;
    }, {});
    await set(ref(database, "foodWeeklyEntries"), asMap);
  },

  // Losses/Perdas
  async addLoss(lossData) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    if (lossData?.id) {
      await set(ref(database, `losses/${lossData.id}`), lossData);
      return lossData.id;
    }
    const newLossRef = push(ref(database, "losses"));
    await set(newLossRef, { ...lossData, id: newLossRef.key });
    return newLossRef.key;
  },

  async getAllLosses() {
    if (!isEnabled) throw new Error("Firebase not initialized");
    const snapshot = await get(ref(database, "losses"));
    return snapshot.val() || {};
  },

  async deleteLoss(lossId) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    await remove(ref(database, `losses/${lossId}`));
  },

  // Config
  async setConfig(configData) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    await set(ref(database, "config"), configData);
  },

  async getConfig() {
    if (!isEnabled) throw new Error("Firebase not initialized");
    const snapshot = await get(ref(database, "config"));
    return snapshot.val();
  },

  async seedInitialData(initialData) {
    if (!isEnabled || !initialData) return;
    try {
      const snapshot = await get(ref(database, "config"));
      const hasConfig = !!snapshot.val();

      if (!hasConfig) {
        await set(ref(database, "config"), initialData.config || {});
      }

      const familiesSnapshot = await get(ref(database, "families"));
      if (!familiesSnapshot.val() && initialData.families) {
        await set(ref(database, "families"), initialData.families);
      }
    } catch (error) {
      console.warn("Erro ao fazer seed do Firebase:", error);
    }
  },

  // Sync all data once
  async syncAllData() {
    if (!isEnabled) throw new Error("Firebase not initialized");
    const snapshot = await get(ref(database));
    return snapshot.val() || {};
  },

  subscribeToRoot(onChange) {
    if (!isEnabled) throw new Error("Firebase not initialized");
    const rootRef = ref(database);
    const unsubscribe = onValue(rootRef, (snapshot) => {
      onChange(snapshot.val() || {});
    });
    return () => unsubscribe();
  },
};
