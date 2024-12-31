"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type AppProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient({ defaultOptions: {} });

export function AppProvider({ children }: AppProviderProps) {
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
