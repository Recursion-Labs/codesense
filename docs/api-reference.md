# API Reference

This document provides a technical overview of the CodeSense API, intended for advanced users and contributors who wish to interact with CodeSense programmatically.

## Core Modules

The CodeSense API is composed of several core modules, each responsible for a specific part of the scanning and reporting process.

### `CompatibilityScanner`

The `CompatibilityScanner` class is the main entry point for scanning projects. It orchestrates the process of finding files, parsing them, and checking for web compatibility issues.

**`constructor(options: ScanOptions)`**

Creates a new `CompatibilityScanner` instance.

*   `options`: An optional `ScanOptions` object to customize the scanner's behavior.

**`async scanProject(rootPath: string): Promise<ScanResult[]>`**

Scans an entire project for web compatibility issues.

*   `rootPath`: The absolute path to the project's root directory.
*   Returns: A promise that resolves to an array of `ScanResult` objects.

**`async scanFile(filePath: string): Promise<ScanResult>`**

Scans a single file for web compatibility issues.

*   `filePath`: The absolute path to the file to scan.
*   Returns: A promise that resolves to a `ScanResult` object.

### `ReportGenerator`

The `ReportGenerator` class is responsible for generating reports in various formats.

**`constructor()`**

Creates a new `ReportGenerator` instance.

**`async generateReport(results: ScanResult[], folderPath: string, options: ReportOptions): Promise<string>`**

Generates a report from an array of `ScanResult` objects.

*   `results`: An array of `ScanResult` objects.
*   `folderPath`: The path to the folder where the report will be saved.
*   `options`: A `ReportOptions` object to customize the report's format and content.
*   Returns: A promise that resolves to the path of the generated report.

### `PolyfillManager`

The `PolyfillManager` class handles everything related to polyfills, from recommendations to injection.

**`constructor(config: PolyfillConfig)`**

Creates a new `PolyfillManager` instance.

*   `config`: A `PolyfillConfig` object to configure the polyfill manager.

**`async generatePolyfillBundle(scanResults: ScanResult[]): Promise<string>`**

Generates a polyfill bundle based on the results of a scan.

*   `scanResults`: An array of `ScanResult` objects.
*   Returns: A promise that resolves to the generated polyfill bundle as a string.

**`async injectPolyfills(projectPath: string, scanResults: ScanResult[]): Promise<void>`**

Injects the necessary polyfills into a project.

*   `projectPath`: The absolute path to the project's root directory.
*   `scanResults`: An array of `ScanResult` objects.

### `baselineCheck`

The `baselineCheck` function checks the Baseline status of a given web feature.

**`async baselineCheck(api: string): Promise<BaselineStatus>`**

*   `api`: The name of the web feature to check (e.g., `fetch`, `css-property-grid`).
*   Returns: A promise that resolves to the `BaselineStatus` of the feature.

## Data Structures

### `ScanResult`

An object representing the result of scanning a single file.

*   `file`: The path to the file.
*   `fileType`: The type of the file (`js`, `ts`, `css`, or `html`).
*   `issues`: An array of `Issue` objects found in the file.
*   `summary`: A summary of the issues found in the file.

### `Issue`

An object representing a single web compatibility issue.

*   `api`: The name of the web feature.
*   `status`: The `BaselineStatus` of the feature.
*   `line`: The line number where the issue was found.
*   `column`: The column number where the issue was found.
*   `context`: The code context of the issue.
*   `severity`: The severity of the issue (`error`, `warning`, or `info`).
*   `polyfillAvailable`: Whether a polyfill is available for the feature.
*   `alternativeApi`: An alternative API that can be used instead of the feature.

### `BaselineStatus`

A string representing the Baseline status of a web feature. Can be one of the following values:

*   `"✅ Widely available"`
*   `"⚠️ Newly available"`
*   `"❌ Limited"`
*   `"❓ Unknown"`
