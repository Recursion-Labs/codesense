# Usage

This document provides a comprehensive guide to the various features of CodeSense. Whether you're using the VS Code extension, the CLI, or the ESLint plugin, this guide will help you get the most out of CodeSense.

## VS Code Extension

The VS Code extension provides a rich, interactive experience for working with CodeSense.

### Commands

You can access the CodeSense commands through the Command Palette (`Ctrl+Shift+P`):

*   **`CodeSense: Scan Project`**: Scans your entire project for web compatibility issues.
*   **`CodeSense: Scan Current File`**: Scans only the currently active file.
*   **`CodeSense: Generate Compatibility Report`**: Creates a detailed report in various formats (HTML, JSON, etc.).
*   **`CodeSense: Inject Required Polyfills`**: Analyzes your project and injects the necessary polyfills based on your configuration.
*   **`CodeSense: Show Compatibility Dashboard`**: Opens an interactive dashboard to visualize your project's compatibility status.

### Problems Panel

After a scan, any detected compatibility issues will be displayed in the **Problems** panel (`Ctrl+Shift+M`). Each issue will include a description of the problem, the file and line number where it was found, and a link to the relevant documentation on MDN.

## Command-Line Interface (CLI)

The CLI is a powerful tool for automating CodeSense and integrating it with other tools.

### Basic Usage

To scan the current directory, simply run:

```bash
CodeSense
```

To scan a specific directory, use the `--path` option:

```bash
CodeSense --path ./src
```

### Options

*   `--path <path>`: The path to the directory or file to scan.
*   `--format <format>`: The format for the report. Available formats are `html`, `json`, `csv`, and `markdown`.
*   `--output <filename>`: The name of the output file for the report.
*   `--polyfills`: Enables polyfill recommendations.
*   `--polyfill-strategy <strategy>`: The strategy to use for polyfills. Available strategies are `auto`, `manual`, and `disabled`.
*   `--watch`: Enables watch mode, which automatically rescans your project when files change.
*   `--verbose`: Enables verbose logging.

### Examples

*   Scan the `src` directory and generate an HTML report:

    ```bash
    CodeSense --path ./src --format html
    ```

*   Scan the current directory and automatically inject polyfills:

    ```bash
    CodeSense --polyfills --polyfill-strategy auto
    ```

## ESLint Plugin

The ESLint plugin provides real-time feedback on web compatibility issues as you code.

### Configuration

To use the ESLint plugin, you need to add it to your ESLint configuration file (e.g., `.eslintrc.js`):

```javascript
module.exports = {
  plugins: ['CodeSense'],
  rules: {
    'CodeSense/baseline-compatibility': ['error', {
      baselineLevel: 'newly',
      reportUnknown: false
    }]
  }
};
```

For more information on the available options, see the [Configuration](./configuration.md) documentation.

## Reporting

CodeSense can generate reports in several formats, allowing you to choose the one that best fits your needs.

*   **HTML**: An interactive report with visualizations and detailed information about each issue.
*   **JSON**: A machine-readable format that can be easily integrated with other tools.
*   **CSV**: A simple, comma-separated format that can be opened in any spreadsheet application.
*   **Markdown**: A human-readable format that's great for sharing in pull requests and other documents.

## Polyfills

CodeSense can automatically recommend and inject polyfills for the features it detects.

*   **`auto`**: CodeSense will automatically inject the necessary polyfills into your project.
*   **`manual`**: CodeSense will recommend the necessary polyfills, but you will need to add them to your project manually.
*   **`disabled`**: CodeSense will not recommend or inject any polyfills.

## CI/CD Integration

You can integrate CodeSense into your CI/CD pipeline to automatically check for web compatibility issues on every commit.

### GitHub Actions Example

This example shows how to use CodeSense in a GitHub Actions workflow to fail the build if the compatibility score is below a certain threshold.

```yaml
name: CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    - name: Install dependencies
      run: npm install
    - name: Run CodeSense
      run: npx CodeSense --format json --output compatibility-report.json
    - name: Check compatibility score
      run: |
        SCORE=$(jq '.summary.compatibilityScore' compatibility-report.json)
        if (( $(echo "$SCORE < 80" | bc -l) )); then
          echo "Compatibility score is below 80%"
          exit 1
        fi
```
