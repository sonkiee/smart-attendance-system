import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SettingsState {
  biometricsEnabled: boolean;
  pushNotifications: boolean;
  checkInReminders: boolean;
  emailReports: boolean;
  setSetting: (
    key: keyof Omit<SettingsState, "setSetting">,
    value: boolean,
  ) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      biometricsEnabled: false,
      pushNotifications: true,
      checkInReminders: true,
      emailReports: false,

      setSetting: (key, value) => set({ [key]: value }),
    }),
    {
      name: "app-settings-storage", // unique name for storage
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for React Native
    },
  ),
);
