
import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { CompatibilityScanner } from '../scanner.js';

suite('Scanner Test Suite', () => {
    const testDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'scanner-test-project');

    suiteSetup(() => {
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir);
        }
        fs.writeFileSync(path.join(testDir, 'test.js'), 'fetch("https://example.com");');
        fs.writeFileSync(path.join(testDir, 'test.css'), '.foo { gap: 1rem; }');
        fs.mkdirSync(path.join(testDir, 'node_modules'));
        fs.writeFileSync(path.join(testDir, 'node_modules', 'test.js'), '// some code');
    });

    suiteTeardown(() => {
        fs.rmSync(testDir, { recursive: true, force: true });
    });

    test('should discover files to scan, respecting exclude patterns', async () => {
        const scanner = new CompatibilityScanner();
        const results = await scanner.scanProject(testDir);
        assert.strictEqual(results.length, 2, 'Should find 2 files');
        assert.ok(results.some(r => r.filePath.endsWith('test.js')), 'Should find test.js');
        assert.ok(results.some(r => r.filePath.endsWith('test.css')), 'Should find test.css');
    });

    test('should perform an end-to-end scan', async function() {
        this.timeout(5000);
        const scanner = new CompatibilityScanner();
        const results = await scanner.scanProject(testDir);
        assert.strictEqual(results.length, 2, 'Should have results for 2 files');
        const jsResult = results.find(r => r.filePath.endsWith('test.js'));
        assert.ok(jsResult, 'Should have result for test.js');
        assert.strictEqual(jsResult.issues.length, 1, 'Should have 1 issue in test.js');
        assert.strictEqual(jsResult.issues[0].feature, 'fetch', 'The feature should be fetch');

        const cssResult = results.find(r => r.filePath.endsWith('test.css'));
        assert.ok(cssResult, 'Should have result for test.css');
        assert.strictEqual(cssResult.issues.length, 1, 'Should have 1 issue in test.css');
        assert.strictEqual(cssResult.issues[0].feature, 'css-property-gap', 'The feature should be css-property-gap');
    });

    test('should respect baselineLevel option', async () => {
        const scanner = new CompatibilityScanner({ baselineLevel: 'widely' });
        const results = await scanner.scanProject(testDir);
        const cssResult = results.find(r => r.filePath.endsWith('test.css'));
        assert.ok(cssResult, 'Should have result for test.css');
        assert.strictEqual(cssResult.issues.length, 0, 'Should have 0 issues in test.css with baselineLevel widely');
    });
});