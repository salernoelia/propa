import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ComponentLifecycle } from '../lifecycle';

describe('ComponentLifecycle', () => {
    beforeEach(() => {
        (ComponentLifecycle as any).currentComponentId = 0;
        (ComponentLifecycle as any).componentCallbacks = new Map();
        (ComponentLifecycle as any).activeComponents = new Set();
    });

    it('should execute onMount callbacks', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        ComponentLifecycle.onMount(callback1);
        ComponentLifecycle.onMount(callback2);
        ComponentLifecycle.executeOnMount();

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should execute onUnmount callbacks', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();

        ComponentLifecycle.onUnmount(callback1);
        ComponentLifecycle.onUnmount(callback2);
        ComponentLifecycle.executeOnUnmount();

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should handle component-specific lifecycle', () => {
        const mountCallback = jest.fn();
        const unmountCallback = jest.fn();

        const componentId = ComponentLifecycle.createComponent();
        ComponentLifecycle.onMount(mountCallback, componentId);
        ComponentLifecycle.onUnmount(unmountCallback, componentId);

        ComponentLifecycle.executeOnMount(componentId);
        expect(mountCallback).toHaveBeenCalledTimes(1);

        ComponentLifecycle.executeOnUnmount(componentId);
        expect(unmountCallback).toHaveBeenCalledTimes(1);
    });

    it('should clear callbacks after execution', () => {
        const callback = jest.fn();

        ComponentLifecycle.onMount(callback);
        ComponentLifecycle.executeOnMount();
        ComponentLifecycle.executeOnMount();

        expect(callback).toHaveBeenCalledTimes(1);
    });
});