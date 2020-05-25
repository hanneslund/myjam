const myjamInjectPage = require("./babel-plugins/myjamInjectPage");
const removeAssetImports = require("./babel-plugins/removeAssetImports");
const removePageExports = require("./babel-plugins/removePageExports");

module.exports = function getBabelConfig({ node, pagePath }) {
  return {
    presets: [
      [
        "@babel/preset-env",
        node
          ? {
              targets: {
                node: "current",
              },
            }
          : {
              useBuiltIns: "entry",
              corejs: 3,
              modules: false,
              exclude: ["transform-typeof-symbol"],
              targets: "> 0.5%, not dead, not ie 11, not op_mini all",
            },
      ],
      "@babel/preset-typescript",
    ],
    plugins: [
      [myjamInjectPage, { pagePath }],
      node && removeAssetImports,
      !node && [removePageExports, { pagePath }],
      [
        "@babel/plugin-transform-react-jsx",
        {
          runtime: "automatic",
          importSource: "myjam",
        },
      ],
      !node && [
        "@babel/plugin-transform-runtime",
        {
          useESModules: true,
          version: require("@babel/runtime/package.json").version,
          // absoluteRuntime?
        },
      ],
    ].filter(Boolean),
  };
};
