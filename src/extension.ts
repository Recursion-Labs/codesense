import * as vscode from "vscode";
import { runScanner } from "./scanner";
import { generateReport } from "./report";

export function activate(context: vscode.ExtensionContext) {
    console.log("✅ CodeSense activated!");

    const disposable = vscode.commands.registerCommand("codesense.scanProject", async () => {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders) {
            vscode.window.showErrorMessage("No workspace open!");
            return;
        }

        const folderPath = folders[0].uri.fsPath;
        vscode.window.showInformationMessage(`🔍 Scanning ${folderPath}...`);

        try {
            const results = await runScanner(folderPath);
            const reportPath = await generateReport(results, folderPath);
            vscode.window.showInformationMessage(`📊 Report saved at ${reportPath}`);
        } catch (err: any) {
            vscode.window.showErrorMessage(`❌ Error: ${err.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log("🛑 CodeSense deactivated.");
}
