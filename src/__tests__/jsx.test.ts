import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { h, clearAllReactiveSubscriptions } from '../jsx';
import { reactive, Reactive } from '../reactive';

describe('JSX (h function)', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        // Reset reactive system state
        Reactive.resetSystem();
        clearAllReactiveSubscriptions();
    });

    it('should create basic HTML elements', () => {
        const element = h('div', null, 'Hello World');

        expect(element.tagName).toBe('DIV');
        expect(element.textContent).toBe('Hello World');
    });

    it('should handle props correctly', () => {
        const element = h('div', {
            className: 'test-class',
            id: 'test-id',
            'data-test': 'value'
        });

        expect(element.className).toBe('test-class');
        expect(element.id).toBe('test-id');
        expect(element.getAttribute('data-test')).toBe('value');
    });

    it('should handle event listeners', () => {
        const clickHandler = jest.fn();
        const element = h('button', { onClick: clickHandler }, 'Click me');

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