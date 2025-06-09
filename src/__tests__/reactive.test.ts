import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { reactive, computed, Reactive } from '../reactive';

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

    it('should handle object property dependencies with computed', (done) => {
        const stats = reactive({
            components: 5,
            linesOfCode: 100
        });
        const total = computed(() => stats.value.components + stats.value.linesOfCode);
        const callback = jest.fn();

        total.subscribe(callback);
        expect(total.value).toBe(105);

        stats.value = {
            components: 7,
            linesOfCode: 850
        };

        setTimeout(() => {
            expect(total.value).toBe(857);
            expect(callback).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });

    it('should handle nested object property changes', (done) => {
        const stats = reactive({
            components: 0,
            linesOfCode: 0,
            buildTime: 0
        });
        const callback = jest.fn();

        stats.subscribe(callback);

        stats.value.components = 10;

        setTimeout(() => {
            expect(callback).toHaveBeenCalledTimes(1);
            expect(stats.value.components).toBe(10);
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

describe('Reactive Edge Cases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Reactive.resetSystem();
    });

    it('should handle array mutations', (done) => {
        const items = reactive<number[]>([1, 2, 3]);
        const callback = jest.fn();

        items.subscribe(callback);
        items.value.push(4);

        setTimeout(() => {
            expect(items.value).toEqual([1, 2, 3, 4]);
            expect(callback).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });

    it('should handle deep object mutations', (done) => {
        const user = reactive({
            profile: {
                name: 'John',
                settings: {
                    theme: 'dark'
                }
            }
        });
        const callback = jest.fn();

        user.subscribe(callback);
        user.value.profile.settings.theme = 'light';

        setTimeout(() => {
            expect(user.value.profile.settings.theme).toBe('light');
            expect(callback).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });

    it('should handle null and undefined values', (done) => {
        const nullable = reactive<string | null>(null);
        const callback = jest.fn();

        nullable.subscribe(callback);
        nullable.value = 'test';

        setTimeout(() => {
            expect(nullable.value).toBe('test');
            expect(callback).toHaveBeenCalledTimes(1);

            nullable.value = null;

            setTimeout(() => {
                expect(nullable.value).toBe(null);
                expect(callback).toHaveBeenCalledTimes(2);
                done();
            }, 10);
        }, 10);
    });

    it('should handle boolean toggles', (done) => {
        const flag = reactive(false);
        const callback = jest.fn();

        flag.subscribe(callback);
        flag.value = true;

        setTimeout(() => {
            expect(flag.value).toBe(true);
            expect(callback).toHaveBeenCalledTimes(1);

            flag.value = false;

            setTimeout(() => {
                expect(flag.value).toBe(false);
                expect(callback).toHaveBeenCalledTimes(2);
                done();
            }, 10);
        }, 10);
    });

    it('should handle Date objects', (done) => {
        const timestamp = reactive(new Date('2023-01-01'));
        const callback = jest.fn();

        timestamp.subscribe(callback);
        timestamp.value = new Date('2023-12-31');

        setTimeout(() => {
            expect(timestamp.value.getFullYear()).toBe(2023);
            expect(timestamp.value.getMonth()).toBe(11);
            expect(callback).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });

    it('should handle Map objects', (done) => {
        const map = reactive(new Map([['key1', 'value1']]));
        const callback = jest.fn();

        map.subscribe(callback);
        map.value.set('key2', 'value2');

        setTimeout(() => {
            expect(map.value.get('key2')).toBe('value2');
            expect(callback).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });

    it('should handle Set objects', (done) => {
        const set = reactive(new Set([1, 2, 3]));
        const callback = jest.fn();

        set.subscribe(callback);
        set.value.add(4);

        setTimeout(() => {
            expect(set.value.has(4)).toBe(true);
            expect(callback).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });
});

describe('Computed', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Reactive.resetSystem();
    });

    it('should create computed value from reactive dependency', () => {
        const count = reactive(5);
        const doubled = computed(() => count.value * 2);

        expect(doubled.value).toBe(10);
    });

    it('should update when dependency changes', (done) => {
        const count = reactive(5);
        const doubled = computed(() => count.value * 2);
        const callback = jest.fn();

        doubled.subscribe(callback);
        count.value = 10;

        setTimeout(() => {
            expect(doubled.value).toBe(20);
            expect(callback).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });

    it('should handle multiple dependencies', (done) => {
        const a = reactive(2);
        const b = reactive(3);
        const sum = computed(() => a.value + b.value);
        const callback = jest.fn();

        sum.subscribe(callback);
        expect(sum.value).toBe(5);

        a.value = 5;

        setTimeout(() => {
            expect(sum.value).toBe(8);
            expect(callback).toHaveBeenCalledTimes(1);

            b.value = 7;

            setTimeout(() => {
                expect(sum.value).toBe(12);
                expect(callback).toHaveBeenCalledTimes(2);
                done();
            }, 10);
        }, 10);
    });

    it('should handle object property dependencies', (done) => {
        const stats = reactive({
            components: 5,
            linesOfCode: 100
        });
        const total = computed(() => stats.value.components + stats.value.linesOfCode);
        const callback = jest.fn();

        total.subscribe(callback);
        expect(total.value).toBe(105);

        stats.value = {
            components: 7,
            linesOfCode: 850
        };

        setTimeout(() => {
            expect(total.value).toBe(857);
            expect(callback).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });

    it('should not recompute if dependencies have not changed', () => {
        const count = reactive(5);
        const computeFn = jest.fn(() => count.value * 2);
        const doubled = computed(computeFn);

        doubled.value;
        doubled.value;
        doubled.value;

        expect(computeFn).toHaveBeenCalledTimes(1);
    });

    it('should recompute when invalidated', (done) => {
        const count = reactive(5);
        const computeFn = jest.fn(() => count.value * 2);
        const doubled = computed(computeFn);

        doubled.value;
        count.value = 10;

        setTimeout(() => {
            doubled.value;
            expect(computeFn).toHaveBeenCalledTimes(2);
            done();
        }, 10);
    });

    it('should batch computed updates with reactive updates', (done) => {
        const a = reactive(1);
        const b = reactive(2);
        const sum = computed(() => a.value + b.value);
        const product = computed(() => a.value * b.value);
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        sum.subscribe(callback1);
        product.subscribe(callback2);

        a.value = 3;
        b.value = 4;

        setTimeout(() => {
            expect(sum.value).toBe(7);
            expect(product.value).toBe(12);
            expect(callback1).toHaveBeenCalledTimes(1);
            expect(callback2).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });
});

describe('Computed Edge Cases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Reactive.resetSystem();
    });

    it('should handle conditional dependencies', (done) => {
        const condition = reactive(true);
        const a = reactive(1);
        const b = reactive(2);

        const conditional = computed(() => {
            return condition.value ? a.value : b.value;
        });

        const callback = jest.fn();
        conditional.subscribe(callback);

        expect(conditional.value).toBe(1);

        a.value = 10;

        setTimeout(() => {
            expect(conditional.value).toBe(10);
            expect(callback).toHaveBeenCalledTimes(1);

            condition.value = false;

            setTimeout(() => {
                expect(conditional.value).toBe(2);
                expect(callback).toHaveBeenCalledTimes(2);

                a.value = 20;

                setTimeout(() => {
                    expect(conditional.value).toBe(2);
                    expect(callback).toHaveBeenCalledTimes(2);

                    b.value = 30;

                    setTimeout(() => {
                        expect(conditional.value).toBe(30);
                        expect(callback).toHaveBeenCalledTimes(3);
                        done();
                    }, 10);
                }, 10);
            }, 10);
        }, 10);
    });

    it('should handle computed with no dependencies', (done) => {
        const constant = computed(() => 42);
        const callback = jest.fn();

        constant.subscribe(callback);
        expect(constant.value).toBe(42);

        setTimeout(() => {
            expect(callback).not.toHaveBeenCalled();
            done();
        }, 10);
    });


    it('should handle computed that throws errors', (done) => {
        const error = reactive(false);
        const faultyComputed = computed(() => {
            if (error.value) {
                throw new Error('Computation failed');
            }
            return 'success';
        });

        expect(faultyComputed.value).toBe('success');

        error.value = true;

        setTimeout(() => {
            expect(() => faultyComputed.value).toThrow('Computation failed');
            done();
        }, 10);
    });

    it('should handle deeply nested computed chains', (done) => {
        const base = reactive(1);
        const level1 = computed(() => base.value * 2);
        const level2 = computed(() => level1.value * 2);
        const level3 = computed(() => level2.value * 2);
        const level4 = computed(() => level3.value * 2);

        const callback = jest.fn();
        level4.subscribe(callback);

        expect(level4.value).toBe(16);

        base.value = 2;

        setTimeout(() => {
            expect(level4.value).toBe(32);
            expect(callback).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });


});

describe('Performance Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Reactive.resetSystem();
    });

    it('should handle many subscribers efficiently', (done) => {
        const count = reactive(0);
        const callbacks = Array.from({ length: 1000 }, () => jest.fn());

        callbacks.forEach(callback => count.subscribe(callback));

        count.value = 1;

        setTimeout(() => {
            callbacks.forEach(callback => {
                expect(callback).toHaveBeenCalledTimes(1);
            });
            done();
        }, 10);
    });

    it('should handle large object updates efficiently', (done) => {
        const largeObject = reactive(
            Object.fromEntries(
                Array.from({ length: 1000 }, (_, i) => [`key${i}`, i])
            )
        );
        const callback = jest.fn();

        largeObject.subscribe(callback);

        largeObject.value = Object.fromEntries(
            Array.from({ length: 1000 }, (_, i) => [`key${i}`, i * 2])
        );

        setTimeout(() => {
            expect(callback).toHaveBeenCalledTimes(1);
            expect(largeObject.value.key999).toBe(1998);
            done();
        }, 10);
    });

    it('should batch many rapid updates', (done) => {
        const counter = reactive(0);
        const callback = jest.fn();

        counter.subscribe(callback);

        for (let i = 1; i <= 100; i++) {
            counter.value = i;
        }

        setTimeout(() => {
            expect(counter.value).toBe(100);
            expect(callback).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });
});

describe('Memory Management', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Reactive.resetSystem();
    });

    it('should clean up subscriptions when unsubscribed', () => {
        const count = reactive(0);
        const callback = jest.fn();

        const unsubscribe = count.subscribe(callback);
        expect(count['subscribers'].size).toBe(1);

        unsubscribe();
        expect(count['subscribers'].size).toBe(0);
    });

    it('should clean up computed dependencies correctly', () => {
        const base = reactive(1);
        const doubled = computed(() => base.value * 2);

        doubled.value;
        expect(doubled['dependencies'].size).toBeGreaterThan(0);
        const initialDependenciesSize = doubled['dependencies'].size;

        base.value = 2;
        doubled.value;


        expect(doubled['dependencies'].size).toBe(initialDependenciesSize);
    });

    it('should handle memory cleanup for unused computeds', (done) => {
        const base = reactive(1);
        const unused = computed(() => base.value * 2);
        const callback = jest.fn();

        unused.subscribe(callback);

        base.value = 2;

        setTimeout(() => {
            expect(callback).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });
});

describe('Reactive Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Reactive.resetSystem();
    });

    it('should simulate About page scenario', (done) => {
        const stats = reactive({
            components: 0,
            linesOfCode: 0,
            buildTime: 0
        });

        const components = computed(() => stats.value.components);
        const linesOfCode = computed(() => stats.value.linesOfCode);
        const buildTime = computed(() => stats.value.buildTime);

        const componentsCallback = jest.fn();
        const linesCallback = jest.fn();
        const buildCallback = jest.fn();

        components.subscribe(componentsCallback);
        linesOfCode.subscribe(linesCallback);
        buildTime.subscribe(buildCallback);

        expect(components.value).toBe(0);
        expect(linesOfCode.value).toBe(0);
        expect(buildTime.value).toBe(0);

        stats.value = {
            components: 7,
            linesOfCode: 850,
            buildTime: 45
        };

        setTimeout(() => {
            expect(components.value).toBe(7);
            expect(linesOfCode.value).toBe(850);
            expect(buildTime.value).toBe(45);
            expect(componentsCallback).toHaveBeenCalledTimes(1);
            expect(linesCallback).toHaveBeenCalledTimes(1);
            expect(buildCallback).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });

    it('should handle rapid successive updates', (done) => {
        const count = reactive(0);
        const doubled = computed(() => count.value * 2);
        const callback = jest.fn();

        doubled.subscribe(callback);

        for (let i = 1; i <= 10; i++) {
            count.value = i;
        }

        setTimeout(() => {
            expect(count.value).toBe(10);
            expect(doubled.value).toBe(20);
            expect(callback).toHaveBeenCalledTimes(1);
            done();
        }, 10);
    });

    it('should clean up dependencies correctly', (done) => {
        const a = reactive(1);
        const b = reactive(2);
        const useA = reactive(true);

        const conditional = computed(() => {
            return useA.value ? a.value : b.value;
        });

        const callback = jest.fn();
        conditional.subscribe(callback);

        expect(conditional.value).toBe(1);

        a.value = 5;

        setTimeout(() => {
            expect(conditional.value).toBe(5);
            expect(callback).toHaveBeenCalledTimes(1);

            useA.value = false;

            setTimeout(() => {
                expect(conditional.value).toBe(2);
                expect(callback).toHaveBeenCalledTimes(2);

                b.value = 10;

                setTimeout(() => {
                    expect(conditional.value).toBe(10);
                    expect(callback).toHaveBeenCalledTimes(3);
                    done();
                }, 10);
            }, 10);
        }, 10);
    });
});