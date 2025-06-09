# Reactivity

Propa's reactivity system is at the heart of its dynamic UI updates. It allows you to create data that, when changed, automatically triggers updates to the parts of your application that depend on it.

## `reactive()`

The `reactive()` function creates a reactive object or primitive. When the `.value` property of a reactive variable is changed, Propa schedules an update to the DOM.

```tsx
import { h, reactive, ComponentLifecycle } from '@salernoelia/propa';

function Counter() {
  // Create a reactive number, initialized to 0
  const count = reactive(0);

  ComponentLifecycle.onMount(() => {
    console.log('Counter component mounted!');
  });

  return (
    <div>
      {/* Direct usage of reactive value in JSX */}
      <span>Count: {count}</span>
      <button onClick={() => count.value++}>Increment</button>
    </div>
  );
}

// To use this component:
// import { h } from '@salernoelia/propa';
// import { Counter } from './components/Counter'; // Adjust path
// const appRoot = document.getElementById('app');
// if (appRoot) appRoot.appendChild(<Counter />);
```

**Key points about `reactive()`:**
*   Access and modify the underlying value using the `.value` property.
*   When `.value` is set, Propa batches the update and re-renders relevant parts of the DOM efficiently using `requestAnimationFrame`.
*   Can be used with primitives (numbers, strings, booleans) and objects. When used with objects, changes to the object's properties will also trigger reactivity if done through the reactive proxy.

## `computed()`

Computed properties allow you to derive new reactive values from existing reactive sources. They automatically re-evaluate only when their underlying reactive dependencies change.

```tsx
import { reactive, computed } from '@salernoelia/propa';

const firstName = reactive('John');
const lastName = reactive('Doe');

// A computed property that combines first and last names
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

console.log(fullName.value); // Outputs: John Doe

// Change a dependency
firstName.value = 'Jane';

// fullName.value will automatically update.
// Due to batched updates, the change might be reflected in the next microtask/frame.
setTimeout(() => {
  console.log(fullName.value); // Outputs: Jane Doe
}, 0);
```

**Key points about `computed()`:**
*   The function passed to `computed` is the "computation" function.
*   It automatically tracks reactive dependencies accessed within the computation.
*   The computed value is cached and only re-calculated when a dependency changes.
*   Like `reactive` values, computed values are accessed via their `.value` property.

Propa's reactivity system is designed to be efficient and intuitive, enabling you to build complex, dynamic user interfaces with minimal boilerplate.
