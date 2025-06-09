import { describe, expect, it, jest } from '@jest/globals';
import { ComponentLifecycle } from '../lifecycle';
import { h } from '../jsx';
jest.mock('p5', () => {
    return jest.fn().mockImplementation(() => {
        return {
            remove: jest.fn()
        };
    });
});

interface P5Props {
    sketch: (p: any) => void;
    containerStyle?: string;
    containerClass?: string;
}

describe('P5 integration', () => {
    it('should create a p5 sketch with proper lifecycle', () => {
        const p5 = require('p5');
        const mockSketch = jest.fn();
        const sketchComponent = createP5Sketch({ sketch: mockSketch });
        const mockEl = sketchComponent;
        ComponentLifecycle.executeOnMount();
        expect(p5).toHaveBeenCalledWith(mockSketch, mockEl);
        ComponentLifecycle.executeOnUnmount();
        expect(p5.mock.results[0].value.remove).toHaveBeenCalled();
    });
});

export function createP5Sketch(props: P5Props): HTMLElement {
    const { sketch, containerStyle, containerClass } = props;
    let p5Instance: any = null;
    const componentId = ComponentLifecycle.createComponent();
    const p5 = require('p5');

    const element = h('div', {
        className: containerClass,
        style: containerStyle,
        ref: (el: HTMLElement) => {
            if (el) {
                ComponentLifecycle.onMount(() => {
                    p5Instance = new (p5 as any)(sketch, el);
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