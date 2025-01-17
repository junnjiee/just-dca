import { z } from 'zod';

export const FastApiErrorSchema = z.object({
  detail: z.string(),
});
