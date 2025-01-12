import { create } from "zustand";
import { createDate } from "./utils";

import { UserInputStoreState, UserInputStoreActions } from "@/types/stores";

export const useUserInputStore = create<
  UserInputStoreState & UserInputStoreActions
>((set) => ({
  ticker: "RDDT",
  contri: 50,
  start: createDate(12),
  end: createDate(0),
  update: (newUserInput: UserInputStoreState) => set(newUserInput),
  updateDates: (start: string, end: string) => set({ start: start, end: end }),
}));
