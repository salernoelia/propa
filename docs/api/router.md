# Router API

Propa's `Router` class enables hash-based or path-based (via History API) routing for single-page applications.

## `new Router(enableCaching?: boolean, useHash?: boolean)`

Creates a new Router instance.

- **`enableCaching`** (optional, default: `false`): If `true`, caches rendered route components to speed up navigation to previously visited routes.
- **`useHash`** (optional, default: `true`): If `true`, uses hash-based routing (`#/...`). If `false`, uses the History API for path-based routing (`/...`). Note: Path-based routing requires server-side configuration to handle direct page loads.

```typescript
import { Router } from '@salernoelia/propa';

const router = new Router(true, true); // Enable caching, use hash routing
```

## Router Instance Methods

### `addRoute(path: string, handler: () => HTMLElement | DocumentFragment)`

Adds a route definition.

- **`path`**: The route path (e.g., `'/'`, `'/about'`, `'/users/:id'`).
- **`handler`**: A function that returns the `HTMLElement` or `DocumentFragment` to be rendered for this route.

```typescript
const HomePage = () => document.createElement('h1').appendChild(document.createTextNode('Home')).parentNode;
router.addRoute('/', HomePage);
router.addRoute('/404', () => document.createTextNode('Not Found'));
```

### `navigate(path: string)`

Programmatically navigates to the given path.

- **`path`**: The destination route path.

```typescript
button.onclick = () => router.navigate('/about');
```

### `preloadRoute(path: string)`

Preloads the content for a given route if caching is enabled and the route is not already cached.

- **`path`**: The route path to preload.

```typescript
// Preload the /settings route when hovering over a link
link.onmouseenter = () => router.preloadRoute('/settings');
```

### Lifecycle Integration

The router automatically manages component lifecycle:

- When navigating away from a route, `ComponentLifecycle.executeOnUnmount()` is called.
- After the new route's content is rendered and appended to the DOM, `ComponentLifecycle.executeOnMount()` is called within a `requestAnimationFrame` callback.
