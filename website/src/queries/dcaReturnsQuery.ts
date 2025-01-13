import { useQuery, useSuspenseQuery, useQueries } from "@tanstack/react-query";

import { DcaReturnsQueryInput } from "@/types/financialQueries";
import { DcaReturnsQueryOutputSchema } from "@/schemas/financialQueries";
import { FastApiErrorSchema } from "@/schemas/error";

import { buildUrlWithParamsObj } from "@/lib/utils";

const API_ROUTE = "/api/dca/returns";

async function fetchDcaReturns(params: DcaReturnsQueryInput) {
  const newUrl = buildUrlWithParamsObj(
    `${import.meta.env.VITE_BACKEND_URL!}${API_ROUTE}`,
    params
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

    return DcaReturnsQueryOutputSchema.parse(data);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const useGetDcaReturns = (params: DcaReturnsQueryInput) =>
  useQuery({
    queryKey: [API_ROUTE, params],
    queryFn: () => fetchDcaReturns(params),
  });

export const useGetMultipleDcaReturns = (paramsArr: DcaReturnsQueryInput[]) =>
  useQueries({
    queries: paramsArr.map((params) => ({
      queryKey: [API_ROUTE, params],
      queryFn: () => fetchDcaReturns(params),
    })),
  });

// EXPERIMENTAL
export const useGetSuspendedDcaReturns = (params: DcaReturnsQueryInput) =>
  useSuspenseQuery({
    queryKey: [API_ROUTE, params],
    queryFn: () => fetchDcaReturns(params),
  });
