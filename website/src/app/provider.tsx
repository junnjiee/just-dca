import { queryClient } from "@/queries/config";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}
