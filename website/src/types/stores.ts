import { DcaReturnsQueryInput } from "@/types/financial-queries";

export type UserInputStoreState = DcaReturnsQueryInput;

export type UserInputStoreActions = {
  update: (newUserInput: UserInputStoreState) => void;
  updateDates: (start: string, end: string) => void;
};
