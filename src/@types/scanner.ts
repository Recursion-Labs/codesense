import { z } from 'zod';

export const BaselineStatusSchema = z.enum([
  "✅ Widely available",
  "⚠️ Newly available",
  "❌ Limited",
  "❓ Unknown",
]);
export type BaselineStatus = z.infer<typeof BaselineStatusSchema>;

export const IssueSchema = z.object({
  id: z.string().optional(),
  feature: z.string().optional(),
  status: BaselineStatusSchema.optional(),
  line: z.number().optional(),
  column: z.number().optional(),
  context: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
  polyfillAvailable: z.boolean().optional(),
  alternativeApi: z.string().optional(),
  api: z.string().optional(),
  message: z.string().optional(),
});
export type Issue = z.infer<typeof IssueSchema>;

export const ScanResultSchema = z.object({
  filePath: z.string(),
  issues: z.array(IssueSchema),
});
export type ScanResult = z.infer<typeof ScanResultSchema>;


export const BaselineInfoSchema = z.object({
  status: BaselineStatusSchema,
  lowDate: z.string().optional(),
  highDate: z.string().optional(),
  support: z.record(z.string(), z.string()).optional(),
  description: z.string().optional(),
  spec: z.string().optional(),
});
export type BaselineInfo = z.infer<typeof BaselineInfoSchema>;

export interface IssueDetail {
  api: string;
  feature: string;
  status: BaselineStatus;
  message: string;
  context: string;
  severity: 'error' | 'warning' | 'info';
  polyfillAvailable: boolean;
  alternativeApi?: string;
}

export interface FileScanResult {
  file: string;
  fileType: 'js' | 'ts' | 'css' | 'html';
  issues: IssueDetail[];
  summary: {
    totalIssues: number;
    bySeverity: {
      error: number;
      warning: number;
      info: number;
    };
    byStatus: {
      widelyAvailable: number;
      newlyAvailable: number;
      limited: number;
      unknown: number;
    };
  };
}

export interface FeatureInfo {
  description?: string
  spec?: string;
  mdn?: string;
}