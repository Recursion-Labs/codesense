import { z } from 'zod';

// CLI options as used in src/cli.ts
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

// Scan options passed to CompatibilityScanner in src/cli.ts
export const ScanOptionsSchema = z.object({
  excludePatterns: z.array(z.string()).optional(),
  includePatterns: z.array(z.string()).optional(),
  baselineLevel: z.enum(['widely', 'newly', 'all']).optional(),
});
export type ScanOptions = z.infer<typeof ScanOptionsSchema>;

// Polyfill configuration
export const PolyfillConfigSchema = z.object({
  strategy: z.enum(['auto', 'manual', 'disabled']),
});
export type PolyfillConfig = z.infer<typeof PolyfillConfigSchema>;

// Report options used by ReportGenerator
export const ReportOptionsSchema = z.object({
  format: z.enum(['markdown', 'html', 'json', 'csv']).optional(),
  includePolyfillRecommendations: z.boolean().optional(),
  sortBy: z.string().optional(),
});
export type ReportOptions = z.infer<typeof ReportOptionsSchema>;

// Minimal Issue / Scan Result shapes used in printSummary
export const IssueSchema = z.object({
  id: z.string().optional(),
  feature: z.string().optional(),
  status: z.enum([
    '✅ Widely available',
    '⚠️ Newly available',
    '❌ Limited',
    '❓ Unknown',
  ]).optional(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
  message: z.string().optional(),
});
export type Issue = z.infer<typeof IssueSchema>;

export const ScanResultSchema = z.object({
  filePath: z.string(),
  issues: z.array(IssueSchema),
});
export type ScanResult = z.infer<typeof ScanResultSchema>;
