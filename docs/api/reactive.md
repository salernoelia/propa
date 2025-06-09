# Reactivity API

Propa's reactivity system allows you to create data that, when changed, automatically triggers updates.

## `reactive<T>(initialValue: T): Reactive<T>`

Creates a reactive object or primitive.

- **`initialValue`**: The initial value for the reactive variable.
- **Returns**: A `Reactive<T>` instance.

Access and modify the underlying value using the `.value` property. Changes to `.value` schedule an update to the DOM.

```typescript
import { reactive } from '@salernoelia/propa';

const count = reactive(0);
console.log(count.value); // 0

count.value = 5; // Triggers update
console.log(count.value); // 5

const user = reactive({ name: 'Alex', age: 30 });
user.value.age = 31; // Triggers update
```

### `Reactive<T>` Instance

- **`.value: T`**: Gets or sets the reactive value. Setting it triggers reactivity.
- **`.subscribe(callback: () => void): () => void`**: Subscribes to changes in the reactive value. Returns an unsubscribe function.

## `computed<T>(computation: () => T): ComputedReactive<T>`

Creates a computed property that derives its value from other reactive sources.

- **`computation`**: A function that calculates the value. Reactive dependencies accessed within this function are automatically tracked.
- **Returns**: A `ComputedReactive<T>` instance.

The computed value is cached and only re-evaluates when its dependencies change.

```typescript
import { reactive, computed } from '@salernoelia/propa';

const firstName = reactive('John');
const lastName = reactive('Doe');

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
console.log(fullName.value); // "John Doe"

firstName.value = 'Jane';
// fullName.value will update to "Jane Doe" after the next update cycle
```

### `ComputedReactive<T>` Instance

- **`.value: T`**: Gets the computed value. Re-computes if dependencies have changed and the value is stale.
- **`.subscribe(callback: () => void): () => void`**: Subscribes to changes in the computed value. Returns an unsubscribe function.
- **`.invalidate()`**: Manually marks the computed value as stale, forcing re-computation on next access.
