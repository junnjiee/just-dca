export type TickersReducer = (
  state: string[],
  action: { type: string; ticker?: string }
) => string[];
