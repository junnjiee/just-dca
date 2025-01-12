import { queryClient } from "@/queries/config";
import { QueryClientProvider } from "@tanstack/react-query";

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
