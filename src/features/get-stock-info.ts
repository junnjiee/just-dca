import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import { errorSchema, buildUrlWithParamsObj } from "@/lib/api-helpers";

export const stockInfoInputSchema = z.string();

export type stockInfoInputType = z.infer<typeof stockInfoInputSchema>;

export const stockInfoOutputSchema = z.object({
  longName: z.string(),
  currency: z.string(),
  quoteType: z.string(),
  underlyingSymbol: z.string(),
});

const API_ROUTE = "/api/stock/info";

export function useGetStockInfo(stockTicker: stockInfoInputType) {
  return useQuery({
    queryKey: [API_ROUTE, stockTicker],
    queryFn: async () => {
      const newUrl = buildUrlWithParamsObj(
        `${process.env.NEXT_PUBLIC_URL!}${API_ROUTE}`,
        { ticker: stockTicker }
      );
      try {
        const res = await fetch(newUrl);
        const data = await res.json();

        // fetch does not throw error on codes outside of 2xx
        if (!res.ok) {
          const parsedErrorResult = errorSchema.safeParse(data);
          if (parsedErrorResult.success) {
            throw new Error(data.detail);
          }
          throw new Error(data);
        }

        return stockInfoOutputSchema.parse(data);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  });
}
