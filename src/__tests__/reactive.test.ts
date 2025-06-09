import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { reactive, Reactive } from '../reactive';

describe('Reactive', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Reactive.resetSystem();
    });

    it('should create reactive value with initial value', () => {
        const count = reactive(0);
        expect(count.value).toBe(0);
    });

    it('should update value and notify subscribers', (done) => {
        const count = reactive(0);
        const callback = jest.fn();

        count.subscribe(callback);
        count.value = 5;

        setTimeout(() => {
            expect(count.value).toBe(5);
            expect(callback).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });

    it('should not notify on same value assignment', (done) => {
        const count = reactive(5);
        const callback = jest.fn();

        count.subscribe(callback);
        count.value = 5;

        setTimeout(() => {
            expect(callback).not.toHaveBeenCalled();
            done();
        }, 10);
    });

    it('should handle object updates correctly', (done) => {
        const stats = reactive({
            components: 0,
            linesOfCode: 0,
            buildTime: 0
        });
        const callback = jest.fn();

        stats.subscribe(callback);

        stats.value = {
            components: 7,
            linesOfCode: 850,
            buildTime: 45
        };

        setTimeout(() => {
            expect(callback).toHaveBeenCalledTimes(1);
            expect(stats.value.components).toBe(7);
            expect(stats.value.linesOfCode).toBe(850);
            expect(stats.value.buildTime).toBe(45);
            done();
        }, 10);
    });

    it('should unsubscribe correctly', (done) => {
        const count = reactive(0);
        const callback = jest.fn();

        const unsubscribe = count.subscribe(callback);
        unsubscribe();
        count.value = 10;

        setTimeout(() => {
            expect(callback).not.toHaveBeenCalled();
            done();
        }, 10);
    });

    it('should batch multiple updates', (done) => {
        const count = reactive(0);
        const callback = jest.fn();

        count.subscribe(callback);
        count.value = 1;
        count.value = 2;
        count.value = 3;

        setTimeout(() => {
            expect(callback).toHaveBeenCalledTimes(1);
            expect(count.value).toBe(3);
            done();
        }, 10);
    });
});