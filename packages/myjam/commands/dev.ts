import actualFs from "fs";
import { createServer } from "http";
import getPort from "get-port";
import chokidar from "chokidar";
import { fs } from "memfs";
import buildPage from "../build/buildPage";
import { publicDir } from "../build/shared";

export default async function startDevServer(pagePath: string) {
  console.log("⏳ Starting dev server");

  const port = await getPort({ port: 3000 });

  let reloadFns: Array<() => void> = [];

  try {
    await buildPage({ pagePath, port, dev: true });
  } catch (e) {
    console.error("🙀 Build failed");
    console.error(e);
    return;
  }

  let isBuilding = false;
  chokidar
    .watch(`${process.cwd()}/src`, {
      ignored: /node_modules/,
    })
    .on("change", async () => {
      if (isBuilding) return;
      isBuilding = true;

      console.log("🛠️ Rebuilding");
      try {
        await buildPage({ pagePath, port, dev: true });
      } catch (e) {
        console.error("🙀 Build failed");
        console.error(e);
        isBuilding = false;
        return;
      }

      console.log("🎉 Rebuild successful!");
      reloadFns.forEach((reload) => {
        reload();
      });

      isBuilding = false;
    });

  const server = createServer(async (req, res) => {
    if (req.url === "/__myjam_dev__") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const writeFn = () => res.write("data:reload\n\n");
      reloadFns.push(writeFn);
      req.on("close", () => {
        reloadFns = reloadFns.filter((wf) => wf !== writeFn);
      });

      return;
    }

    if (req.url === "/tailwind.css") {
      res.setHeader("Cache-Control", "public, max-age=3600, immutable");
      res.setHeader("Content-Type", "text/css");
      actualFs
        .createReadStream(require.resolve("tailwindcss/dist/tailwind.min.css"))
        .pipe(res);
      return;
    }
    const file = req.url?.slice(1) || "index.html";
    const filePath = `${publicDir}/${file}`;

    try {
      if (!fs.existsSync(filePath)) throw new Error("Not found: " + file);
      fs.createReadStream(filePath).pipe(res);
    } catch (e) {
      return res.writeHead(404).end(e.message);
    }
  });

  server.listen(port);
  server.on("listening", () => {
    console.log(`🎉 Dev server started: http://localhost:${port}`);
  });
}
