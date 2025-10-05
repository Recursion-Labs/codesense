#!/usr/bin/env node

/**
 * Simple standalone test runner for CodeSense
 * Run with: node simple-test.js
 */

import { baselineCheck } from './out/baseline.js';
import { CompatibilityScanner } from './out/scanner.js';
import { ReportGenerator } from './out/report.js';

console.log('🧪 Starting simple CodeSense tests...\n');

let passCount = 0;
let failCount = 0;

async function test(name, fn) {
    try {
        await fn();
        console.log(`✅ ${name}`);
        passCount++;
    } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error.message}`);
        failCount++;
    }
}

async function runTests() {
    // Test 1: Baseline check for fetch API
    await test('Baseline check returns status for fetch', async () => {
        const status = await baselineCheck('fetch');
        if (!status || status === '❓ Unknown') {
            throw new Error(`Expected known status, got: ${status}`);
        }
    });

    // Test 2: Scanner initialization
    await test('Scanner can be initialized', () => {
        const scanner = new CompatibilityScanner();
        if (!scanner) {
            throw new Error('Scanner failed to initialize');
        }
    });

    // Test 3: Report generator initialization
    await test('ReportGenerator can be initialized', () => {
        const reportGen = new ReportGenerator();
        if (!reportGen) {
            throw new Error('ReportGenerator failed to initialize');
        }
    });

    // Test 4: Baseline check for unknown feature
    await test('Baseline check returns Unknown for non-existent feature', async () => {
        const status = await baselineCheck('totally-fake-api-that-does-not-exist');
        if (status !== '❓ Unknown') {
            throw new Error(`Expected Unknown status, got: ${status}`);
        }
    });

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log('='.repeat(50));

    if (failCount > 0) {
        process.exit(1);
    }
}

runTests().catch(error => {
    console.error('💥 Test runner crashed:', error);
    process.exit(1);
});
