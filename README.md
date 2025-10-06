# 🎯 CodeSense - Baseline Web Compatibility Tool

**The first Baseline-native developer tool that makes web feature compatibility actionable in your workflow.**

CodeSense automatically scans your codebase for modern web features, checks their Baseline compatibility status, and provides intelligent recommendations for polyfills and alternatives. Stop guessing about browser support—let CodeSense guide your decisions with official Baseline data.

## 🌟 Key Features

### 🔍 **Intelligent Code Scanning**
- **AST-based parsing** for JavaScript/TypeScript using Babel
- **CSS feature detection** with PostCSS integration  
- **HTML element and attribute analysis**
- **Multi-file project scanning** with configurable patterns

### 📊 **Official Baseline Integration**
- Direct integration with the **web-features** npm package
- **Web Platform Dashboard API** for live compatibility data
- **compute-baseline** for granular BCD key lookups
- Fuzzy matching and intelligent feature detection

### 💉 **Smart Polyfill Management**
- **Automatic polyfill recommendations** based on detected issues
- **Multiple injection strategies**: CDN, inline, or external bundles
- **Bundle size optimization** - only include what you need
- **Package.json integration** for dependency management

### 📈 **Comprehensive Reporting**
- **Multiple formats**: Markdown, HTML, JSON, CSV
- **Interactive HTML dashboards** with compatibility scores
- **Detailed issue tracking** with line numbers and context
- **Polyfill recommendations** and alternative API suggestions

### 🛠 **Developer Experience**
- **VS Code extension** with real-time diagnostics
- **ESLint plugin** for inline warnings during development
- **CLI tool** for CI/CD integration
- **Watch mode** for continuous monitoring

## 🚀 Quick Start

### VS Code Extension

1. Install the CodeSense extension from the VS Code marketplace
2. Open your project in VS Code
3. Run **"CodeSense: Scan Project"** from the command palette
4. View compatibility issues in the Problems panel
5. Generate detailed reports with **"CodeSense: Generate Report"**

### CLI Tool

```bash
# Install globally
npm install -g CodeSense

# Scan current directory
CodeSense

# Scan specific path with HTML report
CodeSense --path ./src --format html

# Include polyfill recommendations
CodeSense --polyfills --polyfill-strategy auto

# Watch mode for continuous monitoring
CodeSense --watch --verbose
```

### ESLint Plugin

```javascript
// eslint.config.js
import CodeSense from 'eslint-plugin-CodeSense';

export default [
  {
    plugins: { CodeSense },
    rules: {
      'CodeSense/baseline-compatibility': ['error', {
        baselineLevel: 'newly',
        reportUnknown: false
      }]
    }
  }
];
```

## 📋 Configuration

### VS Code Settings

```json
{
  "CodeSense.autoScan": true,
  "CodeSense.baselineLevel": "newly",
  "CodeSense.excludePatterns": ["node_modules/**", "dist/**"],
  "CodeSense.polyfillStrategy": "manual"
}
```

### CLI Configuration File (`CodeSense.config.json`)

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

## 🎯 Baseline Levels

- **`widely`** - Only flag features with Limited availability (strictest)
- **`newly`** - Flag Limited + Newly available features (recommended)
- **`all`** - Report all detected features including Widely available

## 📊 Example Output

### CLI Summary
```
🔍 Scanning /project for baseline compatibility...
📊 Summary:
   Compatibility Score: 87%
   ✅ Widely Available: 45
   ⚠️ Newly Available: 8
   ❌ Limited Support: 3
   ❓ Unknown: 1

⚠️ Warning: 3 features have limited browser support
```

### HTML Report Features
- **Interactive compatibility score gauge**
- **Detailed issue breakdown by file**
- **Polyfill recommendations with package info**
- **Alternative API suggestions**
- **Sortable and filterable results**

## 🔧 Advanced Usage

### Polyfill Injection Strategies

```javascript
// Auto-inject polyfills
CodeSense --polyfill-strategy auto

// Manual recommendations only
CodeSense --polyfill-strategy manual

// Disable polyfill features
CodeSense --polyfill-strategy disabled
```

### Custom Exclude Patterns

```bash
# Exclude test files and documentation
CodeSense --exclude "**/*.test.js,**/*.spec.ts,docs/**"

# Include only specific directories
CodeSense --include "src/**,lib/**"
```

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Check Web Compatibility
  run: |
    npx CodeSense --format json --output compatibility-report.json
    # Fail build if compatibility score < 80%
```

## 📚 Documentation

For detailed documentation, please see the [docs](./docs) directory.


## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **WebDX Community Group** for the Baseline initiative
- **web-features project** for the comprehensive feature database
- **MDN** and **BCD** for browser compatibility data
- **Chrome team** for pioneering the Baseline concept

---

**Made with ❤️ for the web development community**

*Stop guessing about browser support. Start building with confidence.*
