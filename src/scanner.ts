import * as fs from "fs";
import * as path from "path";
import { baselineCheck } from "./baseline";

export interface Issue {
    api: string;
    status: string;
}

export interface ScanResult {
    file: string;
    issues: Issue[];
}

export async function runScanner(rootPath: string): Promise<ScanResult[]> {
    const results: ScanResult[] = [];

    async function scanFile(filePath: string) {
        const content = fs.readFileSync(filePath, "utf-8");
        const apis: string[] = [];

        // Extend with more regex rules
        if (/fetch\(/.test(content)) apis.push("fetch");
        if (/localStorage/.test(content)) apis.push("localstorage");
        if (/navigator\.clipboard/.test(content)) apis.push("clipboard");
        if (/indexedDB/.test(content)) apis.push("indexeddb");

        const issues = await Promise.all(
            apis.map(async (api) => ({
                api,
                status: await baselineCheck(api),
            }))
        );

        if (issues.length > 0) results.push({ file: filePath, issues });
    }

    async function walk(dir: string) {
        for (const file of fs.readdirSync(dir)) {
            const full = path.join(dir, file);
            const stat = fs.statSync(full);
            if (stat.isDirectory()) {
                await walk(full);
            } else if (/\.(js|ts|jsx|tsx)$/.test(file)) {
                await scanFile(full);
            }
        }
    }

    await walk(rootPath);
    return results;
}
