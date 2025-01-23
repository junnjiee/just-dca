import { z } from "zod";

import {
  DcaReturnsQueryInputSchema,
  DcaReturnsQueryOutputSchema,
} from "@/schemas/financial-queries";

export type DcaReturnsQueryInput = z.infer<typeof DcaReturnsQueryInputSchema>;
export type DcaReturnsQueryOutput = z.infer<typeof DcaReturnsQueryOutputSchema>;

export type StockInfoQueryInput = string;
