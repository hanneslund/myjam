/* eslint-disable @typescript-eslint/no-var-requires */
import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import getBabelConfig from "./babel-config";
import { publicDir } from "./shared";

const cwd = process.cwd();
const tailwindCssFile = require.resolve("../tailwind.css");

type WebpackConfigOptions = {
  renderedHtml: string;
  pagePath: string;
  myjamData?: string;
  port?: number;
  dev?: boolean;
};

export default function getWebpackConfig({
  renderedHtml,
  pagePath,
  myjamData,
  port,
  dev,
}: WebpackConfigOptions): webpack.Configuration {
  return {
    mode: dev ? "development" : "production",
    bail: true,
    entry: require.resolve("../entry.tsx"),
    output: {
      filename: dev ? "[name].js" : "[contenthash].js",
      path: publicDir,
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: (filePath) => {
            return (
              filePath.includes("node_modules") &&
              !filePath.includes(path.join(__dirname, ".."))
            );
          },
          use: {
            loader: "babel-loader",
            options: getBabelConfig({
              node: false,
              pagePath,
            }),
          },
        },
        {
          test: /\.css$/,
          exclude: tailwindCssFile,
          use: dev
            ? ["style-loader", "css-loader"]
            : [
                MiniCssExtractPlugin.loader,
                "css-loader",
                {
                  loader: "postcss-loader",
                  options: {
                    plugins: [require("autoprefixer"), require("cssnano")],
                  },
                },
              ],
        },
        {
          test: tailwindCssFile,
          use: dev
            ? "null-loader"
            : [
                MiniCssExtractPlugin.loader,
                "css-loader",
                {
                  loader: "postcss-loader",
                  options: {
                    plugins: [
                      require("tailwindcss")({
                        purge: [`${cwd}/src/**/*.{js,ts,tsx}`],
                      }),
                      require("autoprefixer"),
                      require("cssnano"),
                    ],
                  },
                },
              ],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    devtool: dev ? "cheap-module-source-map" : false,
    plugins: [
      new HtmlWebpackPlugin({
        title: "myjam app",
        template: require.resolve("../template.html"),
        renderedHtml,
        myjamData,
        dev,
        port,
        minify: {
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
      }),
      !dev &&
        new MiniCssExtractPlugin({
          filename: "[contenthash].css",
        }),
    ].filter(Boolean) as webpack.Plugin[],
  };
}
