"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryConfig } from "@/lib/react-query";
import { ToastContainer, Zoom } from "react-toastify";

type AppProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient({ defaultOptions: queryConfig });

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer pauseOnFocusLoss={false} transition={Zoom} />
    </QueryClientProvider>
  );
}
