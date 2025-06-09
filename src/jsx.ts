import { ComponentLifecycle } from './lifecycle';

const globalCleanupCallbacks: (() => void)[] = [];

export function clearAllReactiveSubscriptions() {
    globalCleanupCallbacks.forEach(cleanup => cleanup());
    globalCleanupCallbacks.length = 0;
}

export function h(
    tag: string | Function,
    props: Record<string, any> | null,
    ...children: any[]
): HTMLElement | DocumentFragment {
    if (typeof tag === 'function') {
        return tag({ ...props, children: children.length ? children : undefined });
    }

    const element = document.createElement(tag);
    const cleanupCallbacks: (() => void)[] = [];

    if (props) {
        Object.entries(props).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'ref' && typeof value === 'function') {
                value(element);
            } else if (key.startsWith('on') && typeof value === 'function') {
                const eventName = key.slice(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else if (key !== 'children' && key !== 'ref') {
                element.setAttribute(key, value);
            }
        });
    }

    const processedChildren = flattenChildren(children);
    processedChildren.forEach(child => {
        if (child != null && child !== false) {
            if (typeof child === 'string' || typeof child === 'number') {
                element.appendChild(document.createTextNode(String(child)));
            } else if (child instanceof HTMLElement || child instanceof DocumentFragment) {
                element.appendChild(child);
            } else if (child && typeof child === 'object' && 'value' in child && 'subscribe' in child) {
                const textNode = document.createTextNode(String(child.value));
                element.appendChild(textNode);

                const cleanup = child.subscribe(() => {
                    textNode.textContent = String(child.value);
                });
                cleanupCallbacks.push(cleanup);
            } else if (child && typeof child === 'object' && child.type === 'conditional') {
                const placeholder = document.createComment('conditional');
                element.appendChild(placeholder);

                const cleanup = child.condition.subscribe(() => {
                    const nextSibling = placeholder.nextSibling;
                    while (nextSibling && nextSibling !== placeholder.parentNode?.children[Array.from(placeholder.parentNode.children).indexOf(placeholder as any) + 1]) {
                        if (nextSibling.nodeType !== 8) {
                            nextSibling.remove();
                            break;
                        }
                    }

                    if (child.condition.value) {
                        const newElement = child.element;
                        placeholder.parentNode?.insertBefore(newElement, placeholder.nextSibling);
                    }
                });
                cleanupCallbacks.push(cleanup);

                if (child.condition.value) {
                    placeholder.parentNode?.insertBefore(child.element, placeholder.nextSibling);
                }
            }
        }
    });

    if (cleanupCallbacks.length > 0) {
        ComponentLifecycle.onUnmount(() => {
            cleanupCallbacks.forEach(cleanup => cleanup());
        });
    }

    return element;
}

function flattenChildren(children: any[]): any[] {
    const result: any[] = [];

    children.forEach(child => {
        if (child === null || child === undefined || child === false) {
            return;
        }

        if (Array.isArray(child)) {
            result.push(...flattenChildren(child));
        } else {
            result.push(child);
        }
    });

    return result;
}

export function when(condition: any, element: any) {
    if (condition && typeof condition === 'object' && 'value' in condition && 'subscribe' in condition) {
        return {
            type: 'conditional',
            condition,
            element
        };
    }
    return condition ? element : null;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            div: any;
            span: any;
            p: any;
            h1: any;
            h2: any;
            h3: any;
            h4: any;
            h5: any;
            h6: any;
            button: any;
            input: any;
            form: any;
            a: any;
            img: any;
            ul: any;
            li: any;
            strong: any;
        }
        interface Element extends HTMLElement { }
        interface ElementClass {
            render(): HTMLElement;
        }
    }
}