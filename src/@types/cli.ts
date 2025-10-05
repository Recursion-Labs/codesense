import { z } from 'zod';

export const CLIOptionsSchema = z.object({
  path: z.string().optional(),
  format: z.enum(['markdown', 'html', 'json', 'csv']).optional(),
  output: z.string().optional(),
  exclude: z.array(z.string()).optional(),
  include: z.array(z.string()).optional(),
  baseline: z.enum(['widely', 'newly', 'all']).optional(),
  polyfills: z.boolean().optional(),
  polyfillStrategy: z.enum(['auto', 'manual', 'disabled']).optional(),
  verbose: z.boolean().optional(),
  watch: z.boolean().optional(),
  config: z.string().optional(),
});
export type CLIOptions = z.infer<typeof CLIOptionsSchema>;


export const ScanOptionsSchema = z.object({
  excludePatterns: z.array(z.string()).optional(),
  includePatterns: z.array(z.string()).optional(),
  baselineLevel: z.enum(['widely', 'newly', 'all']).optional(),
});
export type ScanOptions = z.infer<typeof ScanOptionsSchema>;


export const PolyfillConfigSchema = z.object({
  strategy: z.enum(['auto', 'manual', 'disabled']),
});
export type PolyfillConfig = z.infer<typeof PolyfillConfigSchema>;
