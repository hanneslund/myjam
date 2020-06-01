#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const getBabelConfig = require("../build/babel-config");

const [, , command] = process.argv;

const commands = ["dev", "build", "type-check"];
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

const cwd = process.cwd();

const pagePath = path.join(cwd, "./src/index.tsx");
if (!fs.existsSync(pagePath)) {
  console.error("🔍 Couldn't find `src/index.tsx`");
  process.exit(1);
}

// Add tsconfig if it doesn't exist
const tsconfigPath = path.join(cwd, "./tsconfig.json");
if (!fs.existsSync(tsconfigPath)) {
  const tsconfig = fs.readFileSync(require.resolve("../tsconfig.json"), {
    encoding: "utf-8",
  });
  fs.writeFileSync(tsconfigPath, tsconfig);
}

if (command === "type-check") {
  const { status } = require("child_process").spawnSync(
    require.resolve("../node_modules/.bin/tsc"),
    { stdio: "inherit" }
  );
  if (status !== 0) {
    process.exit(status);
  }
  process.exit(0);
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
  process.exit(0);
}

if (command === "dev") {
  process.env.NODE_ENV = "development";
  require("../commands/dev").default(pagePath);
  process.exit(0);
}
