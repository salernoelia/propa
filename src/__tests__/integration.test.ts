import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { reactive } from '../reactive';
import { ComponentLifecycle } from '../lifecycle';
import { h } from '../jsx';

const setupDOM = () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    return app;
};

describe('Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
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

            return h('div', null, `Count: ${count.value}`);
        };

        const app = setupDOM();
        const component = TestComponent() as HTMLElement;
        app.appendChild(component);

        ComponentLifecycle.executeOnMount();

        setTimeout(() => {
            expect(mountCalled).toBe(true);
            expect(app.textContent).toBe('Count: 0');

            count.value = 5;

            setTimeout(() => {
                expect(count.value).toBe(5);

                ComponentLifecycle.executeOnUnmount();
                expect(unmountCalled).toBe(true);
                done();
            }, 20);
        }, 10);
    });
});