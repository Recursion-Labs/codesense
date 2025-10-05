
import * as assert from 'assert';
import { parseJavaScript, parseCSS, parseHTML } from '../parsers';

suite('Parser Test Suite', () => {
    suite('JavaScript Parser', () => {
        test('should identify basic Web APIs', async () => {
            const code = `
                fetch('https://api.example.com/data');
                localStorage.setItem('user', 'test');
                navigator.clipboard.writeText('hello');
            `;
            const features = await parseJavaScript(code, 'test.js');
            const apis = features.map(f => f.api);
            assert.ok(apis.includes('fetch'), 'Did not find fetch');
            assert.ok(apis.includes('localStorage'), 'Did not find localStorage');
            assert.ok(apis.includes('navigator-clipboard'), 'Did not find navigator.clipboard');
        });

        test('should handle JSX/TSX syntax', async () => {
            const code = `
                import React from 'react';
                const MyComponent = () => <div>Hello World</div>;
            `;
            const features = await parseJavaScript(code, 'test.tsx');
            assert.strictEqual(features.length, 0, 'Should not find any features in JSX');
        });

        test('should not crash on invalid JavaScript', async () => {
            const code = `
                const x =;
            `;
            const features = await parseJavaScript(code, 'test.js');
            assert.strictEqual(features.length, 0);

        });
    });

    suite('CSS Parser', () => {
        test('should identify standard CSS properties', async () => {
            const css = `
                .grid {
                    display: grid;
                    gap: 1rem;
                }
            `;
            const features = await parseCSS(css, 'test.css');
            const apis = features.map(f => f.api);
            assert.ok(apis.includes('css-property-display'), 'Did not find display property');
            assert.ok(apis.includes('css-property-gap'), 'Did not find gap property');
        });

        test('should identify CSS functions', async () => {
            const css = `
                .container {
                    width: clamp(300px, 50%, 600px);
                }
            `;
            const features = await parseCSS(css, 'test.css');
            const apis = features.map(f => f.api);
            assert.ok(apis.includes('css-function-clamp'), 'Did not find clamp() function');
        });

        test('should handle invalid CSS', async () => {
            const css = `
                .invalid {
                    color: ;
                    background: linear-gradient(to right, red, blue;
                }
            `;
            const features = await parseCSS(css, 'test.css');
            assert.strictEqual(features.length, 0);
        });
    });

    suite('HTML Parser', () => {
        test('should identify modern HTML elements', async () => {
            const html = `
                <dialog open>
                    <p>Greetings, one and all!</p>
                </dialog>
                <details>
                    <summary>Details</summary>
                    Something small enough to escape casual notice.
                </details>
            `;
            const features = await parseHTML(html, 'test.html');
            const apis = features.map(f => f.api);
            assert.ok(apis.includes('html-element-dialog'), 'Did not find <dialog> element');
            assert.ok(apis.includes('html-element-details'), 'Did not find <details> element');
            assert.ok(apis.includes('html-element-summary'), 'Did not find <summary> element');
        });

        test('should identify modern HTML attributes', async () => {
            const html = `
                <img src="image.jpg" loading="lazy">
                <div contenteditable></div>
            `;
            const features = await parseHTML(html, 'test.html');
            const apis = features.map(f => f.api);
            assert.ok(apis.includes('html-attribute-loading'), 'Did not find loading attribute');
            assert.ok(apis.includes('html-attribute-contenteditable'), 'Did not find contenteditable attribute');
        });
    });
});

