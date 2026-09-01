import { filterParams } from "@/types/filter";
import { create } from "zustand";

export interface MediaFilterStore {
  filter: filterParams;
  setFilter: (filter: filterParams) => void;
}

export const useMediaFilterStore = create<MediaFilterStore>()((set) => ({
  filter: "movie",

  setFilter: (filter) => set({ filter }),
}));
