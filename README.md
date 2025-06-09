# Propa Framework

![Propa Logo](./docs/public/logo.png)

**✨ For detailed documentation, including API Reference, please visit the [Propa Framework Documentation Site](./docs/). ✨**

A lean and performant TypeScript framework for building reactive web applications with first-class WebAssembly and P5.js integration.

## ✨ Features

* **⚡ Zero Dependencies**: Pure TypeScript implementation for a minimal runtime footprint.
* **🚀 Smart Reactivity**: Efficient, batched DOM updates with automatic dependency tracking and subscription management.
* **🔗 WebAssembly Integration**: Seamless, type-safe loading and execution of WASM modules (e.g., Rust compiled to WASM).
* **🎨 P5.js Canvas**: A dedicated wrapper for embedding and managing p5.js sketches, perfect for creative coding and interactive visualizations.
* **🛣️ Minimal Routing**: Hash-based routing with robust component lifecycle management for single-page applications.
* **⚛️ JSX Support**: Compile-time JSX transformation into native DOM operations, offering a familiar declarative syntax without a virtual DOM.

## 📦 Installation

```bash
npm install @salernoelia/propa
```

## 🚀 Quick Setup

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

## 🧩 Core Concepts

### 💡 Reactive State Management

Create and manage reactive data that automatically triggers DOM updates when changed.

```tsx
import { h, reactive, ComponentLifecycle } from '@salernoelia/propa';

function Counter() {
  const count = reactive(0); // Create a reactive number

  ComponentLifecycle.onMount(() => {
    console.log('Counter component mounted!');
  });

  return (
    <div>
      <span>Count: {count}</span> {/* Direct usage of reactive value */}
      <button onClick={() => count.value++}>Increment</button>
    </div>
  );
}

// In your main application file:
// import { h } from '@salernoelia/propa';
// import { Counter } from './components/Counter';
// const app = document.getElementById('app');
// if (app) app.appendChild(<Counter />);
```

### 🔄 Computed Properties

Derive new reactive values from existing ones. Computed values automatically re-evaluate only when their dependencies change.

```tsx
import { reactive, computed } from '@salernoelia/propa';

const firstName = reactive('John');
const lastName = reactive('Doe');

// A computed property that combines first and last names
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

console.log(fullName.value); // John Doe

firstName.value = 'Jane'; // Changes fullName automatically

setTimeout(() => {
  console.log(fullName.value); // Jane Doe (after next frame update)
}, 0);
```

### 🌐 Component Lifecycle

Manage side effects with `onMount` and `onUnmount` hooks, ensuring proper resource allocation and cleanup.

```tsx
import { h, ComponentLifecycle } from '@salernoelia/propa';

function Timer() {
  ComponentLifecycle.onMount(() => {
    console.log('Timer component mounted. Starting interval...');
    const intervalId = setInterval(() => {
      console.log('Tick!');
    }, 1000);

    // Return a cleanup function for onUnmount
    return () => {
      clearInterval(intervalId);
      console.log('Timer component unmounted. Clearing interval.');
    };
  });

  return <div>See console for timer output.</div>;
}
```

### 🗺️ Routing

Set up simple hash-based routing for your single-page application.

```tsx
import { Router, h } from '@salernoelia/propa';

// Define your page components
const HomePage = () => <h1>Welcome Home!</h1>;
const AboutPage = () => <p>Learn more about Propa.</p>;
const NotFoundPage = () => <h2>404 - Page Not Found</h2>;

const router = new Router(/* enableCaching: */ false, /* useHash: */ true);

router.addRoute('/', () => <HomePage />);
router.addRoute('/about', () => <AboutPage />);
router.addRoute('/404', () => <NotFoundPage />); // Optional fallback route

// To navigate programmatically:
// router.navigate('/about');

// Attach router to your app on load (e.g., in main.ts)
// router.handleRoute(); // Call once on initial load
```

### 🎨 P5.js Integration

Embed interactive p5.js sketches directly into your components.

```tsx
import { createP5Sketch } from '@salernoelia/propa';
import p5 from 'p5'; // Make sure p5 is installed as a dependency

const MySketch = () => {
  const sketchFunction = (p: p5) => {
    let x = 0;
    p.setup = () => {
      p.createCanvas(300, 200);
      p.background(220);
    };

    p.draw = () => {
      p.fill(p.frameCount % 255, 100, 200);
      p.ellipse(x, p.height / 2, 50, 50);
      x = (x + 1) % p.width;
    };
  };

  return createP5Sketch({
    sketch: sketchFunction,
    containerClass: 'my-p5-canvas',
    containerStyle: 'border: 2px solid purple; margin-top: 1rem;'
  });
};

// Use it in your JSX:
// <div>
//   <h2>My Interactive Art</h2>
//   <MySketch />
// </div>
```

### 📦 WebAssembly (WASM) Integration

Load and interact with Rust-compiled WebAssembly modules with automatically generated TypeScript types.

#### Rust WASM Module (`wasm/src/lib.rs`)

```rust
// wasm/src/lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    log(&format!("Rust says: Adding {} and {}", a, b));
    a + b
}

#[wasm_bindgen]
pub fn concatenate_strings(s1: &str, s2: &str) -> String {
    format!("{} {}", s1, s2)
}
```

#### TypeScript Integration

```tsx
import { h, ComponentLifecycle, reactive } from '@salernoelia/propa';

// Import your WASM module (path may vary based on build setup)
// Typically, wasm-pack generates a 'pkg' directory
import initWasm, { add, concatenate_strings } from '../../wasm/pkg/wasm';

// Define the interface for your WASM module functions for type safety
interface MyWasmModule {
  add: (a: number, b: number) => number;
  concatenate_strings: (s1: string, s2: string) => string;
  // Add other WASM functions here
}

function WasmCalculator() {
  const result = reactive('Loading WASM...');
  const wasmReady = reactive(false);

  ComponentLifecycle.onMount(async () => {
    try {
      // Initialize the WASM module
      await initWasm();
      wasmReady.value = true;
      console.log('WASM module loaded successfully!');

      // Perform a calculation using the WASM function
      const sum = add(10, 20);
      const combined = concatenate_strings("Hello", "WASM!");
      result.value = `Sum: ${sum}, Combined: "${combined}"`;

    } catch (error) {
      console.error('Failed to load WASM module:', error);
      result.value = `Error loading WASM: ${error instanceof Error ? error.message : String(error)}`;
    }
  });

  const performRandomAdd = () => {
    if (wasmReady.value) {
      const num1 = Math.floor(Math.random() * 100);
      const num2 = Math.floor(Math.random() * 100);
      const sum = add(num1, num2);
      result.value = `Random sum: ${num1} + ${num2} = ${sum}`;
    } else {
      result.value = 'WASM not ready!';
    }
  };

  return (
    <div>
      <h3>WASM Status: {wasmReady.value ? 'Ready' : 'Loading...'}</h3>
      <p>Result: {result}</p>
      <button onClick={performRandomAdd}>Calculate Random Sum</button>
    </div>
  );
}
```

#### Building WASM Modules

To compile your Rust code to WebAssembly, you'll typically use `wasm-pack`:

```bash
# Install wasm-pack if you haven't already
cargo install wasm-pack

# Navigate to your Rust WASM project directory
cd wasm/

# Build your WASM module for the web
wasm-pack build --target web --out-dir pkg
```

This command will generate the `.wasm` file and the corresponding JavaScript glue code (including TypeScript definitions) in the `pkg` directory, which you can then import into your Propa application.

## 📂 Example Application Structure

The `example/` directory provides a full working application demonstrating all features.

```sh
example/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Counter.tsx
│   │   ├── Navigation.tsx
│   │   └── P5.tsx
│   ├── pages/              # Application pages/views
│   │   ├── About.tsx
│   │   ├── Home.tsx
│   │   ├── NotFound.tsx
│   │   ├── P5.tsx
│   │   ├── Reactive.tsx
│   │   └── Wasm.tsx
│   ├── main.ts             # Entry point of the app
│   ├── router.ts           # Route definitions
│   └── style.css           # Global styles (e.g., TailwindCSS)
├── wasm/                   # Rust WebAssembly project
│   └── pkg/                # Compiled WASM output
├── index.html              # Main HTML file
├── package.json            # Example project dependencies
└── vite.config.ts          # Vite configuration
```

## 📈 Performance Benefits

* **No Virtual DOM**: Directly manipulates the real DOM, avoiding reconciliation overhead.
* **Batched Updates**: Multiple reactive changes within a single event loop tick are automatically batched and applied in a single `requestAnimationFrame`, minimizing reflows and repaints.
* **Tiny Bundle Size**: Zero runtime dependencies mean your application bundle only contains your code and `Propa`'s lean core.
* **Native Speed with WASM**: Offload computationally intensive tasks to WebAssembly for near-native performance.

## 🎯 Use Cases

* **High Performance Web-Tools** Professional software that requires high-performance and realtime graphics access.
* **Interactive Data Visualizations**: Combine reactive data with P5.js for dynamic charts, graphs, and generative art.
* **High-Performance Web Tools**: Leverage WebAssembly for complex calculations, image processing, or physics simulations directly in the browser.
* **Rapid Prototyping**: Quickly build interactive UIs with a declarative syntax and minimal boilerplate.

## 🤔 Why Choose Propa?

Propa is designed for developers who value performance, control, and a deep understanding of their application's behavior. It offers:

* **Simplicity**: A small API surface that's easy to learn and master.
* **Transparency**: No hidden magic; you always know how your UI is being updated.
* **Flexibility**: Integrate with existing libraries (like P5.js) and new web technologies (like WebAssembly) effortlessly.
* **Developer Experience**: Enjoy the benefits of reactive programming and JSX in a lightweight package.

If you're looking for a framework that empowers you to build fast, robust, and interactive web applications without unnecessary abstractions, Propa is for you.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
