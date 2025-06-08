import { Reactive } from './reactive';
import { ComponentLifecycle } from './lifecycle';

const globalCleanupCallbacks: (() => void)[] = [];

export function clearAllReactiveSubscriptions() {
    globalCleanupCallbacks.forEach(cleanup => cleanup());
    globalCleanupCallbacks.length = 0;
}

export function h(tag: string | Function, props: any, ...children: any[]): HTMLElement {
    if (typeof tag === 'function') {
        return tag({ ...props, children: children.length === 1 ? children[0] : children });
    }

    const element = document.createElement(tag);
    const cleanupCallbacks: (() => void)[] = [];

    if (props) {
        Object.keys(props).forEach(key => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                element.addEventListener(key.substring(2).toLowerCase(), props[key]);
            } else if (key === 'className') {
                element.className = props[key];
            } else if (key === 'ref' && typeof props[key] === 'function') {
                props[key](element);
            } else {
                element.setAttribute(key, props[key]);
            }
        });
    }

    children.flat().forEach(child => {
        if (child instanceof Reactive) {
            const textNode = document.createTextNode(String(child.value));
            const unsubscribe = child.subscribe(() => {
                textNode.textContent = String(child.value);
            });
            cleanupCallbacks.push(unsubscribe);
            globalCleanupCallbacks.push(unsubscribe);
            element.appendChild(textNode);
        } else if (typeof child === 'string' || typeof child === 'number') {
            element.appendChild(document.createTextNode(String(child)));
        } else if (child instanceof HTMLElement) {
            element.appendChild(child);
        }
    });

    if (cleanupCallbacks.length > 0) {
        ComponentLifecycle.onUnmount(() => {
            cleanupCallbacks.forEach(cleanup => cleanup());
        });
    }

    return element;
}