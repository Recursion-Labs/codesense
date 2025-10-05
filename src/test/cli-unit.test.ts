import * as assert from 'assert';
import * as sinon from 'sinon';
import { CodeSenseCLI } from '../cli.js';
import { CompatibilityScanner } from '../scanner.js';
import { ReportGenerator } from '../report.js';

suite('CLI Unit Test Suite', () => {
    let scannerStub: sinon.SinonStub;
    let reportGeneratorStub: sinon.SinonStub;

    setup(() => {
        scannerStub = sinon.stub(CompatibilityScanner.prototype, 'scanProject').resolves([]);
        reportGeneratorStub = sinon.stub(ReportGenerator.prototype, 'generateReport').resolves('report-path');
    });

    teardown(() => {
        sinon.restore();
    });

    test('should run the scanner and generate a report', async () => {
        const cli = new CodeSenseCLI();
        await cli.run();
        assert.ok(scannerStub.calledOnce, 'scanProject should be called once');
        assert.ok(reportGeneratorStub.calledOnce, 'generateReport should be called once');
    });

    test('should use the path option', async () => {
        const cli = new CodeSenseCLI({ path: '/test/path' });
        await cli.run();
        assert.ok(scannerStub.calledWith('/test/path'), 'scanProject should be called with the correct path');
    });

    test('should use the format option', async () => {
        const cli = new CodeSenseCLI({ format: 'json' });
        await cli.run();
        assert.ok(reportGeneratorStub.calledWith([], process.cwd(), { format: 'json', includePolyfillRecommendations: undefined, sortBy: 'severity' }), 'generateReport should be called with the correct format');
    });
});