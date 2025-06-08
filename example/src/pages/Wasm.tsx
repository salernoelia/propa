import { h } from "@salernoelia/propa";
import { ComponentLifecycle } from '@salernoelia/propa';
import { reactive } from '@salernoelia/propa';

// Import the functions and their types directly
import wasmInit, { greet, add, sum_array } from '../../wasm/pkg/wasm';
import { Navigation } from "../components/Navigation";
import { Button } from "../components/Button";

export function WasmPage() {
    const result = reactive('Not loaded yet');
    const wasmLoaded = reactive(false);

    ComponentLifecycle.onMount(async () => {
        console.log('Component is mounted - loading WASM');
        try {
            await wasmInit();
            wasmLoaded.value = true;

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
            <Navigation />

            <h1>WASM</h1>
            <p>WebAssembly integration with auto-generated TypeScript types</p>
            <p>Result: {result}</p>
            <div class="flex flex-row gap-4">
                <Button onClick={testWasm}>Test Random Add</Button>
                <Button onClick={testArray}>Test Array Sum</Button>
                <Button onClick={testGreet}>Test Greet</Button>
            </div>
        </div>
    );
}