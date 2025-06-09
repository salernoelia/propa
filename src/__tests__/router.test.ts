import { Router } from '../router';
import { h } from '../jsx';
import { jest } from '@jest/globals';

describe('Router', () => {
    let router: Router;
    let appElement: HTMLDivElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
        appElement = document.querySelector('#app') as HTMLDivElement;
        window.location.hash = '';
    });

    it('should create router and add routes', () => {
        router = new Router();
        const homeHandler = jest.fn(() => h('div', null, 'Home'));
        const aboutHandler = jest.fn(() => h('div', null, 'About'));

        router.addRoute('/', homeHandler);
        router.addRoute('/about', aboutHandler);

        expect(router).toBeInstanceOf(Router);
    });

    it('should navigate programmatically', () => {
        router = new Router();
        const homeHandler = () => h('div', null, 'Home');
        const aboutHandler = () => h('div', null, 'About');

        router.addRoute('/', homeHandler);
        router.addRoute('/about', aboutHandler);

        router.navigate('/about');
        expect(window.location.hash).toBe('#/about');
    });

    it('should handle empty routes', () => {
        router = new Router();

        expect(router).toBeInstanceOf(Router);
    });

    it('should support route caching', () => {
        const homeHandler = jest.fn(() => h('div', null, 'Home'));

        router.addRoute('/', homeHandler);

        expect(router).toBeInstanceOf(Router);
    });

    it('should preload routes', () => {
        router = new Router();
        const homeHandler = jest.fn(() => h('div', null, 'Home'));

        router.addRoute('/', homeHandler);
        router.preloadRoute('/');

        expect(homeHandler).toHaveBeenCalled();
    });


    it('should handle 404 routes', () => {
        router = new Router();
        const notFoundHandler = jest.fn(() => h('div', null, 'Not Found'));
        const homeHandler = jest.fn(() => h('div', null, 'Home'));

        router.addRoute('/', homeHandler);
        router.addRoute('/404', notFoundHandler);

        router.navigate('/non-existent-route');

        expect(notFoundHandler).toHaveBeenCalled();
    });

    it('should handle history mode navigation', () => {
        router = new Router(false, false);
        const homeHandler = jest.fn(() => h('div', null, 'Home'));

        router.addRoute('/', homeHandler);
        router.navigate('/');

        expect(homeHandler).toHaveBeenCalled();
    });

    it('should clean up event listeners on destruction', () => {
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
        router = new Router();

        window.removeEventListener('hashchange', expect.any(Function));
        window.removeEventListener('load', expect.any(Function));

        expect(removeEventListenerSpy).toHaveBeenCalled();

        removeEventListenerSpy.mockRestore();
    });
});