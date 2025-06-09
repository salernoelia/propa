import { ComponentLifecycle } from './lifecycle';


export class Router {
    private routes: Map<string, () => HTMLElement | DocumentFragment> = new Map();
    private currentRoute: string | null = null;
    private routeCache: Map<string, HTMLElement> = new Map();
    private enableCaching: boolean;
    private useHash: boolean;

    constructor(enableCaching = false, useHash = true) {
        this.enableCaching = enableCaching;
        this.useHash = useHash;

        if (useHash) {
            window.addEventListener('hashchange', () => this.handleRoute());
        } else {
            window.addEventListener('popstate', () => this.handleRoute());
        }

        window.addEventListener('load', () => this.handleRoute());
    }

    addRoute(path: string, handler: () => HTMLElement | DocumentFragment) {
        this.routes.set(path, handler);
    }

    private async handleRoute() {
        let path: string;

        if (this.useHash) {
            path = window.location.hash.slice(1) || '/';
        } else {
            path = window.location.pathname || '/';
        }

        if (path === this.currentRoute) return;

        if (this.currentRoute) {
            ComponentLifecycle.executeOnUnmount();
        }

        const handler = this.routes.get(path) || this.routes.get('/404');
        if (handler) {
            let element: HTMLElement;

            if (this.enableCaching && this.routeCache.has(path)) {
                element = this.routeCache.get(path)!;
            } else {
                const content = handler();
                element = this.ensureHTMLElement(content);
                if (this.enableCaching) {
                    this.routeCache.set(path, element);
                }
            }

            const app = document.querySelector<HTMLDivElement>('#app')!;
            app.innerHTML = '';
            app.appendChild(element);

            this.currentRoute = path;

            requestAnimationFrame(() => {
                ComponentLifecycle.executeOnMount();
            });
        }
    }

    private ensureHTMLElement(content: HTMLElement | DocumentFragment): HTMLElement {
        if (content instanceof DocumentFragment) {
            const wrapper = document.createElement('div');
            wrapper.appendChild(content);
            return wrapper;
        }
        return content;
    }

    navigate(path: string) {
        if (path !== this.currentRoute) {
            if (this.useHash) {
                window.location.hash = path;
            } else {
                window.history.pushState({}, '', path);
                this.handleRoute();
            }
        }
    }

    preloadRoute(path: string) {
        if (!this.routeCache.has(path)) {
            const handler = this.routes.get(path);
            if (handler) {
                const content = handler();
                this.routeCache.set(path, this.ensureHTMLElement(content));
            }
        }
    }
}