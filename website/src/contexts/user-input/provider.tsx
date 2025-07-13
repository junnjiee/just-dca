import { useReducer } from "react";
import { UserInputContext, UserInputDispatchContext } from "./context";

import { userInputReducer } from "@/lib/reducers";
import { createDate } from "@/lib/utils";

const defaultUserInput = {
  ticker: "AMZN",
  contri: 100,
  start: createDate(59),
  end: createDate(0),
};

type UserInputProviderProps = {
  children: React.ReactNode;
};

export function UserInputProvider({ children }: UserInputProviderProps) {
  const [userInput, userInputDispatch] = useReducer(
    userInputReducer,
    defaultUserInput,
  );

  return (
    <UserInputContext.Provider value={userInput}>
      <UserInputDispatchContext.Provider value={userInputDispatch}>
        {children}
      </UserInputDispatchContext.Provider>
    </UserInputContext.Provider>
  );
}
