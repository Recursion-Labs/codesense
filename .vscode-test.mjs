import { defineConfig } from '@vscode/test-cli';
import * as path from 'path';

export default defineConfig({
	files: 'out/test/**/*.test.js',
	launchArgs: [
		'--folder-uri', `file://${path.resolve('example')}`,
		'--file', 'index.html',
		'--file', 'index.js'
	]
});
