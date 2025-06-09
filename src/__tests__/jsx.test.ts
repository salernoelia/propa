import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { h, clearAllReactiveSubscriptions, when } from '../jsx';
import { reactive, Reactive } from '../reactive';
import { ComponentLifecycle } from '../lifecycle';

if (!global.document) {
    Object.defineProperty(global, 'document', {
        value: {
            createElement: (tag: string) => ({
                tagName: tag.toUpperCase(),
                className: '',
                textContent: '',
                setAttribute: function (key: string, value: any) { (this as any)[key] = value; },
                addEventListener: function (event: string, handler: Function) {
                    (this as any)[`on${event}`] = handler;
                },
                appendChild: function (child: any) {
                    if (!this.children) this.children = [];
                    this.children.push(child);
                    if (child.nodeType === 3) {
                        this.textContent = (this.textContent || '') + child.textContent;
                    }
                },
                children: [] as any[]
            }),
            createTextNode: (text: string) => ({ nodeType: 3, textContent: text })
        }
    });
}

describe('JSX (h function)', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        Reactive.resetSystem();
        clearAllReactiveSubscriptions();
    });

    it('should create basic HTML elements', () => {
        const element = h('div', null, 'Hello World') as HTMLElement;

        expect(element.tagName).toBe('DIV');
        expect(element.textContent).toBe('Hello World');
    });

    it('should handle props correctly', () => {
        const element = h('div', {
            className: 'test-class',
            id: 'test-id',
            'data-test': 'value'
        }) as HTMLElement;

        expect(element.className).toBe('test-class');
        expect(element.id).toBe('test-id');
        expect(element.getAttribute('data-test')).toBe('value');
    });

    it('should handle event listeners', () => {
        const clickHandler = jest.fn();
        const element = h('button', { onClick: clickHandler }, 'Click me') as HTMLButtonElement;

        element.click();
        expect(clickHandler).toHaveBeenCalledTimes(1);
    });

    it('should handle ref callbacks', () => {
        const refCallback = jest.fn();
        const element = h('input', { ref: refCallback });

        expect(refCallback).toHaveBeenCalledWith(element);
    });

    it('should handle reactive children', (done) => {
        const count = reactive(0);
        const element = h('div', null, 'Count: ', count);

        expect(element.textContent).toBe('Count: 0');

        count.value = 5;

        setTimeout(() => {
            expect(element.textContent).toBe('Count: 5');
            done();
        }, 10);
    });

    it('should handle reactive values in JSX expressions', (done) => {
        const count = reactive(0);

        const element = h('div', null, count);

        expect(element.textContent).toBe('0');

        count.value = 42;

        setTimeout(() => {
            expect(element.textContent).toBe('42');
            done();
        }, 10);
    });

    it('should handle reactive objects directly in JSX', (done) => {
        const count = reactive(0);

        const element = h('div', null, count);

        expect(element.textContent).toBe('0');

        count.value = 42;

        setTimeout(() => {
            expect(element.textContent).toBe('42');
            done();
        }, 10);
    });

    it('should handle nested elements', () => {
        const element = h('div', null,
            h('h1', null, 'Title'),
            h('p', null, 'Paragraph')
        );

        expect(element.children.length).toBe(2);
        expect(element.children[0].tagName).toBe('H1');
        expect(element.children[1].tagName).toBe('P');
    });

    it('should handle function components', () => {
        const TestComponent = ({ name }: { name: string }) => {
            return h('div', null, `Hello ${name}`);
        };

        const element = h(TestComponent, { name: 'World' });
        expect(element.textContent).toBe('Hello World');
    });
});

describe('JSX with Conditional Rendering', () => {
    it('should create basic element', () => {
        const element = h('div', { className: 'test' }) as HTMLElement;
        expect(element.tagName).toBe('DIV');
        expect(element.className).toBe('test');
    });

    it('should handle conditional rendering with boolean values', () => {
        const showContent = true;
        const element = h('div', null,
            showContent && h('span', null, 'Visible'),
            !showContent && h('span', null, 'Hidden')
        ) as HTMLElement;

        expect(element.children).toHaveLength(1);
        expect((element.children[0] as any).tagName).toBe('SPAN');
    });

    it('should filter out false values', () => {
        const element = h('div', null,
            false,
            null,
            undefined,
            'visible text',
            true && 'conditional text'
        ) as HTMLElement;

        expect(element.textContent).toBe('visible textconditional text');
    });

    it('should handle arrays from map operations', () => {
        const items = ['a', 'b', 'c'];
        const element = h('ul', null,
            items.map(item => h('li', null, item))
        ) as HTMLElement;

        expect(element.children).toHaveLength(3);
        expect((element.children[0] as HTMLElement).tagName).toBe('LI');
    });

    it('should handle nested conditional rendering', () => {
        const showSection = true;
        const showItems = false;

        const element = h('div', null,
            showSection && h('section', null,
                h('h1', null, 'Title'),
                showItems && h('ul', null, h('li', null, 'Item'))
            )
        ) as HTMLElement;

        expect(element.children).toHaveLength(1);
        const section = element.children[0] as HTMLElement;
        expect(section.tagName).toBe('SECTION');
    });
});


describe('Memory Leak Prevention', () => {
    it('should clean up reactive subscriptions when component unmounts', () => {
        const count = reactive(0);

        let subscriptionCallCount = 0;

        const originalSubscribe = count.subscribe;
        count.subscribe = jest.fn((callback: () => void) => {
            const cleanup = originalSubscribe.call(count, () => {
                subscriptionCallCount++;
                callback();
            });
            return cleanup;
        });

        const element = h('div', null, count);

        expect(element.textContent).toBe('0');
        expect(subscriptionCallCount).toBe(0);

        count.value = 1;

        return new Promise<void>((resolve) => {
            setTimeout(() => {
                expect(element.textContent).toBe('1');
                expect(subscriptionCallCount).toBe(1);

                ComponentLifecycle.executeOnUnmount();

                count.value = 2;

                setTimeout(() => {
                    expect(element.textContent).toBe('1');
                    expect(subscriptionCallCount).toBe(1);
                    resolve();
                }, 10);
            }, 10);
        });
    });

    it('should clean up multiple reactive subscriptions', () => {
        const count1 = reactive(0);
        const count2 = reactive(10);

        let subscription1CallCount = 0;
        let subscription2CallCount = 0;

        const originalSubscribe1 = count1.subscribe;
        count1.subscribe = jest.fn((callback: () => void) => {
            const cleanup = originalSubscribe1.call(count1, () => {
                subscription1CallCount++;
                callback();
            });
            return cleanup;
        });

        const originalSubscribe2 = count2.subscribe;
        count2.subscribe = jest.fn((callback: () => void) => {
            const cleanup = originalSubscribe2.call(count2, () => {
                subscription2CallCount++;
                callback();
            });
            return cleanup;
        });

        const element = h('div', null,
            'Count1: ', count1,
            ' Count2: ', count2
        );

        expect(element.textContent).toBe('Count1: 0 Count2: 10');

        count1.value = 1;
        count2.value = 11;

        return new Promise<void>((resolve) => {
            setTimeout(() => {
                expect(element.textContent).toBe('Count1: 1 Count2: 11');
                expect(subscription1CallCount).toBe(1);
                expect(subscription2CallCount).toBe(1);

                ComponentLifecycle.executeOnUnmount();

                count1.value = 2;
                count2.value = 12;

                setTimeout(() => {
                    expect(element.textContent).toBe('Count1: 1 Count2: 11');
                    expect(subscription1CallCount).toBe(1);
                    expect(subscription2CallCount).toBe(1);
                    resolve();
                }, 10);
            }, 10);
        });
    });

    it('should clean up conditional reactive subscriptions', () => {
        const condition = reactive(true);
        const count = reactive(0);

        let conditionCallCount = 0;

        const originalSubscribe = condition.subscribe;
        condition.subscribe = jest.fn((callback: () => void) => {
            const cleanup = originalSubscribe.call(condition, () => {
                conditionCallCount++;
                callback();
            });
            return cleanup;
        });

        const element = h('div', null,
            when(condition, h('span', null, count))
        );

        expect(element.children.length).toBeGreaterThan(0);

        condition.value = false;

        return new Promise<void>((resolve) => {
            setTimeout(() => {
                expect(conditionCallCount).toBe(1);

                ComponentLifecycle.executeOnUnmount();

                condition.value = true;

                setTimeout(() => {
                    expect(conditionCallCount).toBe(1);
                    resolve();
                }, 10);
            }, 10);
        });
    });

    it('should not interfere with new components after cleanup', () => {
        const count1 = reactive(0);

        const element1 = h('div', null, count1);
        expect(element1.textContent).toBe('0');

        ComponentLifecycle.executeOnUnmount();

        const count2 = reactive(5);
        const element2 = h('div', null, count2);
        expect(element2.textContent).toBe('5');

        count2.value = 10;

        return new Promise<void>((resolve) => {
            setTimeout(() => {
                expect(element2.textContent).toBe('10');
                expect(element1.textContent).toBe('0');
                resolve();
            }, 10);
        });
    });

    it('should handle malformed reactive objects', () => {
        const malformedReactive = { value: 42 };

        expect(() => {
            h('div', null, malformedReactive);
        }).not.toThrow();
    });

    it('should handle circular references in children', () => {
        const circularRef: any = {};
        circularRef.self = circularRef;

        expect(() => {
            h('div', null, circularRef);
        }).not.toThrow();
    });

    it('should handle very deeply nested elements', () => {
        let element = h('div', null, 'deep');
        for (let i = 0; i < 100; i++) {
            element = h('div', null, element);
        }

        expect(element).toBeDefined();
    });
});