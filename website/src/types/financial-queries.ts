import { z } from 'zod';

import {
  DcaReturnsQueryInputSchema,
  DcaReturnsQueryOutputSchema,
  StockInfoQueryOutputSchema,
} from '@/schemas/financial-queries';

export type DcaReturnsQueryInput = z.infer<typeof DcaReturnsQueryInputSchema>;
export type DcaReturnsQueryOutput = z.infer<typeof DcaReturnsQueryOutputSchema>;

export type StockInfoQueryInput = string;
export type StockInfoQueryOutput = z.infer<typeof StockInfoQueryOutputSchema>;
