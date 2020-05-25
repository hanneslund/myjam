module.exports = function removePageExports(_, { pagePath }) {
  return {
    visitor: {
      ExportNamedDeclaration(path, { filename }) {
        if (filename !== pagePath) return;
        path.remove();
      },
    },
  };
};
