import * as esbuild from "esbuild";

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: "esbuild-problem-matcher",

	setup(build) {
		build.onStart(() => {
			console.log("[watch] build started");
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				if (location) {
					console.error(`    ${location.file}:${location.line}:${location.column}:`);
				}
			});
			console.log("[watch] build finished");
		});
	},
};

async function main() {
	// Build extension
	const extensionCtx = await esbuild.context({
		entryPoints: ["src/extension.ts"],
		bundle: true,
		format: "cjs",
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: "node",
		outfile: "dist/extension.js",
		external: ["vscode"],
		logLevel: "silent",
		plugins: [esbuildProblemMatcherPlugin],
	});

	// Build CLI
	const cliCtx = await esbuild.context({
		entryPoints: ["src/cli.ts"],
		bundle: true,
		format: "cjs",
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: "node",
		outfile: "dist/cli.js",
		banner: {
			js: "#!/usr/bin/env node",
		},
		external: ["chokidar"],
		logLevel: "silent",
		plugins: [esbuildProblemMatcherPlugin],
	});

	if (watch) {
		await Promise.all([extensionCtx.watch(), cliCtx.watch()]);
	} else {
		await Promise.all([extensionCtx.rebuild(), cliCtx.rebuild()]);
		await Promise.all([extensionCtx.dispose(), cliCtx.dispose()]);
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
