import { reactive, Reactive } from "../reactive";
import { jest } from '@jest/globals';

describe('Environment Compatibility', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Reactive.resetSystem();
    });

    it('should handle missing requestAnimationFrame', (done) => {
        const originalRAF = global.requestAnimationFrame;
        delete (global as any).requestAnimationFrame;

        const count = reactive(0);
        const callback = jest.fn();

        count.subscribe(callback);
        count.value = 1;

        setTimeout(() => {
            expect(callback).toHaveBeenCalled();
            expect(count.value).toBe(1);

            (global as any).requestAnimationFrame = originalRAF;
            done();
        }, 50);
    });

    it('should handle server-side rendering environment', (done) => {
        const originalWindow = global.window;
        const originalRAF = global.requestAnimationFrame;

        delete (global as any).window;
        delete (global as any).requestAnimationFrame;

        const count = reactive(0);
        const callback = jest.fn();

        count.subscribe(callback);
        count.value = 1;

        setTimeout(() => {
            expect(callback).toHaveBeenCalled();
            expect(count.value).toBe(1);

            (global as any).window = originalWindow;
            (global as any).requestAnimationFrame = originalRAF;
            done();
        }, 50);
    });

    it('should handle missing document in SSR', () => {
        const originalDocument = global.document;
        delete (global as any).document;

        // JSX should handle missing document gracefully
        expect(() => {
            const count = reactive(0);
            count.value = 1;
        }).not.toThrow();

        (global as any).document = originalDocument;
    });
});