import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Propa",
  description: "Documentation for the Propa TypeScript Framework.",
  base: '/propa/',
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Philosophy', link: '/philosophy' },
      { text: 'API Reference', link: '/api/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Reactivity', link: '/guide/core-concepts/reactivity' },
            { text: 'JSX & Rendering', link: '/guide/core-concepts/jsx' },
            { text: 'Component Lifecycle', link: '/guide/core-concepts/lifecycle' },
            { text: 'Routing', link: '/guide/core-concepts/routing' },
          ]
        },
        {
          text: 'Integrations',
          items: [
            { text: 'P5.js', link: '/guide/integrations/p5js' },
            { text: 'WebAssembly (WASM)', link: '/guide/integrations/wasm' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Reactivity', link: '/api/reactive' },
            { text: 'JSX & Rendering', link: '/api/jsx' },
            { text: 'Component Lifecycle', link: '/api/lifecycle' },
            { text: 'Router', link: '/api/router' },
            { text: 'P5.js Integration', link: '/api/p5' },
            { text: 'WebAssembly (WASM)', link: '/api/wasm' },
          ]
        }
      ],
      '/': [
        {
          text: 'Overview',
          items: [
            { text: 'Philosophy', link: '/philosophy' }
          ]
        },
        {
          text: 'VitePress Examples',
          items: [
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/salernoelia/propa' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Elias Salerno'
    }
  }
})
