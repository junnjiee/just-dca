import { createContext, useContext, useReducer } from "react";

import { userInputReducer } from "@/lib/reducers";
import { createDate } from "@/lib/utils";

import { UserInputReducerAction } from "@/types/reducers";
import { DcaReturnsQueryInput } from "@/types/financial-queries";

const defaultUserInput = {
  ticker: "VOO",
  contri: 50,
  start: createDate(12),
  end: createDate(0),
};

const UserInputContext = createContext<DcaReturnsQueryInput | null>(null);
const UserInputDispatchContext =
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

type UserInputProviderProps = {
  children: React.ReactNode;
};

export function UserInputProvider({ children }: UserInputProviderProps) {
  const [userInput, userInputDispatch] = useReducer(
    userInputReducer,
    defaultUserInput
  );

  return (
    <UserInputContext.Provider value={userInput}>
      <UserInputDispatchContext.Provider value={userInputDispatch}>
        {children}
      </UserInputDispatchContext.Provider>
    </UserInputContext.Provider>
  );
}
