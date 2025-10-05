import * as fs from "fs";
import * as path from "path";
import { ScanResult, Issue } from "./scanner";
import { PolyfillManager } from "./polyfill";

export interface ReportOptions {
    format: 'markdown' | 'html' | 'json' | 'csv';
    includePolyfillRecommendations?: boolean;
    includeSummaryChart?: boolean;
    groupByFile?: boolean;
    sortBy?: 'severity' | 'file' | 'api';
}

export interface ReportData {
    summary: {
        totalFiles: number;
        totalIssues: number;
        safe: number;
        partial: number;
        risky: number;
        unknown: number;
        compatibilityScore: number;
    };
    results: ScanResult[];
    polyfillRecommendations?: Array<{
        issue: Issue;
        polyfill?: any;
        recommendation: string;
    }>;
    generatedAt: string;
    projectPath: string;
}

export class ReportGenerator {
    private polyfillManager: PolyfillManager;

    constructor() {
        this.polyfillManager = new PolyfillManager();
    }

    async generateReport(
        results: ScanResult[], 
        folderPath: string, 
        options: ReportOptions = { format: 'markdown' }
    ): Promise<string> {
        const reportData = this.prepareReportData(results, folderPath, options);
        
        switch (options.format) {
            case 'html':
                return this.generateHTMLReport(reportData, folderPath);
            case 'json':
                return this.generateJSONReport(reportData, folderPath);
            case 'csv':
                return this.generateCSVReport(reportData, folderPath);
            case 'markdown':
            default:
                return this.generateMarkdownReport(reportData, folderPath);
        }
    }

    private prepareReportData(results: ScanResult[], folderPath: string, options: ReportOptions): ReportData {
        const allIssues = results.flatMap(r => r.issues);
        
        const safe = allIssues.filter(i => i.status === "✅ Widely available").length;
        const partial = allIssues.filter(i => i.status === "⚠️ Newly available").length;
        const risky = allIssues.filter(i => i.status === "❌ Limited").length;
        const unknown = allIssues.filter(i => i.status === "❓ Unknown").length;
        const total = allIssues.length;

        const compatibilityScore = total > 0 ? Math.round(((safe + partial * 0.7) / total) * 100) : 100;

        const reportData: ReportData = {
            summary: {
                totalFiles: results.length,
                totalIssues: total,
                safe,
                partial,
                risky,
                unknown,
                compatibilityScore
            },
            results: this.sortResults(results, options.sortBy),
            generatedAt: new Date().toISOString(),
            projectPath: folderPath
        };

        if (options.includePolyfillRecommendations) {
            reportData.polyfillRecommendations = this.polyfillManager.getPolyfillRecommendations(allIssues);
        }

        return reportData;
    }

    private generateMarkdownReport(data: ReportData, folderPath: string): string {
        const lines: string[] = [];
        
        // Header
        lines.push("# 🎯 CodeSense - Baseline Compatibility Report");
        lines.push("");
        lines.push(`**Generated:** ${new Date(data.generatedAt).toLocaleString()}`);
        lines.push(`**Project:** ${path.basename(data.projectPath)}`);
        lines.push(`**Compatibility Score:** ${data.summary.compatibilityScore}%`);
        lines.push("");

        // Summary
        lines.push("## 📊 Summary");
        lines.push("");
        lines.push(`- **Files Scanned:** ${data.summary.totalFiles}`);
        lines.push(`- **Total Issues:** ${data.summary.totalIssues}`);
        lines.push(`- ✅ **Widely Available:** ${data.summary.safe} (${this.percentage(data.summary.safe, data.summary.totalIssues)}%)`);
        lines.push(`- ⚠️ **Newly Available:** ${data.summary.partial} (${this.percentage(data.summary.partial, data.summary.totalIssues)}%)`);
        lines.push(`- ❌ **Limited Support:** ${data.summary.risky} (${this.percentage(data.summary.risky, data.summary.totalIssues)}%)`);
        lines.push(`- ❓ **Unknown:** ${data.summary.unknown} (${this.percentage(data.summary.unknown, data.summary.totalIssues)}%)`);
        lines.push("");

        // Compatibility gauge
        lines.push(this.generateCompatibilityGauge(data.summary.compatibilityScore));
        lines.push("");

        // Detailed results
        lines.push("## 🔍 Detailed Results");
        lines.push("");
        lines.push("| File | API | Status | Line | Severity | Context |");
        lines.push("|------|-----|--------|------|----------|---------|");

        data.results.forEach(result => {
            result.issues.forEach(issue => {
                const relativePath = path.relative(folderPath, result.file);
                const line = issue.line ? `L${issue.line}` : '-';
                const context = issue.context ? `\`${issue.context}\`` : '-';
                
                lines.push(`| ${relativePath} | ${issue.api} | ${issue.status} | ${line} | ${issue.severity} | ${context} |`);
            });
        });

        // Polyfill recommendations
        if (data.polyfillRecommendations && data.polyfillRecommendations.length > 0) {
            lines.push("");
            lines.push("## 💉 Polyfill Recommendations");
            lines.push("");
            
            data.polyfillRecommendations.forEach(rec => {
                if (rec.polyfill) {
                    lines.push(`### ${rec.issue.api}`);
                    lines.push(`**Recommendation:** ${rec.recommendation}`);
                    lines.push(`**Package:** \`${rec.polyfill.npmPackage || 'Manual implementation'}\``);
                    lines.push(`**Size:** ~${rec.polyfill.size || 'Unknown'} bytes`);
                    lines.push("");
                }
            });
        }

        // Action items
        lines.push("## 🎯 Action Items");
        lines.push("");
        
        if (data.summary.risky > 0) {
            lines.push("### High Priority");
            lines.push("- Review features with Limited support");
            lines.push("- Consider polyfills or alternative implementations");
            lines.push("- Test thoroughly in target browsers");
            lines.push("");
        }

        if (data.summary.partial > 0) {
            lines.push("### Medium Priority");
            lines.push("- Monitor Newly Available features for wider adoption");
            lines.push("- Consider progressive enhancement strategies");
            lines.push("");
        }

        lines.push("### General");
        lines.push("- Set up automated compatibility monitoring");
        lines.push("- Define browser support policy");
        lines.push("- Consider using CodeSense in your CI/CD pipeline");
        lines.push("");

        const reportPath = path.join(folderPath, "CodeSense-report.md");
        fs.writeFileSync(reportPath, lines.join("\n"), "utf-8");
        return reportPath;
    }

    private generateHTMLReport(data: ReportData, folderPath: string): string {
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeSense Report - ${path.basename(data.projectPath)}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .score { font-size: 3em; font-weight: bold; color: ${data.summary.compatibilityScore >= 80 ? '#22c55e' : data.summary.compatibilityScore >= 60 ? '#f59e0b' : '#ef4444'}; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat { text-align: center; padding: 20px; background: #f8fafc; border-radius: 6px; }
        .stat-value { font-size: 2em; font-weight: bold; }
        .safe { color: #22c55e; }
        .partial { color: #f59e0b; }
        .risky { color: #ef4444; }
        .unknown { color: #6b7280; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 600; }
        .severity-error { color: #ef4444; font-weight: bold; }
        .severity-warning { color: #f59e0b; font-weight: bold; }
        .severity-info { color: #3b82f6; }
        code { background: #f1f5f9; padding: 2px 6px; border-radius: 3px; font-family: 'SF Mono', Monaco, monospace; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 CodeSense Report</h1>
            <div class="score">${data.summary.compatibilityScore}%</div>
            <p>Compatibility Score</p>
            <p><strong>Project:</strong> ${path.basename(data.projectPath)}</p>
            <p><strong>Generated:</strong> ${new Date(data.generatedAt).toLocaleString()}</p>
        </div>

        <div class="summary">
            <div class="stat">
                <div class="stat-value">${data.summary.totalFiles}</div>
                <div>Files Scanned</div>
            </div>
            <div class="stat">
                <div class="stat-value safe">${data.summary.safe}</div>
                <div>Widely Available</div>
            </div>
            <div class="stat">
                <div class="stat-value partial">${data.summary.partial}</div>
                <div>Newly Available</div>
            </div>
            <div class="stat">
                <div class="stat-value risky">${data.summary.risky}</div>
                <div>Limited Support</div>
            </div>
        </div>

        <h2>🔍 Detailed Results</h2>
        <table>
            <thead>
                <tr>
                    <th>File</th>
                    <th>API</th>
                    <th>Status</th>
                    <th>Line</th>
                    <th>Severity</th>
                    <th>Context</th>
                </tr>
            </thead>
            <tbody>
                ${data.results.map(result => 
                    result.issues.map(issue => `
                        <tr>
                            <td>${path.relative(folderPath, result.file)}</td>
                            <td><code>${issue.api}</code></td>
                            <td>${issue.status}</td>
                            <td>${issue.line ? `L${issue.line}` : '-'}</td>
                            <td class="severity-${issue.severity}">${issue.severity}</td>
                            <td>${issue.context ? `<code>${issue.context}</code>` : '-'}</td>
                        </tr>
                    `).join('')
                ).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>`;

        const reportPath = path.join(folderPath, "CodeSense-report.html");
        fs.writeFileSync(reportPath, html, "utf-8");
        return reportPath;
    }

    private generateJSONReport(data: ReportData, folderPath: string): string {
        const reportPath = path.join(folderPath, "CodeSense-report.json");
        fs.writeFileSync(reportPath, JSON.stringify(data, null, 2), "utf-8");
        return reportPath;
    }

    private generateCSVReport(data: ReportData, folderPath: string): string {
        const lines: string[] = [];
        lines.push("File,API,Status,Line,Severity,Context");
        
        data.results.forEach(result => {
            result.issues.forEach(issue => {
                const relativePath = path.relative(folderPath, result.file);
                const line = issue.line || '';
                const context = (issue.context || '').replace(/"/g, '""');
                
                lines.push(`"${relativePath}","${issue.api}","${issue.status}","${line}","${issue.severity}","${context}"`);
            });
        });

        const reportPath = path.join(folderPath, "CodeSense-report.csv");
        fs.writeFileSync(reportPath, lines.join("\n"), "utf-8");
        return reportPath;
    }

    private sortResults(results: ScanResult[], sortBy?: string): ScanResult[] {
        if (!sortBy) {return results;}

        return results.map(result => ({
            ...result,
            issues: result.issues.sort((a, b) => {
                switch (sortBy) {
                    case 'severity':
                        const severityOrder = { error: 0, warning: 1, info: 2 };
                        return severityOrder[a.severity] - severityOrder[b.severity];
                    case 'api':
                        return a.api.localeCompare(b.api);
                    default:
                        return 0;
                }
            })
        })).sort((a, b) => {
            if (sortBy === 'file') {
                return a.file.localeCompare(b.file);
            }
            return 0;
        });
    }

    private percentage(value: number, total: number): string {
        return total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
    }

    private generateCompatibilityGauge(score: number): string {
        const filled = Math.round(score / 5);
        const empty = 20 - filled;
        const gauge = '█'.repeat(filled) + '░'.repeat(empty);
        
        let color = '🔴';
        if (score >= 80) {color = '🟢';}
        else if (score >= 60) {color = '🟡';}
        
        return `${color} **Compatibility:** \`${gauge}\` ${score}%`;
    }
}

// Legacy function for backward compatibility
export async function generateReport(results: ScanResult[], folderPath: string): Promise<string> {
    const generator = new ReportGenerator();
    return generator.generateReport(results, folderPath);
}
