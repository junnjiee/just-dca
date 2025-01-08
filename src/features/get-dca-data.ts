import { z } from "zod";
import { useQuery, useQueries } from "@tanstack/react-query";
import { errorSchema, buildUrlWithParamsObj } from "@/lib/api-helpers";

export const dcaDataInputSchema = z.object({
  ticker: z.string().toUpperCase().nonempty("Enter a ticker"),
  contri: z
    .number({
      required_error: "Enter a number",
      invalid_type_error: "Enter a number",
    })
    .positive()
    .multipleOf(0.01, "2 decimal places only (e.g. 0.01)"),
  start: z.string().date().nonempty(),
  end: z.string().date().nonempty(),
});

export type dcaDataInputType = z.infer<typeof dcaDataInputSchema>;

const dcaDataOutputRowSchema = z.object({
  date: z.string(),
  stock_price: z.number().nullable(),
  shares_bought: z.number().nullable(),
  contribution: z.number().nullable(),
  shares_owned: z.number().nullable(),
  total_val: z.number().nullable(),
  profit: z.number().nullable(),
  profitPct: z.number().nullable(),
});

export type dcaDataOutputRowType = z.infer<typeof dcaDataOutputRowSchema>;

export const dcaDataOutputSchema = z.array(dcaDataOutputRowSchema);

export type dcaDataOutputType = z.infer<typeof dcaDataOutputSchema>;

const API_ROUTE = "/api/dca/returns";

async function fetchDcaData(params: dcaDataInputType) {
  const newUrl = buildUrlWithParamsObj(
    `${process.env.NEXT_PUBLIC_URL!}${API_ROUTE}`,
    params
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

    return dcaDataOutputSchema.parse(data);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const useGetDcaData = (params: dcaDataInputType, enabled = true) =>
  useQuery({
    queryKey: [API_ROUTE, params],
    queryFn: () => fetchDcaData(params),
    enabled: enabled,
  });

export const useGetMultipleDcaData = (paramsArr: dcaDataInputType[]) =>
  useQueries({
    queries: paramsArr.map((params) => ({
      queryKey: [API_ROUTE, params],
      queryFn: () => fetchDcaData(params),
    })),
  });
