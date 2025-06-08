# Propa Framework

![propa-logo](/logo.png)

A minimal TypeScript framework for building reactive web applications with first-class WebAssembly and P5.js support.

## Features

- **Zero Dependencies**: Pure TypeScript implementation with no runtime overhead
- **Smart Reactivity**: Batched DOM updates with automatic subscription management
- **WebAssembly Integration**: Type-safe WASM module loading and execution
- **P5.js**: Built-in p5.js wrapper for graphics and animation
- **Minimal Routing**: Hash-based routing with component lifecycle management
- **JSX Support**: Compile-time JSX transformation to native DOM operations

## Installation

```bash
npm install @salernoelia/propa-vite
```

## Quick Setup

**vite.config.ts**

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})
```

#### **tsconfig.json**

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxFactory": "h"
  }
}
```

## Core Concepts

### Reactive State Management

```tsx
import { h, reactive, ComponentLifecycle } from '@salernoelia/propa-vite';

function Counter() {
  const count = reactive(0);
  
  ComponentLifecycle.onMount(() => {
    console.log('Counter mounted');
  });

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => count.value++}>Increment</button>
    </div>
  );
}
```

### Component Lifecycle

```tsx
import { ComponentLifecycle } from '@salernoelia/propa-vite';

function DataComponent() {
  ComponentLifecycle.onMount(() => {
    // Initialize resources, start timers, fetch data
  });

  ComponentLifecycle.onUnmount(() => {
    // Cleanup resources, cancel requests
  });

  return <div>Component content</div>;
}
```

### Routing

```tsx
import { Router } from '@salernoelia/propa-vite';
import { HomePage } from './pages/Home';
import { AboutPage } from './pages/About';

const router = new Router();

router.addRoute('/', () => HomePage());
router.addRoute('/about', () => AboutPage());
router.addRoute('/404', () => NotFoundPage());

// Navigate programmatically
router.navigate('/about');
```

### P5.js with p5.js

```tsx
import { createP5Sketch } from '@salernoelia/propa-vite';
import p5 from 'p5';

const AnimatedCircle = () => {
  return createP5Sketch((p: p5) => {
    p.setup = () => {
      p.createCanvas(400, 400);
    };

    p.draw = () => {
      p.background(220);
      p.fill(255, 0, 0);
      p.ellipse(p.mouseX, p.mouseY, 50, 50);
    };
  }, {
    width: 400,
    height: 400,
    className: 'canvas-container'
  });
};
```

### WebAssembly Integration

**Rust WASM Module (wasm/src/lib.rs)**

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn sum_array(numbers: &[i32]) -> i32 {
    numbers.iter().sum()
}
```

**TypeScript Integration**

```tsx
import { reactive, ComponentLifecycle } from '@salernoelia/propa-vite';
import wasmInit, { add, sum_array } from './wasm/pkg/wasm';

function WasmComponent() {
  const result = reactive('Loading...');
  const wasmReady = reactive(false);

  ComponentLifecycle.onMount(async () => {
    await wasmInit();
    wasmReady.value = true;
    
    // Type-safe WASM function calls
    const sum = add(5, 10);
    const arraySum = sum_array(new Int32Array([1, 2, 3, 4]));
    
    result.value = `Sum: ${sum}, Array sum: ${arraySum}`;
  });

  return (
    <div>
      <p>Status: {wasmReady.value ? 'Ready' : 'Loading'}</p>
      <p>Result: {result}</p>
    </div>
  );
}
```

## Building WASM Modules

```bash
# Install wasm-pack
cargo install wasm-pack

# Create new WASM project
cargo generate --git https://github.com/rustwasm/wasm-pack-template.git --name wasm

# Build for web
cd wasm
wasm-pack build --target web --out-dir pkg
```

## Example Application Structure

```
src/
├── components/
│   ├── Button.tsx
│   ├── Counter.tsx
│   └── Navigation.tsx
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── P5.tsx
│   └── Wasm.tsx
└── main.tsx
```

## Performance Benefits

- **No Virtual DOM**: Direct DOM manipulation for optimal performance
- **Batched Updates**: Reactive changes are automatically batched using `requestAnimationFrame`
- **Minimal Bundle Size**: Zero runtime dependencies, only what you use gets bundled
- **Native Speed**: WASM integration for compute-intensive operations

## Use Cases

- **P5.js**: Interactive graphics, generative art, data visualization
- **Performance-Critical Apps**: Real-time applications requiring native-speed computation
- **Educational Tools**: Mathematical simulations, algorithm visualization
- **Prototype Development**: Rapid iteration with minimal framework overhead

## Why Propa?

Propa bridges the gap between modern development patterns and direct browser API access. Unlike heavy frameworks, it provides just enough structure for productive development while maintaining the performance characteristics of vanilla JavaScript.

Perfect for developers who want:

- Reactive state management without complexity
- WebAssembly integration without boilerplate
- P5.js capabilities with TypeScript safety
- Minimal learning curve with maximum flexibility

## License

MIT
