export type LifecycleCallback = () => void;

export class ComponentLifecycle {
    private static currentComponentId = 0;
    private static componentCallbacks = new Map<number, {
        mount: LifecycleCallback[];
        unmount: LifecycleCallback[];
    }>();
    private static activeComponents = new Set<number>();

    static createComponent(): number {
        const id = ++this.currentComponentId;
        this.componentCallbacks.set(id, { mount: [], unmount: [] });
        this.activeComponents.add(id);
        return id;
    }

    static onMount(callback: LifecycleCallback, componentId?: number) {
        if (componentId) {
            this.componentCallbacks.get(componentId)?.mount.push(callback);
        } else {
            this.getOrCreateGlobalComponent().mount.push(callback);
        }
    }

    static onUnmount(callback: LifecycleCallback, componentId?: number) {
        if (componentId) {
            this.componentCallbacks.get(componentId)?.unmount.push(callback);
        } else {
            this.getOrCreateGlobalComponent().unmount.push(callback);
        }
    }

    static executeOnMount(componentId?: number) {
        if (componentId) {
            const callbacks = this.componentCallbacks.get(componentId);
            callbacks?.mount.forEach(callback => callback());
            if (callbacks) callbacks.mount = [];
        } else {
            this.activeComponents.forEach(id => {
                const callbacks = this.componentCallbacks.get(id);
                callbacks?.mount.forEach(callback => callback());
                if (callbacks) callbacks.mount = [];
            });
        }
    }

    static executeOnUnmount(componentId?: number) {
        if (componentId) {
            const callbacks = this.componentCallbacks.get(componentId);
            callbacks?.unmount.forEach(callback => callback());
            this.componentCallbacks.delete(componentId);
            this.activeComponents.delete(componentId);
        } else {
            this.activeComponents.forEach(id => {
                const callbacks = this.componentCallbacks.get(id);
                callbacks?.unmount.forEach(callback => callback());
            });
            this.componentCallbacks.clear();
            this.activeComponents.clear();
        }
    }

    private static getOrCreateGlobalComponent() {
        if (!this.componentCallbacks.has(0)) {
            this.componentCallbacks.set(0, { mount: [], unmount: [] });
            this.activeComponents.add(0);
        }
        return this.componentCallbacks.get(0)!;
    }
}