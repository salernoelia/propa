# Philosophy & Design

Propa is designed for developers who value performance, control, and a deep understanding of their application's behavior. It aims to provide a modern reactive programming experience without unnecessary abstractions.

## Why Choose Propa?

Propa offers a unique blend of features for building efficient and interactive web applications:

* **Simplicity**: A small API surface that's easy to learn and master. Propa focuses on providing essential tools, allowing you to build without a steep learning curve.
* **Transparency**: No hidden magic. Propa's reactive system and DOM updates are straightforward, giving you clear insight into how your UI behaves and changes.
* **Performance**: By avoiding a virtual DOM and leveraging batched updates, Propa minimizes overhead and ensures fast rendering. WebAssembly integration further allows for near-native speed for complex tasks.
* **Flexibility**: Integrate with existing libraries (like P5.js) and new web technologies (like WebAssembly) effortlessly. Propa doesn't impose a rigid structure, allowing you to adapt it to your project's needs.
* **Developer Experience**: Enjoy the benefits of reactive programming and JSX in a lightweight package. Type safety with TypeScript is a first-class citizen.

If you're looking for a framework that empowers you to build fast, robust, and interactive web applications without getting bogged down by heavy abstractions, Propa is for you.

## Performance Benefits

Propa is engineered for performance through several key design choices:

* **No Virtual DOM**: Directly manipulates the real DOM, avoiding the overhead associated with virtual DOM diffing and reconciliation.
* **Batched Updates**: Multiple reactive changes within a single event loop tick are automatically batched and applied in a single `requestAnimationFrame`. This minimizes browser reflows and repaints, leading to smoother animations and UI updates.
* **Tiny Bundle Size**: With zero runtime dependencies, your application bundle only contains your code and Propa's lean core. This results in faster load times and reduced bandwidth consumption.
* **Native Speed with WASM**: Offload computationally intensive tasks to WebAssembly for near-native performance. Propa provides helpers for seamless WASM integration.

## Use Cases

Propa is well-suited for a variety of web applications, particularly those where performance and direct DOM control are crucial:

* **High-Performance Web Tools**: Professional software that requires responsive UIs and efficient data handling.
* **Interactive Data Visualizations**: Combine reactive data with P5.js for dynamic charts, graphs, and generative art.
* **Applications Requiring WASM**: Leverage WebAssembly for complex calculations, image processing, physics simulations, or integrating Rust/C++ libraries directly in the browser.
* **Rapid Prototyping**: Quickly build interactive UIs with a declarative JSX syntax and minimal boilerplate, ideal for iterating on ideas fast.

## License

This project is under the MIT license and is maintained by [Elia Salerno](https://eliasalerno.ch/).
