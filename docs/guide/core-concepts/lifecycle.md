# Component Lifecycle

Propa provides simple lifecycle hooks, `onMount` and `onUnmount`, to manage side effects, set up resources, and clean up when components are added to or removed from the DOM.

These hooks are managed by the `ComponentLifecycle` utility.

## `ComponentLifecycle.onMount()`

The `onMount` hook registers a callback function that executes after the component's DOM elements have been mounted to the document. It's ideal for:

*   Fetching initial data.
*   Setting up event listeners (that are not directly handled by JSX `onEvent` props).
*   Initializing third-party libraries that require a DOM element.
*   Starting timers or animations.

```tsx
import { h, ComponentLifecycle } from '@salernoelia/propa';

function Timer() {
  let intervalId: number;

  ComponentLifecycle.onMount(() => {
    console.log('Timer component mounted. Starting interval...');
    intervalId = setInterval(() => {
      console.log('Tick!');
    }, 1000);

    // The function returned from onMount will be used as the onUnmount callback
    return () => {
      clearInterval(intervalId);
      console.log('Timer component unmounted. Clearing interval.');
    };
  });

  return <div>Check the console for timer output.</div>;
}
```

## `ComponentLifecycle.onUnmount()`

The `onUnmount` hook registers a callback function that executes just before the component's DOM elements are removed from the document. This is the place for cleanup:

*   Clearing intervals or timeouts.
*   Removing manually added event listeners.
*   Disposing of any resources created in `onMount`.

You can register an `onUnmount` callback in two ways:
1.  By returning a function from an `onMount` callback (as shown in the `Timer` example above). This is the most common pattern for cleaning up resources initialized in `onMount`.
2.  By explicitly calling `ComponentLifecycle.onUnmount()`:

```tsx
import { h, ComponentLifecycle, reactive } from '@salernoelia/propa';

function DataFetcher() {
  const data = reactive<string | null>(null);

  ComponentLifecycle.onMount(async () => {
    console.log('DataFetcher mounted. Fetching data...');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    data.value = "Data loaded successfully!";
  });

  ComponentLifecycle.onUnmount(() => {
    console.log('DataFetcher unmounted. Any cleanup for DataFetcher itself.');
    // e.g., if there were subscriptions to cancel not tied to a specific onMount
  });

  return <div>{data.value === null ? 'Loading data...' : data.value}</div>;
}
```

## How Lifecycle Hooks are Managed

*   **Association with Components**: When `onMount` or `onUnmount` are called within the synchronous execution of a functional component, Propa associates these lifecycle callbacks with that component instance.
*   **Execution with Router**: When using Propa's `Router`, `onUnmount` callbacks for the outgoing route's components are executed first, followed by the mounting of the new route's components, and then their `onMount` callbacks are executed.
*   **Manual Management**: If you are manually adding and removing components from the DOM (outside of the router's control), you would need to manually trigger `ComponentLifecycle.executeOnMount()` and `ComponentLifecycle.executeOnUnmount()` at appropriate times, potentially with component IDs if you are using the more granular control offered by `createComponent()`. However, for typical application flow with the router, this is handled automatically.

Using these lifecycle hooks helps ensure that your components behave correctly and efficiently manage resources throughout their time in the application.
