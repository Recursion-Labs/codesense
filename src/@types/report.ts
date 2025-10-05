import { z } from "zod";

export const ReportOptionsSchema = z.object({
  format: z.enum(['markdown', 'html', 'json', 'csv']).optional(),
  includePolyfillRecommendations: z.boolean().optional(),
  sortBy: z.string().optional(),
});
export type ReportOptions = z.infer<typeof ReportOptionsSchema>;
