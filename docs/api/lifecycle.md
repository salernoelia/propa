# Component Lifecycle API

The `ComponentLifecycle` class provides hooks to manage side effects and resources within components.

## `ComponentLifecycle`

A static class for managing component mount and unmount callbacks.

### `ComponentLifecycle.onMount(callback: () => void | (() => void), componentId?: number)`

Registers a callback to be executed after a component (or the global scope if `componentId` is omitted) is mounted to the DOM.

- **`callback`**: The function to execute. If this function returns another function, that returned function will be automatically registered as an `onUnmount` callback for the same component/scope.
- **`componentId`** (optional): The ID of the component to associate this lifecycle hook with. Used internally by features like `createP5Sketch`. For general use in functional components, `componentId` is usually omitted, and the hook applies to the current component context.

```typescript
import { h, ComponentLifecycle } from '@salernoelia/propa';

function MyComponent() {
  ComponentLifecycle.onMount(() => {
    console.log('Component Mounted!');
    return () => {
      console.log('Component Unmounted!'); // Cleanup function
    };
  });
  return <div>Hello</div>;
}
```

### `ComponentLifecycle.onUnmount(callback: () => void, componentId?: number)`

Registers a callback to be executed just before a component (or the global scope) is unmounted from the DOM.

- **`callback`**: The function to execute for cleanup.
- **`componentId`** (optional): The ID of the component.

```typescript
import { h, ComponentLifecycle } from '@salernoelia/propa';

function DataFetcher() {
  let intervalId;
  ComponentLifecycle.onMount(() => {
    intervalId = setInterval(() => console.log('Fetching...'), 1000);
  });
  ComponentLifecycle.onUnmount(() => {
    clearInterval(intervalId);
    console.log('Interval cleared.');
  });
  return <div>Fetching data...</div>;
}
```

### Internal Methods (Generally not for direct use)

- `ComponentLifecycle.createComponent(): number`: Creates a unique ID for a component, used internally for associating lifecycle hooks.
- `ComponentLifecycle.executeOnMount(componentId?: number)`: Executes all registered `onMount` callbacks for a specific component or all active components.
- `ComponentLifecycle.executeOnUnmount(componentId?: number)`: Executes all registered `onUnmount` callbacks and cleans up resources for a specific component or all active components.
