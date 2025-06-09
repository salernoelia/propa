# JSX & Rendering API

Propa uses JSX for describing UI structures, which is transformed into direct DOM manipulations.

## `h(tag: string | Function, props: Record<string, any> | null, ...children: any[]): HTMLElement | DocumentFragment`

The JSX factory function (hyperscript). This function is typically not called directly when using JSX syntax but is what JSX compiles to.

- **`tag`**: An HTML tag name (e.g., `'div'`) or a functional component.
- **`props`**: An object of attributes/properties for the element or props for the component.
  - `className`: Sets the `class` attribute.
  - `ref`: A callback function that receives the created DOM element.
  - Event handlers (e.g., `onClick`): Attached as event listeners.
- **`...children`**: Child elements or text content.

```tsx
import { h, reactive } from '@salernoelia/propa';

// Equivalent to: <div><p>Hello</p></div>
const element = h('div', null, h('p', null, 'Hello'));

// With props and reactive children
const count = reactive(0);
const counterElement = h('div', null,
  h('span', null, 'Count: '),
  h('span', null, count) // Reactive value automatically updates
);
```

When a reactive variable is used as a child, its text content in the DOM will automatically update when the reactive variable's value changes.

## `when(condition: Reactive<boolean> | ComputedReactive<boolean>, element: () => HTMLElement | DocumentFragment | HTMLElement | DocumentFragment): any`

A helper for conditional rendering in JSX.

- **`condition`**: A `Reactive<boolean>` or `ComputedReactive<boolean>` instance that determines visibility.
- **`element`**: The JSX element (or a function returning one) to render if the condition is true.

The `when` function returns a special object that the `h` function understands. The actual element is added or removed from the DOM based on the reactive condition.

```tsx
import { h, reactive, when } from '@salernoelia/propa';

const showMessage = reactive(true);

const ui = (
  <div>
    <button onClick={() => showMessage.value = !showMessage.value}>
      Toggle
    </button>
    {when(showMessage, <p>This is a conditional message!</p>)}
  </div>
);
```

## `clearAllReactiveSubscriptions()`

A utility function to clear all globally tracked reactive subscriptions created by the `h` function for text nodes and conditional rendering. This is primarily useful for testing or specific scenarios where you need to manually reset the reactive bindings managed by JSX rendering. In typical application flow with the router, component unmounting handles cleanup.
