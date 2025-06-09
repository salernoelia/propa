# JSX and Rendering

Propa supports JSX (JavaScript XML) for a declarative and familiar way to describe UI structures. Unlike frameworks that use a Virtual DOM, Propa's JSX is compiled directly into native DOM operations at build time.

## Setting up JSX

To use JSX with Propa, you need to configure your build tool (e.g., Vite) and TypeScript.

**Vite Configuration (`vite.config.ts`):**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'h',       // Propa's JSX factory
    jsxFragment: 'Fragment', // Propa's JSX Fragment
  },
});
```

**TypeScript Configuration (`tsconfig.json`):**

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react", // Or "react-jsx"
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    "lib": ["DOM", "ES2020"],
    // ... other options
  }
}
```

Propa provides `h` as the JSX factory function and `Fragment` for grouping multiple elements without a wrapper.

## Basic Usage

Here's how you can use JSX to create elements:

```tsx
import { h } from '@salernoelia/propa'; // 'h' is implicitly used by JSX

function MyComponent() {
  const name = 'Propa User';
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>This is a Propa component rendered with JSX.</p>
    </div>
  );
}

// Rendering the component
// const appRoot = document.getElementById('app');
// if (appRoot) appRoot.appendChild(<MyComponent />);
```

## Reactive Values in JSX

You can directly embed `reactive` and `computed` values within your JSX. Propa will automatically update the corresponding text nodes when these values change.

```tsx
import { h, reactive } from '@salernoelia/propa';

function InteractiveGreeting() {
  const name = reactive('Guest');

  return (
    <div>
      <input
        type="text"
        value={name.value} // Bind to reactive value for input control (one-way)
        onInput={(e) => (name.value = (e.target as HTMLInputElement).value)}
      />
      <p>Hello, {name}!</p> {/* name will update automatically */}
    </div>
  );
}
```

## Conditional Rendering with `when()`

Propa provides a `when()` helper for conditional rendering based on a reactive condition.

```tsx
import { h, reactive, when } from '@salernoelia/propa';

function ConditionalMessage() {
  const showMessage = reactive(true);

  return (
    <div>
      <button onClick={() => showMessage.value = !showMessage.value}>
        Toggle Message
      </button>
      {when(showMessage, <p>This message is shown conditionally!</p>)}
    </div>
  );
}
```

The `when` helper takes a reactive boolean (or a `ComputedReactive<boolean>`) as its first argument and the JSX element to render as its second. The element will be added or removed from the DOM based on the condition's value.

## Fragments

To return multiple elements without a wrapping parent, you can use Fragments. Ensure `Fragment` is imported or available in scope if your `jsxFragmentFactory` is set to `Fragment`.

```tsx
import { h, Fragment } from '@salernoelia/propa'; // Or just h if Fragment is globally available via tsconfig

function UserProfile() {
  return (
    <> {/* This is a shorthand for <Fragment> */}
      <h2>User Details</h2>
      <p>Name: John Doe</p>
      <p>Status: Active</p>
    </>
  );
}
```

If you've configured `jsxFragmentFactory: "Fragment"` in `tsconfig.json` and `vite.config.ts`, you might need to ensure `Fragment` is available, often by importing it from Propa if it's exported, or by defining a simple `Fragment` function if Propa expects it. Propa's `h` function typically handles fragments passed as children arrays. The example `src/jsx.ts` doesn't explicitly export `Fragment` but `h` handles arrays of children, which is what fragments compile to. For explicit fragment syntax `<></>`, ensure your setup correctly resolves it.

Propa's JSX approach aims for simplicity and performance by translating familiar syntax directly to efficient DOM manipulations.
