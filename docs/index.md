---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Propa Framework"
  text: "Lean & Performant TypeScript Web Framework"
  tagline: Build reactive web applications with first-class WebAssembly and P5.js integration. Zero dependencies, pure TypeScript.
  image:
    src: /logo.png # Assuming logo.png is in docs/public
    alt: Propa Framework Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Core Concepts
      link: /guide/core-concepts/reactivity
    - theme: alt
      text: View on GitHub
      link: https://github.com/salernoelia/propa # Placeholder, replace with actual link

features:
  - title: "⚡ Zero Dependencies"
    details: Pure TypeScript implementation for a minimal runtime footprint and maximum control.
  - title: "🚀 Smart Reactivity"
    details: Efficient, batched DOM updates with automatic dependency tracking and subscription management.
  - title: "⚛️ JSX Support"
    details: Compile-time JSX transformation into native DOM operations, offering a familiar declarative syntax without a virtual DOM.
  - title: "🔗 WebAssembly Integration"
    details: Seamless, type-safe loading and execution of WASM modules (e.g., Rust compiled to WASM).
  - title: "🎨 P5.js Canvas"
    details: A dedicated wrapper for embedding and managing p5.js sketches, perfect for creative coding.
  - title: "🛣️ Minimal Routing"
    details: Hash-based routing with robust component lifecycle management for single-page applications.
---

