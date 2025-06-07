import { jest } from "@jest/globals";

global.requestAnimationFrame = (cb: FrameRequestCallback) => {
    return setTimeout(cb, 0);
};

global.cancelAnimationFrame = (id: number) => {
    clearTimeout(id);
};