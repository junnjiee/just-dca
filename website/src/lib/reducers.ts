import {
  TickersReducerState,
  TickersReducerAction,
  UserInputReducerState,
  UserInputReducerAction,
} from '@/types/reducers';

export const tickersReducer = (
  state: TickersReducerState,
  action: TickersReducerAction,
) => {
  switch (action.type) {
    case 'add': {
      if (state.length < 5) {
        return [...state, action.ticker];
      }
      return [...state.slice(0, 4), action.ticker];
    }

    case 'remove': {
      return state.filter((ticker) => ticker !== action.ticker);
    }

    case 'clear': {
      return state.slice(0, 1);
    }
  }
};

export const userInputReducer = (
  state: UserInputReducerState,
  action: UserInputReducerAction,
) => {
  switch (action.type) {
    case 'update': {
      return action.input;
    }
    case 'updateDates': {
      return { ...state, start: action.dates.start, end: action.dates.end };
    }
  }
};
