import { describe, expect, it, jest } from '@jest/globals';
import { createP5Sketch } from '../p5';
import { ComponentLifecycle } from '../lifecycle';
jest.mock('p5', () => {
    return jest.fn().mockImplementation(() => {
        return {
            remove: jest.fn()
        };
    });
});

describe('P5 integration', () => {
    it('should create a p5 sketch with proper lifecycle', () => {
        const p5 = require('p5');
        const mockSketch = jest.fn();
        const sketchComponent = createP5Sketch(mockSketch, { width: 500, height: 300 });
        const mockEl = sketchComponent;
        ComponentLifecycle.executeOnMount();
        expect(p5).toHaveBeenCalledWith(mockSketch, mockEl);
        ComponentLifecycle.executeOnUnmount();
        expect(p5.mock.results[0].value.remove).toHaveBeenCalled();
    });
});