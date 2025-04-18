import { create } from "zustand";

const useStore = create((set) => ({
  isVideoPlaying: false,
  setVideoPlaying: (isPlaying) => set({ isVideoPlaying: isPlaying }),
}));

export default useStore;