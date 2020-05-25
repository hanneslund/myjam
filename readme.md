# myjam

Experimental framework for building web interfaces (Wannabe React & Next.js).

## Getting started

Chekout the [example](packages/example/).

### **dev** command

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

## Features

### **getProps** function

Only runs at built time, returned value is sent to the entry point component.

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

### hooks.. kinda

```typescript
import { useState, useEffect } from "myjam";
```

> only useState & useEffect
>
> useEffect only supports onMount and onDismount at the moment.
