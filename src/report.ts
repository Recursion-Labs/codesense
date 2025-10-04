import * as fs from "fs";
import * as path from "path";
import { ScanResult } from "./scanner";

export async function generateReport(results: ScanResult[], folderPath: string): Promise<string> {
    const lines: string[] = [];
    let safe = 0, partial = 0, risky = 0;

    lines.push("# 📊 CodeSense Report\n");
    lines.push("| File | API | Baseline |");
    lines.push("|------|-----|-----------|");

    results.forEach(r => {
        r.issues.forEach(issue => {
            lines.push(`| ${path.relative(folderPath, r.file)} | ${issue.api} | ${issue.status} |`);
            if (issue.status.includes("Widely")) safe++;
            else if (issue.status.includes("Newly")) partial++;
            else if (issue.status.includes("Limited")) risky++;
        });
    });

    const total = safe + partial + risky;
    lines.push("\n## 📈 Summary");
    lines.push(`- ✅ Safe: ${safe} (${((safe/total)*100).toFixed(1)}%)`);
    lines.push(`- ⚠️ Partial: ${partial} (${((partial/total)*100).toFixed(1)}%)`);
    lines.push(`- ❌ Not Baseline: ${risky} (${((risky/total)*100).toFixed(1)}%)`);

    const reportPath = path.join(folderPath, "codesense-report.md");
    fs.writeFileSync(reportPath, lines.join("\n"), "utf-8");
    return reportPath;
}
