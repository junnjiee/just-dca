import { createDate } from "@/lib/utils";
import { z } from "zod";

const dateNow = createDate(0);

export const DcaReturnsQueryInputSchema = z
  .object({
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
  })
  .refine((data) => data.end > data.start, {
    message: "End date must be later than start",
    path: ["end"],
  })
  .refine((data) => data.start <= dateNow, {
    message: "Future dates not allowed",
    path: ["start"],
  })
  .refine((data) => data.end <= dateNow, {
    message: "Future dates not allowed",
    path: ["end"],
  });

export const DcaReturnsQueryOutputSchema = z.array(
  z.object({
    padded_row: z.boolean(),
    date: z.string(),
    stock_price: z.number(),
    shares_bought: z.number(),
    contribution: z.number(),
    shares_owned: z.number(),
    total_val: z.number(),
    profit: z.number(),
    profitPct: z.number(),
  }),
);

export const StockInfoQueryOutputSchema = z.object({
  longName: z.string(),
  currency: z.string(),
  quoteType: z.string(),
  // underlyingSymbol: z.string(),
});
