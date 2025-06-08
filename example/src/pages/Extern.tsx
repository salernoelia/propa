import { h } from "@salernoelia/propa";
import { ComponentLifecycle } from '@salernoelia/propa';
import { reactive } from '@salernoelia/propa';
// Import the functions and their types directly
import wasmInit, { greet, add, sum_array } from '../../wasm/pkg/wasm';

export function ExternPage() {
    const result = reactive('Not loaded yet');
    const wasmLoaded = reactive(false);

    ComponentLifecycle.onMount(async () => {
        console.log('Component is mounted - loading WASM');
        try {
            // Initialize WASM
            await wasmInit();
            wasmLoaded.value = true;

            // Test functions with full type safety
            const addResult = add(5, 3);
            greet('TypeScript');

            result.value = `Add result: ${addResult}`;
            console.log('WASM module loaded successfully');
        } catch (error) {
            console.error('Failed to load WASM:', error);
            result.value = `Failed to load WASM module: ${error instanceof Error ? error.message : String(error)}`;
        }
    });

    ComponentLifecycle.onUnmount(() => {
        console.log('Component is unmounting - cleanup here');
    });

    // direct function calls with ts support
    const testWasm = () => {
        if (wasmLoaded.value) {
            const a = Math.floor(Math.random() * 100);
            const b = Math.floor(Math.random() * 100);
            const newResult = add(a, b);
            result.value = `Random add result: ${a} + ${b} = ${newResult}`;
        }
    };

    // type-safe array function
    const testArray = () => {
        if (wasmLoaded.value) {
            const numbers = new Int32Array([1, 2, 3, 4, 99]);
            const sum = sum_array(numbers);
            result.value = `Array sum result: ${sum}`;
        }
    };

    const testGreet = () => {
        if (wasmLoaded.value) {
            greet('User from TypeScript!');
            result.value = 'Greeting sent to console!';
        }
    };

    return (
        <div>
            <h1>Extern - WASM Test</h1>
            <p>Testing WebAssembly integration with auto-generated TypeScript types</p>
            <p>Result: {result}</p>
            <button onClick={testWasm}>Test Random Add</button>
            <button onClick={testArray}>Test Array Sum</button>
            <button onClick={testGreet}>Test Greet</button>
            <a href="#/">Home</a>
        </div>
    );
}