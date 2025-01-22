import { QueryClient } from '@tanstack/react-query';

const queryConfig = {
  queries: {
    staleTime: 1000 * 60,
    retry: 2,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
