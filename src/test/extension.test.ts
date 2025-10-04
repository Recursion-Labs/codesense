import * as assert from 'assert';
import * as vscode from 'vscode';
import { CompatibilityScanner } from '../scanner';
import { baselineCheck } from '../baseline';
import { ReportGenerator } from '../report';

suite('CodeSense Extension Test Suite', () => {
	vscode.window.showInformationMessage('Starting CodeSense tests...');

	test('Baseline check for fetch API', async () => {
		const status = await baselineCheck('fetch');
		assert.ok(status !== "❓ Unknown", 'Fetch API should have known baseline status');
	});

	test('Scanner initialization', () => {
		const scanner = new CompatibilityScanner();
		assert.ok(scanner, 'Scanner should initialize successfully');
	});

	test('Report generator initialization', () => {
		const generator = new ReportGenerator();
		assert.ok(generator, 'Report generator should initialize successfully');
	});

	test('Baseline check for modern API', async () => {
		const status = await baselineCheck('intersection-observer');
		assert.ok(['✅ Widely available', '⚠️ Newly available', '❌ Limited'].includes(status), 
			'IntersectionObserver should have valid baseline status');
	});

	test('Baseline check for unknown API', async () => {
		const status = await baselineCheck('nonexistent-api-12345');
		assert.strictEqual(status, "❓ Unknown", 'Unknown API should return Unknown status');
	});
});
