# zustand-tanstack-devtools

[![npm version](https://img.shields.io/npm/v/zustand-tanstack-devtools)](https://www.npmjs.com/package/zustand-tanstack-devtools)
[![license](https://img.shields.io/npm/l/zustand-tanstack-devtools)](./LICENSE)

TanStack DevTools plugin for inspecting Zustand stores.

## Features

- **Multi-store tabs** — switch between multiple Zustand stores in a single panel
- **JSON tree viewer** — collapsible, syntax-highlighted state tree
- **Snapshot history** — automatically records the last 20 state changes per store
- **Diff highlighting** — changed keys flash on update so you can spot mutations instantly
- **Clipboard export** — copy the current state as JSON with one click
- **Production-safe** — returns a no-op plugin in production for dead-code elimination

## Installation

```bash
npm install zustand-tanstack-devtools
```
or
```bash
yarn install zustand-tanstack-devtools
```
or
```bash
pnpm add zustand-tanstack-devtools
```


## Quick Start

```tsx
import { create } from "zustand";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ZustandDevtoolsPlugin } from "zustand-tanstack-devtools";

// 1. Create your stores
const useBearStore = create((set) => ({
  bears: 0,
  increase: () => set((s) => ({ bears: s.bears + 1 })),
}));

const useFishStore = create((set) => ({
  fishes: 0,
  add: () => set((s) => ({ fishes: s.fishes + 1 })),
}));

// 2. Create the plugin
const zustandPlugin = ZustandDevtoolsPlugin({
  stores: [
    { name: "Bears", store: useBearStore },
    { name: "Fish", store: useFishStore },
  ],
});

// 3. Add it to TanStack DevTools
function App() {
  return (
    <>
      <YourApp />
      <TanStackDevtools plugins={[zustandPlugin]} />
    </>
  );
}
```

## API Reference

### `ZustandDevtoolsPlugin(options)`

Creates a TanStack DevTools plugin instance.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `stores` | `StoreConfig[]` | _(required)_ | Zustand stores to inspect |
| `id` | `string` | `"zustand-devtools"` | Unique plugin ID |
| `name` | `string` | `"Zustand"` | Tab label shown in DevTools |
| `defaultOpen` | `boolean` | `false` | Whether the panel starts open |

### `StoreConfig`

```ts
interface StoreConfig<T = unknown> {
  name: string;        // Display name for the store tab
  store: StoreApi<T>;  // Zustand store instance
}
```

## Peer Dependencies

| Package | Version |
| --- | --- |
| `react` | `>=18` |
| `react-dom` | `>=18` |
| `zustand` | `>=4` |
| `@tanstack/react-devtools` | `>=0.7.0` |

## License

[MIT](./LICENSE)
