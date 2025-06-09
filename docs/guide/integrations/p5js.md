# P5.js Integration

Propa provides a seamless way to integrate [p5.js](https://p5js.org/) sketches into your reactive web applications, allowing for creative coding and interactive visualizations.

## `createP5Sketch()`

The `createP5Sketch` utility function is used to embed a p5.js sketch within your Propa components.

**Prerequisites:**
Ensure you have `p5` installed as a dependency in your project:

```bash
npm install p5
# If using TypeScript, also install its types
npm install @types/p5 --save-dev
```

**Usage:**

```tsx
import { h } from '@salernoelia/propa';
import { createP5Sketch } from '@salernoelia/propa';
import p5 from 'p5'; // Import p5

const MyP5Sketch = () => {
  // This is your p5.js sketch function
  const sketch = (p: p5) => {
    let x = 0;
    let y = 100;
    let speed = 2;

    p.setup = () => {
      p.createCanvas(400, 200);
      p.background(220);
    };

    p.draw = () => {
      p.background(220); // Redraw background to clear previous frames
      p.fill(p.frameCount % 255, 100, 200); // Color changes over time
      p.ellipse(x, y, 50, 50);

      x += speed;
      if (x > p.width || x < 0) {
        speed *= -1; // Reverse direction
      }
    };

    // You can also define other p5 event functions like mousePressed, keyPressed, etc.
    p.mousePressed = () => {
      // Example: change ellipse color on mouse press
      p.fill(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    };
  };

  // Use createP5Sketch to create the DOM element for the sketch
  return createP5Sketch({
    sketch: sketch, // Your sketch function
    containerClass: 'my-custom-p5-canvas', // Optional CSS class for the container
    containerStyle: 'border: 2px solid purple; margin-top: 1rem;' // Optional inline styles
  });
};

// Example of using this component in another component or page:
// function App() {
//   return (
//     <div>
//       <h2>My Interactive Art</h2>
//       <MyP5Sketch />
//       <p>Below the P5 sketch.</p>
//     </div>
//   );
// }
```

### How it Works

1. **Sketch Function**: You define a standard p5.js sketch function that takes a `p5` instance (`p`) as an argument. Inside this function, you implement `p.setup()`, `p.draw()`, and any other p5.js event handlers.
2. **`createP5Sketch(props)`**:
    * `sketch`: Your p5.js sketch function.
    * `containerClass` (optional): A string for CSS class(es) to be applied to the `div` container that will host the p5 canvas.
    * `containerStyle` (optional): A string for inline CSS styles to be applied to the container `div`.
3. **Lifecycle Management**: `createP5Sketch` handles the p5.js instance lifecycle.
    * **Mounting**: When the component containing the sketch is mounted to the DOM, a new `p5` instance is created using your sketch function and attached to a generated `div` element.
    * **Unmounting**: When the component is unmounted, the `p5Instance.remove()` method is called to properly clean up the canvas and free resources, preventing memory leaks.

This integration makes it easy to embed dynamic, interactive graphics and animations created with p5.js directly into your Propa application's component structure.
