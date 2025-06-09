import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { h, clearAllReactiveSubscriptions } from '../jsx';
import { reactive, Reactive } from '../reactive';

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

