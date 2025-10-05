
import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

suite('CLI Test Suite', () => {
    const testDir = path.join(__dirname, 'cli-test-project');
    const cliPath = path.join(__dirname, '../../dist/cli.js');

    suiteSetup(() => {
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir);
        }
        fs.writeFileSync(path.join(testDir, 'test.js'), 'fetch("https://example.com");');
        fs.writeFileSync(path.join(testDir, 'test.css'), '.foo { gap: 1rem; }');
    });

    suiteTeardown(() => {
        fs.rmSync(testDir, { recursive: true, force: true });
    });

    test('should run the CLI and generate a report', (done) => {
        exec(`node ${cliPath} --path ${testDir} --format json`, (error, stdout, stderr) => {
            if (error) {
                return done(error);
            }
            assert.ok(stdout.includes('Report generated'), 'CLI should output report generated message');
            const reportPath = path.join(testDir, 'CodeSense-report.json');
            assert.ok(fs.existsSync(reportPath), 'Report file should exist');
            done();
        });
    }).timeout(10000);
});
