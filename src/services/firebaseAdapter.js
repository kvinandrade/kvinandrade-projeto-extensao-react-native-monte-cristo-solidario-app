import { initializeApp } from "firebase/app";
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
let isEnabled = false;

const initFirebase = () => {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    database = getDatabase(firebaseApp);
    isEnabled = true;
    console.log("Firebase initialized successfully");
    return true;
  } catch (error) {
    console.error("Firebase initialization error:", error);
    isEnabled = false;
    return false;
  }
};

export const firebaseAdapter = {
  isEnabled: false,
  
  init: initFirebase,

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
    if (!isEnabled) return;
    try {
      const snapshot = await get(ref(database, 'families'));
      const currentFamilies = snapshot.val() || {};
      const familyCount = Object.keys(currentFamilies).length;
      
      // Se não tem famílias no Firebase, faz seed
      if (familyCount === 0 && initialData) {
        await set(ref(database), initialData);
        console.log('Firebase seeded with initial data');
      }
    } catch (error) {
      console.warn('Erro ao fazer seed do Firebase:', error);
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
