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


    it('should handle p5 sketch errors gracefully', () => {
        const faultySketch = jest.fn(() => {
            throw new Error('Sketch error');
        });

        expect(() => {
            createP5Sketch({ sketch: faultySketch });
        }).not.toThrow();
    });

    it('should handle multiple p5 instances', () => {
        const sketch1 = jest.fn();
        const sketch2 = jest.fn();

        const component1 = createP5Sketch({ sketch: sketch1 });
        const component2 = createP5Sketch({ sketch: sketch2 });

        ComponentLifecycle.executeOnMount();
        ComponentLifecycle.executeOnUnmount();

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