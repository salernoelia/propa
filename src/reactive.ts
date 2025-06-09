export class Reactive<T> {
    private _value: T;
    private subscribers: Set<() => void> = new Set();
    private static pendingUpdates = new Set<Reactive<any>>();
    private static isUpdating = false;
    public static currentComputation: ComputedReactive<any> | null = null;

    constructor(initialValue: T) {
        this._value = this.makeReactive(initialValue);
    }

    static resetSystem() {
        Reactive.pendingUpdates.clear();
        Reactive.isUpdating = false;
        ComputedReactive.resetSystem();
    }

    get value(): T {
        if (Reactive.currentComputation) {
            const currentComp = Reactive.currentComputation;
            const unsubscribe = this.subscribe(() => {
                currentComp.invalidate();
            });
            currentComp.addDependency(unsubscribe);
        }
        return this._value;
    }

    set value(newValue: T) {
        if (typeof newValue !== 'object' || newValue === null) {
            if (this._value === newValue) {
                return;
            }
        }

        const reactiveValue = this.makeReactive(newValue);
        this._value = reactiveValue;
        this.scheduleUpdate();
    }

    private makeReactive(obj: T): T {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        const self = this;
        return new Proxy(obj as any, {
            get(target, prop, receiver) {
                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {
                const result = Reflect.set(target, prop, value, receiver);
                self.scheduleUpdate();
                return result;
            }
        }) as T;
    }

    subscribe(callback: () => void): () => void {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    private scheduleUpdate() {
        Reactive.pendingUpdates.add(this);
        if (!Reactive.isUpdating) {
            Reactive.isUpdating = true;
            if (typeof window !== 'undefined') {
                requestAnimationFrame(() => Reactive.flushUpdates());
            } else {
                setTimeout(() => Reactive.flushUpdates(), 0);
            }
        }
    }

    private static flushUpdates() {
        const pendingReactives = Array.from(Reactive.pendingUpdates);
        Reactive.pendingUpdates.clear();
        Reactive.isUpdating = false;

        pendingReactives.forEach(reactive => {
            reactive.notify();
        });

        ComputedReactive.flushPendingUpdates();
    }

    private notify() {
        this.subscribers.forEach(callback => callback());
    }
}

export class ComputedReactive<T> {
    private _value: T;
    private _valid = false;
    private subscribers: Set<() => void> = new Set();
    private dependencies: Set<() => void> = new Set();
    private static pendingComputeds = new Set<ComputedReactive<any>>();
    private static isFlushingComputeds = false;

    constructor(private computation: () => T) {
        this._value = this.compute();
    }

    static resetSystem() {
        ComputedReactive.pendingComputeds.clear();
        ComputedReactive.isFlushingComputeds = false;
    }

    static flushPendingUpdates() {
        if (ComputedReactive.isFlushingComputeds || ComputedReactive.pendingComputeds.size === 0) {
            return;
        }

        ComputedReactive.isFlushingComputeds = true;
        const pendingComputeds = Array.from(ComputedReactive.pendingComputeds);
        ComputedReactive.pendingComputeds.clear();

        pendingComputeds.forEach(computed => {
            computed.subscribers.forEach(callback => callback());
        });

        ComputedReactive.isFlushingComputeds = false;
    }

    get value(): T {
        if (!this._valid) {
            this._value = this.compute();
        }
        return this._value;
    }

    addDependency(unsubscribe: () => void) {
        this.dependencies.add(unsubscribe);
    }

    private compute(): T {
        this.dependencies.forEach(unsubscribe => unsubscribe());
        this.dependencies.clear();

        const oldComputation = Reactive.currentComputation;
        Reactive.currentComputation = this;

        try {
            const result = this.computation();
            this._valid = true;
            return result;
        } finally {
            Reactive.currentComputation = oldComputation;
        }
    }

    invalidate() {
        if (this._valid) {
            this._valid = false;
            ComputedReactive.pendingComputeds.add(this);
        }
    }

    subscribe(callback: () => void): () => void {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
}

export function reactive<T>(initialValue: T): Reactive<T> {
    return new Reactive(initialValue);
}

export function computed<T>(computation: () => T): ComputedReactive<T> {
    return new ComputedReactive(computation);
}