# CodeSense

<p align="center">
  <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/babel-F9DC3E?style=for-the-badge&logo=babel&logoColor=black" alt="Babel">
  <img src="https://img.shields.io/badge/postcss-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white" alt="PostCSS">
  <img src="https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint">
  <img src="https://img.shields.io/badge/webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black" alt="Webpack">
  <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/github%20actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions">
  <img src="https://img.shields.io/badge/visual%20studio%20code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="VSCode">
  <img src="https://img.shields.io/badge/openai-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI">
</p>

<p align="center">
  <strong>CodeSense turns Baseline documentation into a tool that keeps your web app future-proof.</strong>
</p>

---

## The Problem

Ever found yourself asking: **"Can I actually use this cool new web feature in my project?"**

If you're a web developer, you know the drill. You end up juggling a dozen tabs—MDN, CanIUse, blog posts, compatibility tables—just to figure out if a feature is safe to use. It's a mess.

This broken workflow leads to:
*   **Over-polyfilling:** Bloating your app with unnecessary code, "just in case."
*   **Under-polyfilling:** Shipping code that breaks on older browsers, leading to angry users.
*   **Lost Productivity:** Wasting precious time on manual research instead of building.

This uncertainty is a tax on every web developer's productivity.

## Our Solution

**CodeSense** is here to fix that. It's a developer tool powered by [Baseline](https://web.dev/baseline) that makes web feature compatibility an automated part of your workflow.

Here’s what it does:
*   **Scans your code** to see which modern web features you're using.
*   **Checks their Baseline compatibility status** using official, up-to-date data.
*   **Helps you decide** if a polyfill is needed, and can even inject it for you.
*   **Warns you early**—right in your IDE, linter, or CI/CD pipeline.
*   **Generates reports and AI-powered suggestions** to help you write future-proof code.

In short, **CodeSense makes Baseline data actionable inside your workflow.**

## ✨ Key Features

### MVP (Ready to Go)
*   **💻 Code Scanner (CLI):** A command-line tool that scans your project, detects the web APIs you're using, and flags any that aren't Baseline-compatible.
*   **📊 Baseline Check:** Uses the official `web-features` npm package and the Web Platform Dashboard API to give you a clear status for each feature:
    *   ✅ **Safe:** Widely supported.
    *   ⚠️ **Partial:** Newly available and might need checking.
    *   ❌ **Not Baseline:** Risky, needs a polyfill.
*   **📄 Report Generator:** Generates simple CLI output, as well as detailed Markdown and HTML reports showing your project's Baseline compliance percentage and any risky features.

### Advanced (What's Coming Next)
*   **✍️ ESLint Plugin:** Get inline warnings right in your code as you type.
*   **💉 Smart Polyfill Injection:** Automatically add only the polyfills you need, right when you need them, using Babel.
*   **🚀 CI/CD Integration:** A GitHub Action that can block deployments if unsafe features are found, acting as a guardrail for your production builds.
*   **🤖 AI Suggestions:** Recommends Baseline-safe alternatives for any risky features you're using.
*   **📈 Dashboard UI:** A visual dashboard with charts and graphs to show your project's compliance over time.

## 🚀 Getting Started

> **Note:** This project is currently under development. The CLI tool is not yet published to npm.

To run the CodeSense CLI locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Recursion-Labs/codesense.git
    cd codesense
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Build the CLI:**
    ```bash
    npm run build:cli
    ```
    *(Note: The build is currently facing some issues. We're working on fixing them!)*

4.  **Run the CLI:**
    ```bash
    node dist/cli.js
    ```

### VS Code Extension
A VS Code extension is also planned! You'll be able to install it from the marketplace and get real-time feedback in your editor.
*   **[Link to VS Code Marketplace Extension (Coming Soon)]**

## 🌟 Why CodeSense? (Our Vision)

We believe that building for the web should be easier. Our vision is to create a tool that is:

*   **Baseline Native:** The first tool of its kind to directly integrate with the official Baseline data sources.
*   **End-to-End:** Covering your entire workflow, from writing code in your IDE to building and deploying with CI/CD.
*   **Smart:** Reducing your bundle size by avoiding unnecessary polyfills and giving you intelligent suggestions.
*   **Future-Proof:** Helping you understand when features will become part of Baseline, so you can plan for the future.
*   **Team-Ready:** With compliance badges, CI/CD guardrails, and shareable reports, it's built for teams of all sizes.

## 🏆 Hackathon Project

This project was created for the **[Baseline Devpost Hackathon](https://baseline.devpost.com/)**.

You can read more about the concepts behind Baseline here:
*   [The Web Platform Dashboard](https://web.dev/articles/web-platform-dashboard-baseline)
*   [Making web platform features more stable with Baseline](https://web.dev/articles/baseline-tools-web-features)

## 🤝 Contributing

We'd love your help! If you're interested in contributing, please check out our contributing guide (coming soon).

## 📄 License

This project is licensed under the MIT License.