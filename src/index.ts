// Core utilities
export { Reactive, reactive, computed } from './reactive';
export { ComponentLifecycle } from './lifecycle';
export { Router } from './router';
export { h, when } from './jsx';
export { WasmModule, TypedWasmModule, loadWasm, loadTypedWasm } from './wasm';
export { createP5Sketch } from './p5';

// Types
export type { LifecycleCallback } from './lifecycle';
export type { P5Props } from './p5';

// JSX support
export { h as jsx, h as jsxs } from './jsx';