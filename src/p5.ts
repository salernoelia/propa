import { h } from './index';
import { ComponentLifecycle } from './lifecycle';
import p5 from 'p5';

export interface P5Props {
    width?: number;
    height?: number;
    style?: Record<string, string>;
    className?: string;
}

export const createP5Sketch = (
    sketch: (p: p5) => void,
    props: P5Props = {}
) => {
    let p5Instance: p5 | null = null;
    const componentId = ComponentLifecycle.createComponent();

    const containerRef = (el: HTMLDivElement | null) => {
        if (el) {
            ComponentLifecycle.onMount(() => {
                p5Instance = new p5(sketch, el);
            }, componentId);

            ComponentLifecycle.onUnmount(() => {
                if (p5Instance) {
                    p5Instance.remove();
                    p5Instance = null;
                }
            }, componentId);
        }
    };

    setTimeout(() => {
        ComponentLifecycle.executeOnMount(componentId);
    }, 0);

    return h('div', {
        ref: containerRef,
        style: props.style,
        class: props.className
    });
};