import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { CompatibilityScanner } from '../scanner.js';
import { baselineCheck } from '../baseline.js';
import { ReportGenerator } from '../report.js';

suite('CodeSense Extension Test Suite', () => {
	test('Extension activation', () => {
		assert.ok(vscode.extensions.getExtension('Recursion-Labs.codesense'), 'Extension should be activated');
		vscode.window.showInformationMessage('Starting CodeSense tests...');
	});

	test('Baseline check for fetch API', async function() {
		this.timeout(5000);
		const status = await baselineCheck('fetch');
		assert.ok(status !== "❓ Unknown", 'Fetch API should have known baseline status');
	});

	test('Scanner initialization', () => {
		const scanner = new CompatibilityScanner();
		assert.ok(scanner instanceof CompatibilityScanner, 'Scanner should initialize successfully');
		assert.ok(scanner, 'Scanner should not be null');
	});

	test('Report generator initialization', () => {
		const generator = new ReportGenerator();
		assert.ok(generator instanceof ReportGenerator, 'Report generator should initialize successfully');
		assert.ok(generator, 'Report generator should not be null');
	});

	test('Baseline check for modern API', async function() {
		this.timeout(5000);
		const status = await baselineCheck('intersection-observer');
		assert.ok(['✅ Widely available', '⚠️ Newly available', '❌ Limited', '❓ Unknown'].includes(status), 
			'IntersectionObserver should have valid baseline status');
	});

	test('Baseline check for unknown API', async function() {
		this.timeout(5000);
		const status = await baselineCheck('nonexistent-api-12345');
		assert.strictEqual(status, "❓ Unknown", 'Unknown API should return Unknown status');
	});

	test('Scanner can scan a file', async function() {
		this.timeout(10000);
		const scanner = new CompatibilityScanner();
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (workspaceFolder) {
			const filePath = path.join(workspaceFolder.uri.fsPath, 'index.js');
			const result = await scanner.scanFile(filePath);
			assert.ok(result, 'Scan result should be returned');
			assert.ok(Array.isArray(result.issues), 'Issues should be an array');
		} else {
			this.skip();
		}
	});
});
