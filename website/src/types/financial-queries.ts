import { z } from "zod";

import {
  DcaReturnsQueryInputSchema,
  DcaReturnsQueryOutputSchema,
  // StockInfoQueryInputSchema,
  StockInfoQueryOutputSchema,
} from "@/schemas/financial-queries";

import { InferArrayType } from "./utils";

export type DcaReturnsQueryInput = z.infer<typeof DcaReturnsQueryInputSchema>;
export type DcaReturnsQueryOutput = z.infer<typeof DcaReturnsQueryOutputSchema>;
export type DcaReturnsQueryOutputRow = InferArrayType<DcaReturnsQueryOutput>;

export type StockInfoQueryInput = string;
export type StockInfoQueryOutput = z.infer<typeof StockInfoQueryOutputSchema>;
