module.exports = function envIfStatements({ types }, { dev, build }) {
  return {
    visitor: {
      IfStatement(path) {
        updateIfStatement(path, types, "__DEV__", dev);
        updateIfStatement(path, types, "__BUILD__", build);
        updateIfStatement(path, types, "__CLIENT__", !build);
      },
    },
  };
};

function updateIfStatement(path, t, name, keep) {
  if (!path.node) return;
  const { test } = path.node;
  if (t.isIdentifier(test, { name })) {
    if (keep) {
      path.node.test.name = true;
    } else {
      path.remove();
    }
  }
}
