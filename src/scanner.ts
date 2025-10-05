import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import { baselineCheck } from "./baseline";
import { parseJavaScript, parseCSS, parseHTML } from "./parsers";
import { BaselineStatus, Issue, ScanResult } from "./@types/scanner";


export interface ScanOptions {
    excludePatterns?: string[];
    includePatterns?: string[];
    baselineLevel?: 'widely' | 'newly' | 'all';
    maxDepth?: number;
}

export class CompatibilityScanner {
    private options: ScanOptions;

    constructor(options: ScanOptions = {}) {
        this.options = {
            excludePatterns: ['node_modules/**', 'dist/**', 'build/**', '.git/**'],
            includePatterns: ['**/*.{js,ts,jsx,tsx,css,html}'],
            baselineLevel: 'newly',
            maxDepth: 10,
            ...options
        };
    }

    async scanProject(rootPath: string): Promise<ScanResult[]> {
        const results: ScanResult[] = [];
        const files = await this.getFilesToScan(rootPath);

        for (const filePath of files) {
            try {
                const result = await this.scanFile(filePath);
                if (result.issues.length > 0) {
                    results.push(result);
                }
            } catch (error) {
                console.warn(`Failed to scan ${filePath}:`, error);
            }
        }

        return results;
    }

    async scanFile(filePath: string): Promise<ScanResult> {
        const content = fs.readFileSync(filePath, "utf-8");
        const fileType = this.getFileType(filePath);
        let features: Array<{api: string, line?: number, column?: number, context?: string}> = [];

        switch (fileType) {
            case 'js':
            case 'ts':
                features = await parseJavaScript(content, filePath);
                break;
            case 'css':
                features = await parseCSS(content, filePath);
                break;
            case 'html':
                features = await parseHTML(content, filePath);
                break;
        }

        const issues: Issue[] = [];
        
        for (const feature of features) {
            const status = await baselineCheck(feature.api);
            const severity = this.getSeverity(status);
            
            if (this.shouldReport(status)) {
                issues.push({
                    feature: feature.api,
                    status,
                    line: feature.line,
                    column: feature.column,
                    context: feature.context,
                    severity,
                    polyfillAvailable: await this.checkPolyfillAvailability(feature.api),
                    alternativeApi: await this.getAlternativeApi(feature.api)
                });
            }
        }

        const summary = this.calculateSummary(issues);

        return {
            filePath: filePath,
            issues,
        };
    }

    private async getFilesToScan(rootPath: string): Promise<string[]> {
        const patterns = this.options.includePatterns || ['**/*.{js,ts,jsx,tsx,css,html}'];
        const allFiles: string[] = [];

        for (const pattern of patterns) {
            const files = await glob(pattern, {
                cwd: rootPath,
                absolute: true,
                ignore: this.options.excludePatterns
            });
            allFiles.push(...files);
        }

        return [...new Set(allFiles)]; // Remove duplicates
    }

    private getFileType(filePath: string): 'js' | 'ts' | 'css' | 'html' {
        const ext = path.extname(filePath).toLowerCase();
        if (['.js', '.jsx'].includes(ext)) {return 'js';}
        if (['.ts', '.tsx'].includes(ext)) {return 'ts';}
        if (ext === '.css') {return 'css';}
        if (['.html', '.htm'].includes(ext)) {return 'html';}
        return 'js'; // default
    }

    private getSeverity(status: BaselineStatus): 'high' | 'medium' | 'low' | undefined {
        if (status === "❌ Limited") {return 'high';}
        if (status === "⚠️ Newly available") {return 'medium';}
        if (status === "✅ Widely available") {return 'low';}
        return undefined;
    }

    private shouldReport(status: BaselineStatus): boolean {
        const level = this.options.baselineLevel || 'newly';
        
        if (level === 'all') {return true;}
        if (level === 'newly') {return status !== "✅ Widely available";}
        if (level === 'widely') {return status === "❌ Limited";}
        
        return true;
    }

    private calculateSummary(issues: Issue[]) {
        const safe = issues.filter(i => i.status === "✅ Widely available").length;
        const partial = issues.filter(i => i.status === "⚠️ Newly available").length;
        const risky = issues.filter(i => i.status === "❌ Limited").length;
        
        return {
            safe,
            partial,
            risky,
            total: issues.length
        };
    }

    private async checkPolyfillAvailability(api: string): Promise<boolean> {
        // This would check against a polyfill database
        // For now, return true for common APIs that have polyfills
        const polyfillableApis = [
            'fetch', 'promise', 'array-includes', 'object-assign',
            'intersection-observer', 'resize-observer', 'custom-elements'
        ];
        return polyfillableApis.some(p => api.toLowerCase().includes(p));
    }

    private async getAlternativeApi(api: string): Promise<string | undefined> {
        // This would suggest alternative APIs
        const alternatives: Record<string, string> = {
            'fetch': 'XMLHttpRequest',
            'clipboard': 'document.execCommand',
            'intersection-observer': 'scroll event listeners',
            'resize-observer': 'window.resize event'
        };
        
        return alternatives[api.toLowerCase()];
    }
}

// Legacy function for backward compatibility
export async function runScanner(rootPath: string): Promise<ScanResult[]> {
    const scanner = new CompatibilityScanner();
    return scanner.scanProject(rootPath);
}
