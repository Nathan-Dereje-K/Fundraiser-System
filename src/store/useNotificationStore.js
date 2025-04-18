// src/store/useNotificationStore.js
import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (message, type, campaignId, campaignName) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: Date.now(), message, type, campaignId, campaignName },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((note) => note.id !== id),
    })),
}));

export default useNotificationStore;