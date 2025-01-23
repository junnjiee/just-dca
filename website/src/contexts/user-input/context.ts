import { createContext, useContext } from "react";

import { UserInputReducerAction } from "@/types/reducers";
import { DcaReturnsQueryInput } from "@/types/financial-queries";

export const UserInputContext = createContext<DcaReturnsQueryInput | null>(
  null,
);
export const UserInputDispatchContext =
  createContext<React.Dispatch<UserInputReducerAction> | null>(null);

export function useUserInput() {
  const context = useContext(UserInputContext);
  if (context === null) throw Error("context is null");
  return context;
}

export function useUserInputDispatch() {
  const context = useContext(UserInputDispatchContext);
  if (context === null) throw Error("context is null");
  return context;
}
