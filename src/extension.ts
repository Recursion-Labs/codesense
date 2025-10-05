import * as vscode from "vscode";
import * as path from "path";
import { CompatibilityScanner, ScanOptions } from "./scanner.js";
import { ReportGenerator, ReportOptions } from "./report.js";
import { getBaselineInfo } from "./baseline.js";
import { PolyfillConfig } from "./@types/cli.js";
import { PolyfillManager } from "./polyfill.js";

let diagnosticCollection: vscode.DiagnosticCollection;
let scanner: CompatibilityScanner;
let reportGenerator: ReportGenerator;
let polyfillManager: PolyfillManager;

export function activate(context: vscode.ExtensionContext) {
    console.log("🚀 CodeSense extension.ts loaded!");
    console.log("✅ CodeSense activating...");
    
    // Check if we're in a test environment
    const isTestEnvironment = process.env.VSCODE_TEST !== undefined;
    console.log(`Test environment: ${isTestEnvironment}`);

    try {
        // Initialize components
        diagnosticCollection = vscode.languages.createDiagnosticCollection('CodeSense');
        console.log("✅ Diagnostic collection created");
        
        scanner = new CompatibilityScanner();
        console.log("✅ Scanner initialized");
        
        reportGenerator = new ReportGenerator();
        console.log("✅ Report generator initialized");
        
        polyfillManager = new PolyfillManager();
        console.log("✅ Polyfill manager initialized");
    } catch (error) {
        console.error('Failed to initialize CodeSense components:', error);
        vscode.window.showErrorMessage('CodeSense: Failed to initialize extension');
        return;
    }

    // Register commands
    const commands = [
        vscode.commands.registerCommand("CodeSense.scanProject", scanProject),
        vscode.commands.registerCommand("CodeSense.scanFile", scanCurrentFile),
        vscode.commands.registerCommand("CodeSense.generateReport", generateCompatibilityReport),
        vscode.commands.registerCommand("CodeSense.injectPolyfills", injectPolyfills),
        vscode.commands.registerCommand("CodeSense.showDashboard", showDashboard)
    ];

    // Register event listeners
    const listeners = [
        vscode.workspace.onDidSaveTextDocument(onDocumentSave),
        vscode.window.onDidChangeActiveTextEditor(onActiveEditorChange),
        vscode.workspace.onDidChangeConfiguration(onConfigurationChange)
    ];

    // Register hover provider for baseline information
    // const hoverProvider = vscode.languages.registerHoverProvider(
    //     ['javascript', 'typescript', 'css', 'html'],
    //     new BaselineHoverProvider()
    // );

    context.subscriptions.push(
        diagnosticCollection,
        // hoverProvider,
        ...commands,
        ...listeners
    );

    // Initial scan if auto-scan is enabled and workspace is open
    // Disabled during testing to avoid hanging
    if (!isTestEnvironment && vscode.workspace.workspaceFolders && getConfiguration().get('autoScan', false)) {
        setTimeout(() => {
            scanProject().catch(err => {
                console.error('Auto-scan failed:', err);
            });
        }, 2000); // Delay 2 seconds to ensure extension is fully activated
    }
    
    console.log('✅ CodeSense activation complete!');
    return Promise.resolve();
}

async function scanProject() {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) {
        vscode.window.showErrorMessage("No workspace open!");
        return;
    }

    const folderPath = folders[0].uri.fsPath;
    const config = getConfiguration();
    
    const scanOptions: ScanOptions = {
        excludePatterns: config.get('excludePatterns', ['node_modules/**', 'dist/**', 'build/**']),
        baselineLevel: config.get('baselineLevel', 'newly')
    };

    try {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Scanning project for baseline compatibility...",
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0, message: "Initializing scan..." });
            
            const scannerWithOptions = new CompatibilityScanner(scanOptions);
            const results = await scannerWithOptions.scanProject(folderPath);
            
            progress.report({ increment: 50, message: "Processing results..." });
            
            // Update diagnostics
            updateDiagnostics(results);
            
            progress.report({ increment: 100, message: "Scan complete!" });
            
            const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
            const riskyIssues = results.reduce((sum, r) => 
                sum + r.issues.filter(i => i.status === "❌ Limited").length, 0);
            
            if (totalIssues === 0) {
                vscode.window.showInformationMessage("🎉 No compatibility issues found!");
            } else {
                const message = `🔍 Found ${totalIssues} compatibility issues (${riskyIssues} high priority)`;
                const action = await vscode.window.showInformationMessage(
                    message, 
                    "View Report", 
                    "Inject Polyfills"
                );
                
                if (action === "View Report") {
                    generateCompatibilityReport();
                } else if (action === "Inject Polyfills") {
                    injectPolyfills();
                }
            }
        });
    } catch (error: any) {
        vscode.window.showErrorMessage(`❌ Scan failed: ${error.message}`);
    }
}

async function scanCurrentFile() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("No active file!");
        return;
    }

    const filePath = editor.document.uri.fsPath;
    
    try {
        const result = await scanner.scanFile(filePath);
        
        // Update diagnostics for current file
        const diagnostics = createDiagnosticsFromIssues(result.issues);
        diagnosticCollection.set(editor.document.uri, diagnostics);
        
        const message = `🔍 Found ${result.issues.length} compatibility issues in current file`;
        vscode.window.showInformationMessage(message);
        
    } catch (error: any) {
        vscode.window.showErrorMessage(`❌ File scan failed: ${error.message}`);
    }
}

async function generateCompatibilityReport() {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) {
        vscode.window.showErrorMessage("No workspace open!");
        return;
    }

    const folderPath = folders[0].uri.fsPath;
    const config = getConfiguration();
    
    try {
        const results = await scanner.scanProject(folderPath);
        
        const reportOptions: ReportOptions = {
            format: 'html', // Always use HTML for VS Code
            includePolyfillRecommendations: true,
            sortBy: 'severity'
        };

        const reportPath = await reportGenerator.generateReport(results, folderPath, reportOptions);
        
        // Open report in VS Code
        const reportUri = vscode.Uri.file(reportPath);
        await vscode.commands.executeCommand('vscode.open', reportUri);
        
        vscode.window.showInformationMessage(`📊 Report generated: ${path.basename(reportPath)}`);
        
    } catch (error: any) {
        vscode.window.showErrorMessage(`❌ Report generation failed: ${error.message}`);
    }
}

async function injectPolyfills() {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) {
        vscode.window.showErrorMessage("No workspace open!");
        return;
    }

    const folderPath = folders[0].uri.fsPath;
    const config = getConfiguration();
    
    const polyfillConfig: PolyfillConfig = {
        strategy: config.get('polyfillStrategy', 'manual')
    };

    try {
        const results = await scanner.scanProject(folderPath);
        const polyfillManagerWithConfig = new PolyfillManager(polyfillConfig);
        
        await polyfillManagerWithConfig.injectPolyfills(folderPath, results);
        
        vscode.window.showInformationMessage("💉 Polyfills injected successfully!");
        
    } catch (error: any) {
        vscode.window.showErrorMessage(`❌ Polyfill injection failed: ${error.message}`);
    }
}

async function showDashboard() {
    // Create and show webview panel for dashboard
    const panel = vscode.window.createWebviewPanel(
        'CodeSenseDashboard',
        'CodeSense Dashboard',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    // Generate dashboard content
    const folders = vscode.workspace.workspaceFolders;
    if (folders) {
        const results = await scanner.scanProject(folders[0].uri.fsPath);
        panel.webview.html = generateDashboardHTML(results);
    }
}

function updateDiagnostics(results: any[]) {
    diagnosticCollection.clear();
    
    results.forEach(result => {
        const diagnostics = createDiagnosticsFromIssues(result.issues);
        const uri = vscode.Uri.file(result.file);
        diagnosticCollection.set(uri, diagnostics);
    });
}

function createDiagnosticsFromIssues(issues: any[]): vscode.Diagnostic[] {
    return issues.map(issue => {
        const line = Math.max(0, (issue.line || 1) - 1);
        const column = Math.max(0, issue.column || 0);
        
        const range = new vscode.Range(
            new vscode.Position(line, column),
            new vscode.Position(line, column + (issue.api?.length || 1))
        );

        const severity = issue.severity === 'error' ? vscode.DiagnosticSeverity.Error :
                        issue.severity === 'warning' ? vscode.DiagnosticSeverity.Warning :
                        vscode.DiagnosticSeverity.Information;

        const diagnostic = new vscode.Diagnostic(
            range,
            `${issue.api}: ${issue.status}`,
            severity
        );

        diagnostic.source = 'CodeSense';
        diagnostic.code = issue.api;
        
        return diagnostic;
    });
}

async function onDocumentSave(document: vscode.TextDocument) {
    const config = getConfiguration();
    if (!config.get('autoScan', true)) {return;}
    
    // Only scan supported file types
    const supportedLanguages = ['javascript', 'typescript', 'css', 'html'];
    if (!supportedLanguages.includes(document.languageId)) {return;}
    
    try {
        const result = await scanner.scanFile(document.uri.fsPath);
        const diagnostics = createDiagnosticsFromIssues(result.issues);
        diagnosticCollection.set(document.uri, diagnostics);
    } catch (error) {
        // Silently fail for auto-scan
    }
}

function onActiveEditorChange(editor: vscode.TextEditor | undefined) {
    // Could implement real-time scanning here
}

function onConfigurationChange(event: vscode.ConfigurationChangeEvent) {
    if (event.affectsConfiguration('CodeSense')) {
        // Reinitialize scanner with new configuration
        const config = getConfiguration();
        const scanOptions: ScanOptions = {
            excludePatterns: config.get('excludePatterns', ['node_modules/**', 'dist/**', 'build/**']),
            baselineLevel: config.get('baselineLevel', 'newly')
        };
        scanner = new CompatibilityScanner(scanOptions);
    }
}

function getConfiguration() {
    return vscode.workspace.getConfiguration('CodeSense');
}

function generateDashboardHTML(results: any[]): string {
    const allIssues = results.flatMap(r => r.issues);
    const safe = allIssues.filter(i => i.status === "✅ Widely available").length;
    const partial = allIssues.filter(i => i.status === "⚠️ Newly available").length;
    const risky = allIssues.filter(i => i.status === "❌ Limited").length;
    const score = allIssues.length > 0 ? Math.round(((safe + partial * 0.7) / allIssues.length) * 100) : 100;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>CodeSense Dashboard</title>
        <style>
            body { font-family: var(--vscode-font-family); padding: 20px; }
            .score { font-size: 3em; text-align: center; margin: 20px 0; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat { text-align: center; }
            .stat-value { font-size: 2em; font-weight: bold; }
            .safe { color: var(--vscode-charts-green); }
            .partial { color: var(--vscode-charts-yellow); }
            .risky { color: var(--vscode-charts-red); }
        </style>
    </head>
    <body>
        <h1>🎯 CodeSense Dashboard</h1>
        <div class="score">Compatibility Score: ${score}%</div>
        <div class="stats">
            <div class="stat">
                <div class="stat-value safe">${safe}</div>
                <div>Widely Available</div>
            </div>
            <div class="stat">
                <div class="stat-value partial">${partial}</div>
                <div>Newly Available</div>
            </div>
            <div class="stat">
                <div class="stat-value risky">${risky}</div>
                <div>Limited Support</div>
            </div>
        </div>
        <p>Total files scanned: ${results.length}</p>
        <p>Total issues found: ${allIssues.length}</p>
    </body>
    </html>`;
}

class BaselineHoverProvider implements vscode.HoverProvider {
    async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Hover | undefined> {
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {return;}

        const word = document.getText(wordRange);
        
        // Check if this looks like a web API
        const webAPIPattern = /^(fetch|navigator|localStorage|sessionStorage|indexedDB|IntersectionObserver|ResizeObserver)$/i;
        if (!webAPIPattern.test(word)) {return;}

        try {
            const baselineInfo = await getBaselineInfo(word.toLowerCase());
            
            const markdown = new vscode.MarkdownString();
            markdown.appendMarkdown(`**${word}** - ${baselineInfo.status}\n\n`);
            
            if (baselineInfo.description) {
                markdown.appendMarkdown(`${baselineInfo.description}\n\n`);
            }
            
            if (baselineInfo.lowDate) {
                markdown.appendMarkdown(`**Baseline since:** ${baselineInfo.lowDate}\n\n`);
            }
            
            if (baselineInfo.spec) {
                markdown.appendMarkdown(`[View Specification](${baselineInfo.spec})`);
            }
            
            return new vscode.Hover(markdown, wordRange);
        } catch (error) {
            return;
        }
    }
}

export function deactivate() {
    console.log("🛑 CodeSense deactivated.");
    diagnosticCollection?.dispose();
}
