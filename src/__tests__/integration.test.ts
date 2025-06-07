import { describe, it, expect, beforeEach } from '@jest/globals';
import { reactive, Reactive } from '../reactive';
import { ComponentLifecycle } from '../lifecycle';
import { Router } from '../router';
import { h, clearAllReactiveSubscriptions } from '../jsx';

describe('Integration Tests', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
        window.location.hash = '';

        // Reset reactive system state
        Reactive.resetSystem();
        clearAllReactiveSubscriptions();

        (ComponentLifecycle as any).currentComponentId = 0;
        (ComponentLifecycle as any).componentCallbacks = new Map();
        (ComponentLifecycle as any).activeComponents = new Set();
    });

    it('should integrate reactive state with JSX and lifecycle', (done) => {
        const count = reactive(0);
        let mountCalled = false;
        let unmountCalled = false;

        const TestComponent = () => {
            ComponentLifecycle.onMount(() => {
                mountCalled = true;
            });

            ComponentLifecycle.onUnmount(() => {
                unmountCalled = true;
            });

            return h('div', null, 'Count: ', count);
        };

        const router = new Router();
        router.addRoute('/', () => TestComponent());
        router.addRoute('/other', () => h('div', null, 'Other'));

        router.navigate('/');

        setTimeout(() => {
            expect(mountCalled).toBe(true);
            expect(document.querySelector('#app')?.textContent).toBe('Count: 0');

            count.value = 5;

            setTimeout(() => {
                expect(document.querySelector('#app')?.textContent).toBe('Count: 5');

                router.navigate('/other');

                setTimeout(() => {
                    expect(unmountCalled).toBe(true);
                    expect(document.querySelector('#app')?.textContent).toBe('Other');
                    done();
                }, 50);
            }, 50);
        }, 50);
    });

});