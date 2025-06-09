import p5 from 'p5';
import { ComponentLifecycle } from './lifecycle';
import { h } from './jsx';

export interface P5Props {
    sketch: (p: p5) => void;
    containerStyle?: string;
    containerClass?: string;
}

export function createP5Sketch(props: P5Props): HTMLElement {
    const { sketch, containerStyle, containerClass } = props;
    let p5Instance: p5 | null = null;
    const componentId = ComponentLifecycle.createComponent();

    const element = h('div', {
        className: containerClass,
        style: containerStyle,
        ref: (el: HTMLElement) => {
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
        }
    }) as HTMLElement;

    return element;
}