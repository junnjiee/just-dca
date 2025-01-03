import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { errorSchema, buildUrlWithParamsObj } from "@/lib/api-helpers";

export const dcaDataInputSchema = z.object({
  ticker: z.string().toUpperCase().nonempty("Enter a ticker"),
  contri: z
    .number({
      required_error: "Enter a number",
      invalid_type_error: "Enter a number",
    })
    .positive(),
  start: z.string().date().nonempty(),
  end: z.string().date().nonempty(),
});

export type dcaDataInputType = z.infer<typeof dcaDataInputSchema>;

export const dcaDataOutputSchema = z.array(
  z.object({
    date: z.string(),
    stock_price: z.number(),
    contribution: z.number(),
    shares_bought: z.number(),
    shares_owned: z.number(),
    total_val: z.number(),
  })
);

const API_ROUTE = "/api/dca/returns";

export function useGetDCAData(params: dcaDataInputType) {
  return useQuery({
    queryKey: [API_ROUTE, params],
    queryFn: async () => {
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
    },
  });
}
