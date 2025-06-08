# Propa Framework

![propa-logo](/logo.png)

A lightweight TypeScript framework for Vite with first-class WebAssembly support and minimal DOM abstractions.

## Features

- **First-Class WASM Support**: Streamlined WebAssembly module loading with TypeScript safety
- **Minimal DOM Abstractions**: Direct element manipulation with reactive updates
- **Zero Dependencies**: Pure TypeScript implementation
- **JSX Without Overhead**: Compile-time JSX transformation to native DOM calls
- **Smart Reactivity**: Batched updates with automatic subscription management
- **Minimal Component and Router Logic**: To efficiently build professional UI.

## Quick Start

```bash
npm install @salernoelia/propa-vite
```

### Configuration

**`vite.config.ts`**

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
  server: {
    fs: {
      allow: ['..'] // Allow WASM files from parent directories
    }
  }
})
```

**`tsconfig.json`**

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxFactory": "h"
  }
}
```

## WebAssembly Setup Guide

### 1. Create Rust WASM Module

```bash
# Install wasm-pack if you haven't already
cargo install wasm-pack

# Generate a new WASM project
cargo generate --git https://github.com/rustwasm/wasm-pack-template.git --name wasm
cd wasm
```

### 2. Build Your WASM Module

**`wasm/src/lib.rs`**

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn process_pixels(data: &mut [u8], width: u32, height: u32) {
    // Your pixel processing logic here
    for pixel in data.chunks_mut(4) {
        pixel[0] = (pixel[0] as f32 * 1.2).min(255.0) as u8; // Brighten red
    }
}

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}
```

**Build the module:**

```bash
cd wasm
wasm-pack build --target web --out-dir pkg
```

### 3. Add Build Script to package.json

```json
{
  "scripts": {
    "build:wasm": "cd wasm && wasm-pack build --target web --out-dir pkg"
  }
}
```

### 4. Use WASM in Your Propa App

```tsx
import { loadTypedWasm, h, reactive, ComponentLifecycle } from '@salernoelia/propa-vite';

// Define TypeScript interface for your WASM module
interface WasmModule {
  process_pixels(data: Uint8Array, width: number, height: number): void;
  fibonacci(n: number): number;
}

function PixelProcessor() {
  const result = reactive<number>(0);
  let wasmModule: any = null;

  ComponentLifecycle.onMount(async () => {
    // Load WASM module with type safety
    const wasm = await loadTypedWasm<WasmModule>('./wasm/pkg/wasm.js');
    wasmModule = wasm.getTypedModule();
    
    // Test the module
    result.value = wasmModule.fibonacci(10);
  });

  const processImage = () => {
    if (!wasmModule) return;
    
    // Create test image data
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(100, 100);
    
    // Process with WASM
    wasmModule.process_pixels(imageData.data, 100, 100);
  };

  return (
    <div>
      <h3>WASM Integration Example</h3>
      <p>Fibonacci result: {result}</p>
      <button onClick={processImage}>Process Image with WASM</button>
    </div>
  );
}
```

## Core Concepts

### Type-Safe WASM Loading

```typescript
import { loadTypedWasm } from '@salernoelia/propa-vite';

interface MyWasmModule {
  process_pixels(ptr: number, width: number, height: number): void;
  allocate_buffer(size: number): number;
}

const wasm = await loadTypedWasm<MyWasmModule>('./graphics.wasm');
const result = wasm.getTypedModule().process_pixels(ptr, 800, 600);
```

### Reactive DOM Updates

```tsx
import { reactive, h } from '@salernoelia/propa-vite';

function PixelCanvas() {
  const frameCount = reactive(0);
  
  return (
    <canvas 
      ref={(canvas) => {
        // Direct canvas manipulation
        const ctx = canvas.getContext('2d');
        // ... p5.js or direct drawing
      }}
      width={800} 
      height={600}
    />
  );
}
```

### Component Lifecycle

```tsx
import { ComponentLifecycle } from '@salernoelia/propa-vite';

function AnimationLoop() {
  ComponentLifecycle.onMount(() => {
    // Start animation loop
    const animate = () => {
      // Direct DOM/Canvas updates
      requestAnimationFrame(animate);
    };
    animate();
  });

  ComponentLifecycle.onUnmount(() => {
    // Cleanup resources
  });

  return <div>Animation Container</div>;
}
```

## Use Case

High-performance Web-Applications with realtime UI.

## Why Propa?

Unlike heavy frameworks, Propa provides just enough structure for modern development while maintaining direct access to browser APIs. Perfect for applications where performance and WebAssembly integration are priorities.

## License

MIT
