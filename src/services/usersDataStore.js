import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@monte_cristo_users_v1";

export const usersDataStore = {
  async load() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Erro ao carregar usuários locais:", error);
      return null;
    }
  },

  async save(users) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.warn("Erro ao salvar usuários locais:", error);
    }
  },
};
