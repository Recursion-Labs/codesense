import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { CompatibilityScanner } from '../scanner';

suite('Extension Commands Test Suite', () => {
    let scannerStub: sinon.SinonStub;

    setup(() => {
        scannerStub = sinon.stub(CompatibilityScanner.prototype, 'scanProject').resolves([]);
    });

    teardown(() => {
        sinon.restore();
    });

    test('should run the scanProject command', async () => {
        await vscode.commands.executeCommand('CodeSense.scanProject');
        assert.ok(scannerStub.calledOnce, 'scanProject should be called once');
    });
});