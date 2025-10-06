# Getting Started

This guide will help you get up and running with CodeSense in just a few minutes. We'll cover the two most common ways to use CodeSense: the VS Code extension and the command-line interface (CLI).

## Using the VS Code Extension

The easiest way to get started with CodeSense is by using the VS Code extension. It provides real-time feedback and a seamless experience within your favorite editor.

### 1. Install the Extension

1.  Open Visual Studio Code.
2.  Go to the Extensions view (Ctrl+Shift+X).
3.  Search for "CodeSense" and click **Install**.

### 2. Scan Your Project

1.  Open your web project in VS Code.
2.  Open the Command Palette (Ctrl+Shift+P).
3.  Type **"CodeSense: Scan Project"** and press Enter.

### 3. View the Results

CodeSense will scan your project and display any compatibility issues it finds in the **Problems** panel (Ctrl+Shift+M). You can click on each issue to navigate directly to the problematic code.

## Using the CLI

The CodeSense CLI is perfect for integrating with your existing build tools and CI/CD pipelines.

### 1. Install the CLI

Open your terminal and install the CodeSense CLI globally using npm:

```bash
npm install -g CodeSense
```

### 2. Scan Your Project

Navigate to your project's root directory and run the following command:

```bash
CodeSense
```

### 3. View the Results

CodeSense will scan your project and print a summary of its findings to the console. For a more detailed report, you can generate an HTML report:

```bash
CodeSense --format html
```

This will create a `CodeSense-report.html` file in your project directory. Open this file in your browser to view the interactive report.

## What's Next?

Now that you've seen the basics, you can explore the more advanced features of CodeSense:

*   **[Installation](./installation.md)**: For more detailed installation instructions.
*   **[Usage](./usage.md)**: For a comprehensive guide to all of CodeSense's features.
*   **[Configuration](./configuration.md)**: To learn how to customize CodeSense to your needs.
