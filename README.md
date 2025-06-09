# Propa Framework

![Propa Logo](./docs/public/logo.png)

A lean and performant TypeScript framework for building reactive web applications with first-class WebAssembly and P5.js integration.

## Features

* **Zero Dependencies**: Pure TypeScript implementation for a minimal runtime footprint.
* **Smart Reactivity**: Efficient, batched DOM updates with automatic dependency tracking and subscription management.
* **WebAssembly Integration**: Seamless, type-safe loading and execution of WASM modules (e.g., Rust compiled to WASM).
* **P5.js Canvas**: A dedicated wrapper for embedding and managing p5.js sketches, perfect for creative coding and interactive visualizations.
* **Minimal Routing**: Hash-based routing with robust component lifecycle management for single-page applications.
* **JSX Support**: Compile-time JSX transformation into native DOM operations, offering a familiar declarative syntax without a virtual DOM.

## Installation

```bash
npm install @salernoelia/propa
```

## Quick Setup

To use `Propa` with JSX, configure your `vite.config.ts` and `tsconfig.json` files:

### `vite.config.ts`

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  // Other Vite configurations...
});
```

### `tsconfig.json`

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react", // Or "react-jsx" if using new JSX transform
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    "lib": ["DOM", "ES2020"], // Ensure DOM library is included
    // ... other compiler options
  }
}
```
