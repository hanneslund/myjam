#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const getBabelConfig = require("../build/babel-config");

const [, , command] = process.argv;

const commands = ["dev", "build"];
if (!commands.includes(command)) {
  console.log(`
  Usage:
    $ myjam <command>
  
  Commands:
    ${commands.join(", ")}

  Entry point:
    src/index.tsx
`);
  process.exit(0);
}

const pagePath = path.join(process.cwd(), "./src/index.tsx");
if (!fs.existsSync(pagePath)) {
  console.error("🔍 Couldn't find `src/index.tsx`");
  process.exit(1);
}

require("@babel/register")({
  ignore: [
    (filePath) => {
      return (
        filePath.includes("node_modules") &&
        !filePath.includes(path.join(__dirname, ".."))
      );
    },
  ],
  ...getBabelConfig({ build: true, pagePath }),
  extensions: [".ts", ".tsx", ".js"],
});

if (command === "build") {
  process.env.NODE_ENV = "production";
  require("../commands/build").default(pagePath);
}

if (command === "dev") {
  process.env.NODE_ENV = "development";
  require("../commands/dev").default(pagePath);
}
