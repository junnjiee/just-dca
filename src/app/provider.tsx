"use client";

import { ToastContainer, Zoom } from "react-toastify";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer pauseOnFocusLoss={false} transition={Zoom} />
    </QueryClientProvider>
  );
}
