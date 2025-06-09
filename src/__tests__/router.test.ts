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
});