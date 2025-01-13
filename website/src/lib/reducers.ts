import { TickersReducer } from "@/types/reducers";

export const tickersReducer: TickersReducer = (state, action) => {
  switch (action.type) {
    case "add": {
      if (action.ticker === undefined)
        throw Error("Ticker field required for case: " + action.type);
      if (state.length < 5) {
        return [...state, action.ticker];
      }
      return [...state.slice(0, 4), action.ticker];
    }

    case "remove": {
      if (action.ticker === undefined)
        throw Error("Ticker field required for case: " + action.type);
      return state.filter((ticker) => ticker !== action.ticker);
    }

    case "clear": {
      return state.slice(0, 1);
    }
    default: {
      throw Error("Unknown action type: " + action.type);
    }
  }
};
