import { QueryClient } from "@tanstack/react-query";

const queryConfig = {
  queries: {
    staleTime: 1000 * 60,
    retry: 3,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
