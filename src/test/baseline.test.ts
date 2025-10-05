import * as assert from 'assert';
import { getBaselineInfo, baselineCheck } from '../baseline';

suite('Baseline Test Suite', () => {
    test('should return Widely available for fetch', async () => {
        const info = await getBaselineInfo('fetch');
        assert.strictEqual(info.status, '✅ Widely available');
    });

    test('should return Newly available for css-property-gap', async () => {
        const info = await getBaselineInfo('css-property-gap');
        assert.strictEqual(info.status, '⚠️ Newly available');
    });

    test('should return Unknown for non-existent-feature', async () => {
        const info = await getBaselineInfo('non-existent-feature');
        assert.strictEqual(info.status, '❓ Unknown');
    });

    test('baselineCheck should return the status string', async () => {
        const status = await baselineCheck('fetch');
        assert.strictEqual(status, '✅ Widely available');
    });
});