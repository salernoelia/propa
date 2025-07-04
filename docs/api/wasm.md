# WebAssembly (WASM) API

Propa provides classes and helper functions to simplify loading and interacting with WebAssembly modules.

## `WasmModule`

A base class for loading and interacting with a WASM module.

### `static async WasmModule.load(wasmPath: string): Promise<WasmModule>`

Static factory method to load a WASM module.

- **`wasmPath`**: Path or URL to the WASM JavaScript glue file (e.g., generated by `wasm-pack`).
- **Returns**: A `Promise` that resolves to a `WasmModule` instance.

### `WasmModule` Instance Methods

- **`call(functionName: string, ...args: any[]): any`**: Calls an exported function from the WASM module.
- **`getMemory(): WebAssembly.Memory | null`**: Returns the WASM module's memory instance, if available.
- **`getModule(): any`**: Returns the raw WASM module exports.
- **`withUint8Array(data: Uint8Array, callback: (ptr: number) => any): any`**: (Primarily for `wasm-bindgen` modules) Allocates memory in WASM, copies `data` into it, executes `callback` with the pointer, and then frees the memory.

## `TypedWasmModule<T = any>`

Extends `WasmModule` to provide a type-safe interface to the WASM module's exports.

- **`T`**: A generic type representing the interface of the WASM module's exports.

### `static async TypedWasmModule.loadTyped<T = any>(wasmPath: string): Promise<TypedWasmModule<T>>`

Static factory method to load a WASM module with type information.

- **`wasmPath`**: Path or URL to the WASM JavaScript glue file.
- **Returns**: A `Promise` that resolves to a `TypedWasmModule<T>` instance.

### `TypedWasmModule<T>` Instance Methods

- **`getTypedModule(): T`**: Returns the type-safe WASM module exports. Throws an error if the module is not initialized.
- Inherits all methods from `WasmModule`.

## Helper Functions

### `async loadWasm(wasmPath: string): Promise<WasmModule>`

A shorthand function for `WasmModule.load(wasmPath)`.

### `async loadTypedWasm<T = any>(wasmPath: string): Promise<TypedWasmModule<T>>`

A shorthand function for `TypedWasmModule.loadTyped<T>(wasmPath)`.

**Example Usage (with `wasm-pack` generated module):**

```typescript
import { h, ComponentLifecycle, reactive } from '@salernoelia/propa';
// Assuming wasm-pack generated 'my_wasm_lib.js' and 'my_wasm_lib_bg.wasm' in 'pkg/'
// And 'my_wasm_lib.d.ts' defines the types for exported functions.
import initWasm, { add } from './pkg/my_wasm_lib'; // Direct import

interface MyWasmApi {
  add: (a: number, b: number) => number;
  // other functions
}

function WasmComponent() {
  const result = reactive('Loading...');

  ComponentLifecycle.onMount(async () => {
    try {
      // Option 1: Using direct imports (recommended with wasm-pack)
      await initWasm(); // Initialize the module
      const sum = add(5, 7);
      result.value = `Sum from WASM: ${sum}`;

      // Option 2: Using Propa's loadTypedWasm (if you prefer the helper)
      // import { loadTypedWasm } from '@salernoelia/propa';
      // const wasmInstance = await loadTypedWasm<MyWasmApi>('./pkg/my_wasm_lib.js');
      // const typedApi = wasmInstance.getTypedModule();
      // const sum = typedApi.add(5, 7);
      // result.value = `Sum from WASM: ${sum}`;

    } catch (e) {
      result.value = `Error: ${e.message}`;
    }
  });

  return <div>{result}</div>;
}
```

For modules generated by `wasm-pack`, directly importing the `init` function and the exported WASM functions (as shown in Option 1) is often the most straightforward approach, as `wasm-pack` provides the necessary JavaScript glue and TypeScript definitions. Propa's helpers can be useful for other WASM setups or if you prefer a consistent loading pattern.
