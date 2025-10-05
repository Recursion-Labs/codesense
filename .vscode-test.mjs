import { defineConfig } from '@vscode/test-cli';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	files: 'out/test/**/*.test.js',
	workspaceFolder: path.join(__dirname, 'example'),

	mochaOptions: {
		ui: 'tdd',
		timeout: 10000,
		grep: 'Baseline Test Suite'
	},
	installExtensions: ['ms-vscode.vscode-typescript-next']
});
