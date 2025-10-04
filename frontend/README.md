# CodeSense Frontend

This directory contains the frontend landing page for the CodeSense VS Code extension.

## Overview

The frontend serves as a marketing and information website for the CodeSense extension, providing:

- Extension overview and features
- Installation instructions
- Documentation and usage guides
- Download links to VS Code Marketplace
- Screenshots and demos

## Structure

```
frontend/
├── README.md          # This file
├── public/           # Static assets (images, icons, etc.)
├── src/              # Source code
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── styles/       # CSS/styling files
│   └── assets/       # Images, fonts, etc.
├── package.json      # Frontend dependencies
└── index.html        # Main entry point (if using vanilla HTML)
```

## Technology Stack

To be decided based on requirements:

### Option 1: Simple Static Site
- HTML/CSS/JavaScript
- No build process required
- Easy to deploy

### Option 2: Modern Framework
- **React + Vite** - Fast development, component-based
- **Next.js** - SEO-friendly, server-side rendering
- **Astro** - Content-focused, minimal JavaScript
- **Vue + Nuxt** - Alternative to React/Next

### Styling Options
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Modules** - Scoped CSS
- **Styled Components** - CSS-in-JS

## Getting Started

1. Choose your preferred tech stack
2. Initialize the project in this directory
3. Set up development environment
4. Create initial components and pages

## Deployment

Options for hosting:
- **Vercel** - Excellent for Next.js/React
- **Netlify** - Great for static sites
- **GitHub Pages** - Free hosting for static sites
- **Azure Static Web Apps** - Microsoft's static hosting

## Branch Strategy

- `main` - Production VS Code extension code
- `dev` - Development branch (contains both extension and frontend)
- Frontend code lives in the `/frontend` directory within dev/main branches

## Next Steps

1. Decide on technology stack
2. Initialize the chosen framework
3. Create basic page structure
4. Design and implement UI components
5. Add content and documentation
6. Set up deployment pipeline