export class WasmModule {
    private module: any = null;
    private memory: WebAssembly.Memory | null = null;

    static async load(wasmPath: string): Promise<WasmModule> {
        const instance = new WasmModule();
        await instance.init(wasmPath);
        return instance;
    }

    protected async init(wasmPath: string) {
        try {
            let wasmModule;
            if (wasmPath.startsWith('/') || wasmPath.startsWith('http')) {
                wasmModule = await import(/* @vite-ignore */ wasmPath);
            } else {
                wasmModule = await import(wasmPath);
            }

            if (wasmModule.default && typeof wasmModule.default === 'function') {
                await wasmModule.default();
            }

            this.module = wasmModule;
            this.memory = wasmModule.memory;
        } catch (error) {
            console.error('Failed to load WASM module:', error);
            throw error;
        }
    }

    call(functionName: string, ...args: any[]): any {
        if (!this.module || !this.module[functionName]) {
            throw new Error(`Function ${functionName} not found in WASM module`);
        }
        return this.module[functionName](...args);
    }

    getMemory(): WebAssembly.Memory | null {
        return this.memory;
    }

    getModule(): any {
        return this.module;
    }

    withUint8Array(data: Uint8Array, callback: (ptr: number) => any): any {
        if (!this.module.__wbindgen_malloc || !this.module.__wbindgen_export_0) {
            throw new Error('WASM memory functions not available');
        }

        const ptr = this.module.__wbindgen_malloc(data.length, 1);
        const view = new Uint8Array(this.module.memory.buffer, ptr, data.length);
        view.set(data);

        try {
            return callback(ptr);
        } finally {
            if (this.module.__wbindgen_free) {
                this.module.__wbindgen_free(ptr, data.length, 1);
            }
        }
    }
}

export class TypedWasmModule<T = any> extends WasmModule {
    private typedModule: T | null = null;

    static async loadTyped<T = any>(wasmPath: string): Promise<TypedWasmModule<T>> {
        const instance = new TypedWasmModule<T>();
        await instance.init(wasmPath);
        return instance;
    }

    protected async init(wasmPath: string) {
        await super.init(wasmPath);
        this.typedModule = this.getModule() as T;
    }

    getTypedModule(): T {
        if (!this.typedModule) {
            throw new Error('WASM module not initialized');
        }
        return this.typedModule;
    }
}

export async function loadWasm(wasmPath: string): Promise<WasmModule> {
    return WasmModule.load(wasmPath);
}

export async function loadTypedWasm<T = any>(wasmPath: string): Promise<TypedWasmModule<T>> {
    return TypedWasmModule.loadTyped<T>(wasmPath);
}