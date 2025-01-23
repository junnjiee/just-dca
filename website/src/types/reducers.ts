import { DcaReturnsQueryInput } from "./financial-queries";

export type TickersReducerState = string[];
export type TickersReducerAction =
  | { type: "add"; ticker: string }
  | { type: "remove"; ticker: string }
  | { type: "clear" };

export type UserInputReducerState = DcaReturnsQueryInput;
export type UserInputReducerAction =
  | { type: "update"; input: DcaReturnsQueryInput }
  | { type: "updateDates"; dates: { start: string; end: string } };
