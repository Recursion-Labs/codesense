# Configuration

CodeSense can be configured to fit the specific needs of your project. You can configure CodeSense through a `CodeSense.config.json` file in your project's root directory or through the VS Code settings.

## `CodeSense.config.json`

A `CodeSense.config.json` file allows you to configure CodeSense on a per-project basis. This is the recommended way to configure CodeSense for projects that are worked on by multiple people.

### Example

```json
{
  "baseline": "newly",
  "exclude": ["node_modules/**", "dist/**", "build/**"],
  "include": ["src/**/*.{js,ts,jsx,tsx,css,html}"],
  "format": "html",
  "polyfills": true,
  "polyfillStrategy": "auto",
  "verbose": true
}
```

### Options

*   `baseline`: The minimum Baseline level to consider safe. Can be `widely`, `newly`, or `all`.
*   `exclude`: An array of glob patterns for files and directories to exclude from the scan.
*   `include`: An array of glob patterns for files and directories to include in the scan.
*   `format`: The default format for reports. Can be `html`, `json`, `csv`, or `markdown`.
*   `polyfills`: Whether to enable polyfill recommendations. Can be `true` or `false`.
*   `polyfillStrategy`: The strategy to use for polyfills. Can be `auto`, `manual`, or `disabled`.
*   `verbose`: Whether to enable verbose logging. Can be `true` or `false`.

## VS Code Settings

You can also configure CodeSense through the VS Code settings. These settings will apply to all of your projects, unless they are overridden by a `CodeSense.config.json` file.

To open the VS Code settings, go to **File > Preferences > Settings** and search for "CodeSense".

### Options

*   `CodeSense.autoScan`: Whether to automatically scan files on save. Can be `true` or `false`.
*   `CodeSense.baselineLevel`: The minimum Baseline level to consider safe. Can be `widely`, `newly`, or `all`.
*   `CodeSense.excludePatterns`: An array of glob patterns for files and directories to exclude from the scan.
*   `CodeSense.polyfillStrategy`: The strategy to use for polyfills. Can be `auto`, `manual`, or `disabled`.
