import path from "path";
import webpack from "webpack";
import { fs } from "memfs";
import fetch from "node-fetch";
import getWebpackConfig from "../build/webpack-config";
import { renderHtml } from "../runtime/build";

type BuildPageOptions = {
  pagePath: string;
  port?: number;
  dev?: boolean;
};

export default async function buildPage({
  pagePath,
  port,
  dev,
}: BuildPageOptions) {
  Object.keys(require.cache)
    .filter((name) => name.includes(`${process.cwd()}/src`))
    .forEach((name) => {
      delete require.cache[name];
    });

  const pageModule = await import(pagePath);

  let props;
  if (typeof pageModule.getProps === "function") {
    console.log("🚚 Getting props");
    try {
      props = await pageModule.getProps(fetch);
    } catch (e) {
      console.error("❌ Failed to get props");
      throw e;
    }
  }

  const renderedHtml = renderHtml(pageModule.default, props);
  const compiler = webpack(
    getWebpackConfig({
      renderedHtml,
      pagePath,
      myjamData: JSON.stringify(props),
      dev,
      port,
    })
  );

  if (dev) {
    compiler.outputFileSystem = fs as any;
    compiler.outputFileSystem.join = path.join.bind(path);
  }

  return new Promise((res, rej) =>
    compiler.run((err: Error, stats: webpack.Stats) => {
      if (err) {
        return rej(err);
      }
      if (stats.hasErrors()) {
        return rej(stats.toString({ all: false, errors: true }));
      }
      res(stats.toString());
    })
  );
}
