import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ReportGenerator } from '../report.js';
import { ScanResult } from '../@types/scanner.js';

suite('ReportGenerator Test Suite', () => {
    const testDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'report-test-project');
    const reportGenerator = new ReportGenerator();
    const scanResults: ScanResult[] = [
        {
            filePath: path.join(testDir, 'test.js'),
            issues: [
                {
                    feature: 'fetch',
                    api: 'fetch',
                    status: '✅ Widely available',
                    line: 1,
                    column: 1,
                    context: 'fetch("https://example.com")',
                    severity: 'low',
                    polyfillAvailable: true,
                },
            ],
        },
        {
            filePath: path.join(testDir, 'test.css'),
            issues: [
                {
                    feature: 'css-property-gap',
                    api: 'css-property-gap',
                    status: '⚠️ Newly available',
                    line: 2,
                    column: 5,
                    context: 'gap: 1rem;',
                    severity: 'medium',
                    polyfillAvailable: false,
                },
            ],
        },
    ];

    suiteSetup(() => {
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir);
        }
    });

    suiteTeardown(() => {
        fs.rmSync(testDir, { recursive: true, force: true });
    });

    test('should generate a JSON report', async () => {
        const reportPath = await reportGenerator.generateReport(scanResults, testDir, { format: 'json' });
        assert.ok(fs.existsSync(reportPath), 'JSON report file should exist');
        const reportContent = fs.readFileSync(reportPath, 'utf-8');
        const reportData = JSON.parse(reportContent);
        assert.strictEqual(reportData.summary.totalFiles, 2);
        assert.strictEqual(reportData.summary.totalIssues, 2);
    });

    test('should generate an HTML report', async () => {
        const reportPath = await reportGenerator.generateReport(scanResults, testDir, { format: 'html' });
        assert.ok(fs.existsSync(reportPath), 'HTML report file should exist');
        const reportContent = fs.readFileSync(reportPath, 'utf-8');
        assert.ok(reportContent.includes('<h1>🎯 CodeSense Report</h1>'), 'HTML report should have a title');
        assert.ok(reportContent.includes('<td><code>fetch</code></td>'), 'HTML report should contain fetch issue');
        assert.ok(reportContent.includes('<td><code>css-property-gap</code></td>'), 'HTML report should contain css-property-gap issue');
    });
});