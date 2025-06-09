# Routing

Propa includes a minimal, hash-based router for building single-page applications (SPAs). It allows you to define routes and associate them with components that should be rendered when the route is active.

## Setting up the Router

First, instantiate the `Router` and define your routes.

```tsx
// src/router.ts
import { Router, h } from '@salernoelia/propa';

// Define your page components
const HomePage = () => <h1>Welcome Home!</h1>;
const AboutPage = () => <p>Learn more about Propa.</p>;
const NotFoundPage = () => <h2>404 - Page Not Found</h2>;

// Initialize the router
// Parameters: enableCaching (default: false), useHash (default: true)
export const router = new Router(false, true);

// Add routes
router.addRoute('/', () => <HomePage />);
router.addRoute('/about', () => <AboutPage />);
router.addRoute('/404', () => <NotFoundPage />); // Optional fallback for unknown routes

// You might also want a default fallback if /404 is not explicitly navigated to
// router.addRoute('*', () => <NotFoundPage />); // Or handle this in handleRoute logic
```

## Integrating with Your Application

In your main application file (e.g., `main.ts` or `main.tsx`), you need to tell the router to handle the initial route when the application loads.

```tsx
// src/main.tsx
import { h } from '@salernoelia/propa';
import { router } from './router'; // Your router instance
// Import other necessary components or styles

// Example App structure (optional, depends on your setup)
function AppContainer() {
  return (
    <div>
      <nav>
        <a href="#/">Home</a> | <a href="#/about">About</a>
      </nav>
      <div id="app-content">
        {/* The router will render content here if #app is its target */}
      </div>
    </div>
  );
}

// The router, by default, looks for an element with id="app" to render content.
// Ensure this element exists in your index.html.

// If you have a main layout component, render it.
// const appRoot = document.getElementById('app');
// if (appRoot) {
//   // If you have a global layout like AppContainer, you might render it first.
//   // The router will then manage a sub-section of this layout, or replace #app entirely.
//   // For simplicity, Propa's router typically replaces the content of #app.
// }

// The router listens to 'load' and 'hashchange' events automatically.
// So, calling router.handleRoute() explicitly on load is usually not needed
// if the router is instantiated early in your app's lifecycle.
// However, if you need to ensure it runs after specific setup:
// window.addEventListener('load', () => router.handleRoute());
```

The `Router` constructor automatically adds event listeners for `hashchange` and `load`, so it will handle the initial route and subsequent navigation. The router renders content into an element with `id="app"`. Make sure this element exists in your `index.html`.

```html
<!-- index.html -->
<body>
  <div id="app">
    <!-- Router content will be injected here -->
  </div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

## Navigating Programmatically

You can change routes programmatically using the `router.navigate()` method.

```tsx
import { router } from './router'; // Your router instance

// Example: Navigate to the /about page after a button click
function MyButton() {
  return <button onClick={() => router.navigate('/about')}>Go to About</button>;
}
```

## Route Caching

The `Router` can be configured to cache rendered route components to speed up navigation between previously visited routes.

```typescript
// Enable caching
const router = new Router(/* enableCaching: */ true, /* useHash: */ true);
```

When caching is enabled, Propa keeps the DOM elements of visited routes in memory. Navigating back to a cached route will use the stored elements instead of re-creating them. Lifecycle hooks (`onMount`, `onUnmount`) are still managed correctly.

## Lifecycle Management

The router integrates with Propa's `ComponentLifecycle`:

* When navigating away from a route, `onUnmount` callbacks for the components of the old route are executed.
* When navigating to a new route, the new route's component function is called to generate the DOM, and then `onMount` callbacks for the new components are executed.

This ensures proper setup and cleanup of resources as users navigate through your application.
