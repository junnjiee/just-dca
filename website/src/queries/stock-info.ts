import { useQuery } from "@tanstack/react-query";

import { StockInfoQueryInput } from "@/types/financial-queries";
import { StockInfoQueryOutputSchema } from "@/schemas/financial-queries";
import { FastApiErrorSchema } from "@/schemas/error";

import { buildUrlWithParamsObj } from "@/lib/utils";

const API_ROUTE = "/api/stock/info";

async function fetchStockInfo(ticker: StockInfoQueryInput) {
  const newUrl = buildUrlWithParamsObj(
    `${import.meta.env.VITE_BACKEND_URL!}${API_ROUTE}`,
    { ticker: ticker }
  );
  try {
    const res = await fetch(newUrl);
    const data = await res.json();

    // fetch does not throw error on codes outside of 2xx
    if (!res.ok) {
      const parsedErrorResult = FastApiErrorSchema.safeParse(data);
      if (parsedErrorResult.success) {
        throw new Error(data.detail);
      }
      throw new Error(data);
    }

    return StockInfoQueryOutputSchema.parse(data);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function useGetStockInfo(ticker: StockInfoQueryInput) {
  return useQuery({
    queryKey: [API_ROUTE, ticker],
    queryFn: () => fetchStockInfo(ticker),
  });
}
