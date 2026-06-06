import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@monte_cristo_app_data_v1";
const VERSION_KEY = "@monte_cristo_app_data_version";
export const APP_DATA_VERSION = 2;

export const localDataStore = {
  async migrateIfNeeded() {
    try {
      const current = Number((await AsyncStorage.getItem(VERSION_KEY)) || 0);
      if (current >= APP_DATA_VERSION) return false;
      await AsyncStorage.multiRemove([STORAGE_KEY, VERSION_KEY]);
      await AsyncStorage.setItem(VERSION_KEY, String(APP_DATA_VERSION));
      return true;
    } catch (error) {
      console.warn("Erro na migração de dados locais:", error);
      return false;
    }
  },

  async load() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Erro ao carregar dados locais:", error);
      return null;
    }
  },

  async save(data) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Erro ao salvar dados locais:", error);
    }
  },

  async clear() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Erro ao limpar dados locais:", error);
    }
  },
};
