module.exports = function removeAssetImports() {
  return {
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value.endsWith(".css")) {
          path.remove();
        }
      },
    },
  };
};
