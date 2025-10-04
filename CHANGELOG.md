# Changelog

All notable changes to the CodeSense extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-01-15

### Added
- 🎯 **Initial release of CodeSense - Baseline Web Compatibility Tool**
- 🔍 **Advanced Code Scanner**
  - AST-based JavaScript/TypeScript parsing with Babel
  - CSS feature detection using PostCSS
  - HTML element and attribute analysis
  - Multi-file project scanning with configurable patterns
  - Support for .js, .ts, .jsx, .tsx, .css, .html files

- 📊 **Comprehensive Baseline Integration**
  - Direct integration with `web-features` npm package
  - Web Platform Dashboard API for live compatibility data
  - `compute-baseline` for granular BCD key lookups
  - Fuzzy matching and intelligent feature detection
  - Support for all three Baseline levels: Widely, Newly, Limited

- 💉 **Smart Polyfill Management**
  - Automatic polyfill recommendations based on detected issues
  - Multiple injection strategies: CDN, inline, external bundles
  - Bundle size optimization - only include necessary polyfills
  - Package.json integration for dependency management
  - Support for popular polyfill providers (polyfill.io, jsDelivr, unpkg)

- 📈 **Multi-Format Reporting**
  - Markdown reports with compatibility scores
  - Interactive HTML dashboards with charts
  - JSON output for CI/CD integration
  - CSV export for data analysis
  - Detailed issue tracking with line numbers and context

- 🛠 **VS Code Extension Features**
  - Real-time diagnostics in Problems panel
  - Hover provider for baseline information
  - Command palette integration
  - Auto-scan on file save (configurable)
  - Interactive dashboard webview
  - Context menu integration

- 🔧 **CLI Tool**
  - Standalone command-line interface
  - Watch mode for continuous monitoring
  - Configurable output formats
  - CI/CD friendly exit codes
  - Verbose logging options

- 🎨 **ESLint Plugin**
  - Custom rule: `baseline-compatibility`
  - Inline warnings during development
  - Auto-fix suggestions for polyfills
  - Configurable baseline levels
  - Support for ignore patterns

### Technical Features
- **Multi-source compatibility checking**: Local web-features → BCD lookup → Remote API fallback
- **Intelligent feature detection**: Supports 50+ web APIs, CSS properties, and HTML elements
- **Performance optimized**: Caches baseline results, parallel processing
- **Extensible architecture**: Plugin system for custom parsers and reporters
- **Type-safe**: Full TypeScript implementation with comprehensive type definitions

### Configuration Options
- **Baseline levels**: `widely`, `newly`, `all`
- **File patterns**: Include/exclude with glob support
- **Polyfill strategies**: `auto`, `manual`, `disabled`
- **Report formats**: `markdown`, `html`, `json`, `csv`
- **Auto-scan**: Configurable file watching

### Example Usage
```bash
# CLI usage
CodeSense --path ./src --format html --polyfills

# VS Code commands
- "CodeSense: Scan Project"
- "CodeSense: Generate Report" 
- "CodeSense: Inject Polyfills"
- "CodeSense: Show Dashboard"
```

### Supported Features Detection
- **JavaScript APIs**: fetch, IntersectionObserver, ResizeObserver, Navigator APIs, etc.
- **CSS Features**: Grid, Flexbox, Container Queries, CSS Functions (clamp, min, max), etc.
- **HTML Elements**: dialog, details, progress, picture, template, etc.
- **Modern Syntax**: Optional chaining, nullish coalescing, async/await, etc.

### Dependencies
- `web-features`: ^3.3.0 - Official Baseline feature database
- `compute-baseline`: ^0.4.0 - BCD key analysis
- `@babel/parser`: ^7.23.0 - JavaScript AST parsing
- `postcss`: ^8.4.0 - CSS parsing and analysis
- `glob`: ^10.3.0 - File pattern matching

### Known Limitations
- ESLint plugin requires manual installation and configuration
- Some newer CSS features may not be detected (nesting, @layer)
- HTML parsing is regex-based (will be improved with proper parser)
- Remote API calls may be rate-limited

### Coming Soon
- GitHub Actions integration
- Webpack/Vite plugins
- AI-powered alternative suggestions
- Custom polyfill database
- Team collaboration features

---

**Full Changelog**: https://github.com/your-org/CodeSense/commits/v0.1.0