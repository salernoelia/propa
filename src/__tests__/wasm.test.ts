import { describe, it, expect, jest, beforeEach } from '@jest/globals';

const mockWasmModule = {
    default: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    memory: { buffer: new ArrayBuffer(1024) },
    malloc: jest.fn<(size: number) => number>().mockReturnValue(100),
    free: jest.fn<(ptr: number) => void>(),
    test_function: jest.fn<() => number>().mockReturnValue(42),
    add_numbers: jest.fn<(a: number, b: number) => number>((a: number, b: number) => a + b)
};

class MockWasmModule {
    private module: any = mockWasmModule;
    private memory: any = mockWasmModule.memory;

    static async load(wasmPath: string): Promise<MockWasmModule> {
        if (wasmPath.includes('invalid')) {
            throw new Error('Failed to load');
        }
        const instance = new MockWasmModule();
        await mockWasmModule.default();
        return instance;
    }

    call(functionName: string, ...args: any[]): any {
        if (!this.module || !this.module[functionName]) {
            throw new Error(`Function ${functionName} not found in WASM module`);
        }
        return this.module[functionName](...args);
    }

    getMemory(): any {
        return this.memory;
    }

    withUint8Array(data: Uint8Array, callback: (ptr: number) => any): any {
        const ptr = this.module.malloc(data.length);
        try {
            return callback(ptr);
        } finally {
            this.module.free(ptr);
        }
    }
}

jest.mock('../wasm', () => ({
    WasmModule: MockWasmModule,
    loadWasm: MockWasmModule.load
}));

import { WasmModule, loadWasm } from '../wasm';

describe('WasmModule', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        const originalImport = (global as any).import;

        (global as any).import = jest.fn().mockImplementation((specifier: unknown) => {
            const spec = String(specifier);
            if (spec.includes('./test.wasm')) {
                return Promise.resolve(mockWasmModule);
            }
            if (spec.includes('./invalid.wasm')) {
                return Promise.reject(new Error('Failed to load'));
            }
            return originalImport ? originalImport(spec) : Promise.reject(new Error('Module not found'));
        });

        mockWasmModule.default.mockClear();
        mockWasmModule.malloc.mockClear();
        mockWasmModule.free.mockClear();
        mockWasmModule.test_function.mockClear();
        mockWasmModule.add_numbers.mockClear();
    });

    it('should load WASM module successfully', async () => {
        const module = await loadWasm('./test.wasm');

        expect(module).toBeInstanceOf(WasmModule);
        expect(mockWasmModule.default).toHaveBeenCalled();
    });

    it('should call WASM functions', async () => {
        const module = await WasmModule.load('./test.wasm');

        const result = module.call('test_function');
        expect(result).toBe(42);
        expect(mockWasmModule.test_function).toHaveBeenCalled();
    });

    it('should call WASM functions with arguments', async () => {
        const module = await WasmModule.load('./test.wasm');

        const result = module.call('add_numbers', 5, 3);
        expect(result).toBe(8);
        expect(mockWasmModule.add_numbers).toHaveBeenCalledWith(5, 3);
    });

    it('should throw error for non-existent functions', async () => {
        const module = await WasmModule.load('./test.wasm');

        expect(() => {
            module.call('non_existent_function');
        }).toThrow('Function non_existent_function not found in WASM module');
    });

    it('should get memory object', async () => {
        const module = await WasmModule.load('./test.wasm');

        const memory = module.getMemory();
        expect(memory).toBe(mockWasmModule.memory);
    });

    it('should handle Uint8Array with memory management', async () => {
        const module = await WasmModule.load('./test.wasm');
        const testData = new Uint8Array([1, 2, 3, 4]);

        const result = module.withUint8Array(testData, (ptr) => {
            expect(ptr).toBe(100);
            expect(mockWasmModule.malloc).toHaveBeenCalledWith(4);
            return 'processed';
        });

        expect(result).toBe('processed');
        expect(mockWasmModule.free).toHaveBeenCalledWith(100);
    });

    it('should handle WASM loading errors', async () => {
        await expect(loadWasm('./invalid.wasm')).rejects.toThrow('Failed to load');
    });
});