

import * as fs from "fs";
import * as path from "path";
import { CompatibilityScanner, ScanOptions } from "./scanner";
import { ReportGenerator, ReportOptions } from "./report";
import { PolyfillManager } from "./polyfill";
import type { CLIOptions, PolyfillConfig } from "./@types/interface";

class CodeSenseCLI {
    private options: CLIOptions;
    private scanner: CompatibilityScanner;
    private reportGenerator: ReportGenerator;
    private polyfillManager: PolyfillManager;

    constructor(options: CLIOptions = {}) {
        this.options = this.loadConfig(options);
        
        const scanOptions: ScanOptions = {
            excludePatterns: this.options.exclude || ['node_modules/**', 'dist/**', 'build/**', '.git/**'],
            includePatterns: this.options.include,
            baselineLevel: this.options.baseline || 'newly'
        };

        const polyfillConfig: PolyfillConfig = {
            strategy: this.options.polyfillStrategy || 'manual'
        };

        this.scanner = new CompatibilityScanner(scanOptions);
        this.reportGenerator = new ReportGenerator();
        this.polyfillManager = new PolyfillManager(polyfillConfig);
    }

    async run(): Promise<void> {
        const projectPath = this.options.path || process.cwd();
        
        if (!fs.existsSync(projectPath)) {
            console.error(`❌ Path does not exist: ${projectPath}`);
            process.exit(1);
        }

        console.log(`🔍 Scanning ${projectPath} for baseline compatibility...`);
        
        try {
            const startTime = Date.now();
            const results = await this.scanner.scanProject(projectPath);
            const scanTime = Date.now() - startTime;

            if (this.options.verbose) {
                console.log(`✅ Scan completed in ${scanTime}ms`);
                console.log(`📁 Files scanned: ${results.length}`);
                console.log(`🔍 Issues found: ${results.reduce((sum, r) => sum + r.issues.length, 0)}`);
            }

            // Generate report
            const reportOptions: ReportOptions = {
                format: this.options.format || 'markdown',
                includePolyfillRecommendations: this.options.polyfills,
                sortBy: 'severity'
            };

            const reportPath = await this.reportGenerator.generateReport(results, projectPath, reportOptions);
            console.log(`📊 Report generated: ${reportPath}`);

            // Generate polyfills if requested
            if (this.options.polyfills && this.options.polyfillStrategy !== 'disabled') {
                await this.polyfillManager.injectPolyfills(projectPath, results);
                console.log(`💉 Polyfills generated`);
            }

            // Print summary
            this.printSummary(results);

            // Watch mode
            if (this.options.watch) {
                console.log(`👀 Watching for changes...`);
                this.watchFiles(projectPath);
            }

        } catch (error) {
            console.error(`❌ Error during scan:`, error);
            process.exit(1);
        }
    }

    private loadConfig(cliOptions: CLIOptions): CLIOptions {
        let configOptions: Partial<CLIOptions> = {};

        // Load from config file
        const configPath = cliOptions.config || path.join(process.cwd(), 'CodeSense.config.json');
        if (fs.existsSync(configPath)) {
            try {
                const configFile = fs.readFileSync(configPath, 'utf-8');
                configOptions = JSON.parse(configFile);
                if (this.options?.verbose) {
                    console.log(`📄 Loaded config from ${configPath}`);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to load config from ${configPath}:`, error);
            }
        }

        // CLI options override config file
        return { ...configOptions, ...cliOptions };
    }

    private printSummary(results: any[]): void {
        const allIssues = results.flatMap(r => r.issues);
        const safe = allIssues.filter(i => i.status === "✅ Widely available").length;
        const partial = allIssues.filter(i => i.status === "⚠️ Newly available").length;
        const risky = allIssues.filter(i => i.status === "❌ Limited").length;
        const unknown = allIssues.filter(i => i.status === "❓ Unknown").length;
        const total = allIssues.length;

        const score = total > 0 ? Math.round(((safe + partial * 0.7) / total) * 100) : 100;

        console.log('\n📊 Summary:');
        console.log(`   Compatibility Score: ${score}%`);
        console.log(`   ✅ Widely Available: ${safe}`);
        console.log(`   ⚠️ Newly Available: ${partial}`);
        console.log(`   ❌ Limited Support: ${risky}`);
        console.log(`   ❓ Unknown: ${unknown}`);

        if (risky > 0) {
            console.log(`\n⚠️ Warning: ${risky} features have limited browser support`);
        }
    }

    private watchFiles(projectPath: string): void {
        const chokidar = require('chokidar');
        
        const watcher = chokidar.watch(projectPath, {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true,
            ignoreInitial: true
        });

        let timeout: NodeJS.Timeout;

        const handleChange = () => {
            clearTimeout(timeout);
            timeout = setTimeout(async () => {
                console.log('🔄 Files changed, rescanning...');
                await this.run();
            }, 1000);
        };

        watcher
            .on('add', handleChange)
            .on('change', handleChange)
            .on('unlink', handleChange);
    }
}

// CLI argument parsing
function parseArgs(): CLIOptions {
    const args = process.argv.slice(2);
    const options: CLIOptions = {};

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        const nextArg = args[i + 1];

        switch (arg) {
            case '--path':
            case '-p':
                options.path = nextArg;
                i++;
                break;
            case '--format':
            case '-f':
                options.format = nextArg as any;
                i++;
                break;
            case '--output':
            case '-o':
                options.output = nextArg;
                i++;
                break;
            case '--exclude':
                options.exclude = nextArg.split(',');
                i++;
                break;
            case '--include':
                options.include = nextArg.split(',');
                i++;
                break;
            case '--baseline':
            case '-b':
                options.baseline = nextArg as any;
                i++;
                break;
            case '--polyfills':
                options.polyfills = true;
                break;
            case '--polyfill-strategy':
                options.polyfillStrategy = nextArg as any;
                i++;
                break;
            case '--verbose':
            case '-v':
                options.verbose = true;
                break;
            case '--watch':
            case '-w':
                options.watch = true;
                break;
            case '--config':
            case '-c':
                options.config = nextArg;
                i++;
                break;
            case '--help':
            case '-h':
                printHelp();
                break;
        }
    }

    return options;
}

function printHelp(): void {
    console.log(`
🎯 CodeSense - Baseline Web Compatibility Scanner

Usage: CodeSense [options]

Options:
  -p, --path <path>              Project path to scan (default: current directory)
  -f, --format <format>          Report format: markdown, html, json, csv (default: markdown)
  -o, --output <path>            Output file path
  --exclude <patterns>           Comma-separated exclude patterns
  --include <patterns>           Comma-separated include patterns
  -b, --baseline <level>         Baseline level: widely, newly, all (default: newly)
  --polyfills                    Include polyfill recommendations
  --polyfill-strategy <strategy> Polyfill strategy: auto, manual, disabled (default: manual)
  -v, --verbose                  Verbose output
  -w, --watch                    Watch for file changes
  -c, --config <path>            Config file path (default: CodeSense.config.json)
  -h, --help                     Show this help

Examples:
  CodeSense                                    # Scan current directory
  CodeSense --path ./src --format html        # Scan src directory, generate HTML report
  CodeSense --baseline widely --polyfills     # Strict mode with polyfill recommendations
  CodeSense --watch --verbose                 # Watch mode with verbose output

Config file (CodeSense.config.json):
{
  "baseline": "newly",
  "exclude": ["node_modules/**", "dist/**"],
  "format": "html",
  "polyfills": true,
  "polyfillStrategy": "auto"
}
`);
}

// Main execution
if (require.main === module) {
    const options = parseArgs();
    const cli = new CodeSenseCLI(options);
    cli.run().catch(error => {
        console.error('❌ CLI Error:', error);
        process.exit(1);
    });
}

export { CodeSenseCLI, CLIOptions };