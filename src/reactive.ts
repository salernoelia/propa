export class Reactive<T> {
    private _value: T;
    private subscribers: Set<() => void> = new Set();
    private static pendingUpdates = new Set<Reactive<any>>();
    private static isUpdating = false;
    private static pendingTimeoutId: any = null;

    constructor(initialValue: T) {
        this._value = initialValue;
    }

    static resetSystem() {
        Reactive.pendingUpdates.clear();
        Reactive.isUpdating = false;
        if (Reactive.pendingTimeoutId !== null) {
            clearTimeout(Reactive.pendingTimeoutId);
            Reactive.pendingTimeoutId = null;
        }
    }

    get value(): T {
        return this._value;
    }

    set value(newValue: T) {
        if (this._value !== newValue) {
            this._value = newValue;
            this.scheduleUpdate();
        }
    }

    subscribe(callback: () => void): () => void {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    private scheduleUpdate() {
        Reactive.pendingUpdates.add(this);
        if (!Reactive.isUpdating) {
            Reactive.isUpdating = true;
            // Always use setTimeout in Jest environment for consistent timing
            const isTest = typeof jest !== 'undefined' || process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
            if (isTest) {
                Reactive.pendingTimeoutId = setTimeout(() => this.flushUpdates(), 0);
            } else {
                requestAnimationFrame(() => this.flushUpdates());
            }
        }
    }

    private flushUpdates() {
        const pendingReactives = Array.from(Reactive.pendingUpdates);
        Reactive.pendingUpdates.clear();
        Reactive.isUpdating = false;
        Reactive.pendingTimeoutId = null;

        pendingReactives.forEach(reactive => {
            reactive.notify();
        });
    }

    private notify() {
        this.subscribers.forEach(callback => callback());
    }
}

export function reactive<T>(initialValue: T): Reactive<T> {
    return new Reactive(initialValue);
}