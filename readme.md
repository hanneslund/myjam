# myjam

Experimental framework for building web interfaces (Wannabe React & Next.js).

## Getting started

Checkout the [example](packages/example/).

### Install

```console
yarn add myjam
```

### Add scripts

```json
{
  "scripts": {
    "dev": "myjam dev",
    "build": "myjam build",
    "type-check": "myjam type-check"
  }
}
```

### Add entry file (src/index.tsx)

```tsx
export default function App() {
  return <h1>myjam!</h1>;
}
```

### **dev** command

Starts a dev server that rebuilds the project on changes.

```console
$ myjam dev
⏳ Starting dev server
🎉 Dev server started: http://localhost:3000
```

### **build** command

Exports the site as pre-rendered static files.

```console
$ myjam build
🛠️ Building
🎉 Build successful!
```

### **type-check command**

Type checks the project with tsc.

```console
$ myjam type-check
✨  Done in 3.51s.
```

## Features

### **getProps** function

Only runs at build time, returned value is sent to the entry point component.

```typescript
export const getProps: GetPropsFunction<Props> = async (
  fetch /* node-fetch */
) => {
  const fs = await import("fs");
  const data = await fs.promises.readFile("./data.json", { encoding: "utf-8" });
  return JSON.parse(data);
};
```

### Styling

Tailwind works out of the box.

```tsx
<div class="border shadow">Hello world!</div>
```

```tsx
<div class={{ "border shadow": !disabled, hidden: disabled }}>Hello world!</p>
```

### Hooks

```typescript
import {
  useState,
  useReducer,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "myjam";
```
