# Installation

This guide provides detailed instructions for installing CodeSense. You can use CodeSense in several ways: as a VS Code extension, a command-line interface (CLI), or an ESLint plugin.

## VS Code Extension

The VS Code extension is the recommended way to use CodeSense for most users. It provides the most integrated experience.

### Prerequisites

*   [Visual Studio Code](https://code.visualstudio.com/) version 1.104.0 or newer.

### Installation

1.  Open Visual Studio Code.
2.  Go to the **Extensions** view by clicking the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
3.  In the search bar, type `CodeSense`.
4.  Find the "CodeSense - Baseline Web Compatibility" extension and click the **Install** button.

## Command-Line Interface (CLI)

The CLI is ideal for integrating CodeSense into your build process or CI/CD pipeline.

### Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm) version 16 or newer.

### Global Installation

For most users, we recommend installing the CodeSense CLI globally. This allows you to run the `CodeSense` command from any directory.

```bash
npm install -g CodeSense
```

### Local Installation

If you prefer to manage CodeSense as a project-specific dependency, you can install it locally.

```bash
npm install --save-dev CodeSense
```

When installed locally, you can run the CLI using `npx`:

```bash
npx CodeSense
```

## ESLint Plugin

The ESLint plugin allows you to see CodeSense warnings directly in your editor as you code.

### Prerequisites

*   [ESLint](https://eslint.org/) version 8 or newer.

### Installation

1.  First, install the ESLint plugin:

    ```bash
    npm install --save-dev eslint-plugin-CodeSense
    ```

2.  Then, add the plugin to your ESLint configuration file (e.g., `.eslintrc.js`):

    ```javascript
    module.exports = {
      // ... your other ESLint configuration
      plugins: ['CodeSense'],
      rules: {
        'CodeSense/baseline-compatibility': 'error'
      }
    };
    ```

For more information on configuring the ESLint plugin, see the [Configuration](./configuration.md) documentation.
