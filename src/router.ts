import { ComponentLifecycle } from './lifecycle';

export class Router {
    private routes: Map<string, () => HTMLElement> = new Map();
    private currentRoute: string | null = null;
    private routeCache: Map<string, HTMLElement> = new Map();
    private enableCaching: boolean;

    constructor(enableCaching = false) {
        this.enableCaching = enableCaching;
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    addRoute(path: string, handler: () => HTMLElement) {
        this.routes.set(path, handler);
    }

    private async handleRoute() {
        const hash = window.location.hash.slice(1) || '/';

        if (hash === this.currentRoute) return;

        if (this.currentRoute) {
            ComponentLifecycle.executeOnUnmount();
        }

        const handler = this.routes.get(hash);
        if (handler) {
            let element: HTMLElement;

            if (this.enableCaching && this.routeCache.has(hash)) {
                element = this.routeCache.get(hash)!;
            } else {
                element = handler();
                if (this.enableCaching) {
                    this.routeCache.set(hash, element);
                }
            }

            const app = document.querySelector<HTMLDivElement>('#app')!;

            const fragment = document.createDocumentFragment();
            fragment.appendChild(element);

            app.innerHTML = '';
            app.appendChild(fragment);

            this.currentRoute = hash;

            // Use requestAnimationFrame for better timing
            requestAnimationFrame(() => {
                ComponentLifecycle.executeOnMount();
            });
        } else {
            this.routes.get('/404')?.();
        }
    }

    navigate(path: string) {
        if (path !== this.currentRoute) {
            window.location.hash = path;
        }
    }

    preloadRoute(path: string) {
        if (!this.routeCache.has(path)) {
            const handler = this.routes.get(path);
            if (handler) {
                this.routeCache.set(path, handler());
            }
        }
    }
}