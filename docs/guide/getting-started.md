# Getting Started

Welcome to Propa! This guide will help you set up your development environment and create your first Propa application.

## Installation

Install Propa using npm (or your preferred package manager):

```bash
npm install @salernoelia/propa
```

When working with P5 also install

```bash
npm install p5 @types/p5
```

## Quick Setup

To use `Propa` with JSX, you need to configure your `vite.config.ts` (if using Vite) and `tsconfig.json` files.

### `vite.config.ts`

If you're using Vite as your build tool, update your `vite.config.ts` to enable JSX transformation:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'h',       // Propa's JSX factory function
    jsxFragment: 'Fragment', // Propa's JSX fragment function
  },
  // Other Vite configurations...
});
```

### `tsconfig.json`

Configure your TypeScript compiler options in `tsconfig.json`:

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react", // Or "react-jsx" if using new JSX transform
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    "lib": ["DOM", "ES2020"], // Ensure DOM library is included
    // ... other compiler options
    "moduleResolution": "node", // Or "bundler" for newer TS versions
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## Your First Propa Component

Here's a simple "Hello World" example:

```tsx
// src/main.tsx
import { h } from '@salernoelia/propa';

function App() {
  return <h1>Hello, Propa!</h1>;
}

const appRoot = document.getElementById('app');
if (appRoot) {
  appRoot.appendChild(<App />);
}
```

Ensure you have an `index.html` file with a root element:

```html
<!-- public/index.html or index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Propa App</title>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

Now you're ready to start building with Propa! Explore the "Core Concepts" to learn more about Propa's features.
